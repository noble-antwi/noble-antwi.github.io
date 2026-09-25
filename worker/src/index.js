/**
 * NIW consultation inquiry receiver.
 *
 * POST /inquiry  (form-encoded from the page, or JSON)
 *   1. rejects bots: honeypot field, and Cloudflare Turnstile when configured
 *   2. validates the seven fields
 *   3. emails the inquiry to Noble through Resend, reply-to set to the sender
 *   4. emails the sender a short acknowledgement
 *   5. redirects a browser to the thanks page, or returns JSON to fetch()
 *
 * Nothing is stored anywhere. The email is the record.
 */

const FIELDS = ['name', 'email', 'role', 'field', 'degree', 'timeline', 'background'];
const LIMITS = { name: 120, email: 200, role: 160, field: 120, degree: 80, timeline: 60, background: 6000 };

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/inquiry') {
      return new Response('Not found', { status: 404, headers: cors });
    }

    let data;
    try {
      data = await readBody(request);
    } catch {
      return fail(request, env, cors, 400, 'Could not read the form.');
    }

    // Honeypot: real people never see this field, so anything in it is a bot.
    if (data.company) return ok(request, env, cors); // pretend it worked

    const clean = {};
    for (const f of FIELDS) {
      const v = String(data[f] ?? '').trim();
      if (!v) return fail(request, env, cors, 400, `Please fill in the ${f} field.`);
      clean[f] = v.slice(0, LIMITS[f]);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      return fail(request, env, cors, 400, 'That email address does not look right.');
    }

    if (env.TURNSTILE_SECRET) {
      const token = data['cf-turnstile-response'];
      const verified = await verifyTurnstile(env.TURNSTILE_SECRET, token, request.headers.get('CF-Connecting-IP'));
      if (!verified) return fail(request, env, cors, 400, 'The anti-spam check did not pass. Please try again.');
    }

    if (!env.RESEND_API_KEY) return fail(request, env, cors, 500, 'The inquiry service is not configured yet.');

    const submitted = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const country = request.headers.get('CF-IPCountry') || '';

    const toNoble = send(env, {
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      reply_to: clean.email,
      subject: `NIW inquiry: ${clean.name}, ${clean.field}`,
      text: inquiryText(clean, submitted, ip, country),
      html: inquiryHtml(clean, submitted, ip, country),
    });

    const toSender = send(env, {
      from: env.FROM_EMAIL,
      to: [clean.email],
      reply_to: env.REPLY_TO,
      subject: 'Received: your NIW consultation request',
      text: ackText(clean),
      html: ackHtml(clean),
    });

    const [a] = await Promise.allSettled([toNoble, toSender]);
    if (a.status === 'rejected') return fail(request, env, cors, 502, 'The message could not be sent. Please email nobleantwi3@gmail.com directly.');

    return ok(request, env, cors);
  },
};

/* ------------------------------------------------------------------ helpers */

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
  if (allowed.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

async function readBody(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return await request.json();
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

function wantsHtml(request) {
  return (request.headers.get('Accept') || '').includes('text/html');
}

function ok(request, env, cors) {
  if (wantsHtml(request)) return Response.redirect(env.REDIRECT_URL, 303);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function fail(request, env, cors, status, message) {
  if (wantsHtml(request)) {
    const u = new URL(env.REDIRECT_URL);
    u.searchParams.set('error', message);
    return Response.redirect(u.toString(), 303);
  }
  return new Response(JSON.stringify({ ok: false, error: message }), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const j = await r.json().catch(() => ({}));
  return j.success === true;
}

async function send(env, payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const LABELS = {
  name: 'Name', email: 'Email', role: 'Current role', field: 'Field or discipline',
  degree: 'Highest degree', timeline: 'Target filing timeline', background: 'Background and goals',
};

function inquiryText(d, when, ip, country) {
  const lines = FIELDS.map((f) => `${LABELS[f]}: ${f === 'background' ? '\n' + d[f] : d[f]}`);
  return `New NIW consultation request\n\n${lines.join('\n')}\n\nSubmitted ${when} from ${ip}${country ? ' (' + country + ')' : ''}.\nReply to this email to answer ${d.name} directly.`;
}

function inquiryHtml(d, when, ip, country) {
  const rows = FIELDS.filter((f) => f !== 'background').map((f) =>
    `<tr><td style="padding:8px 14px 8px 0;color:#5a6678;font:13px/1.4 -apple-system,Segoe UI,sans-serif;white-space:nowrap;vertical-align:top">${LABELS[f]}</td><td style="padding:8px 0;color:#172a44;font:15px/1.5 -apple-system,Segoe UI,sans-serif">${esc(d[f])}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f7f4ef;padding:32px 16px;font-family:-apple-system,Segoe UI,sans-serif;color:#172a44">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e0d8ca;border-radius:12px">
<tr><td style="padding:22px 28px;border-bottom:3px solid #ca8327">
  <div style="font:11px/1 'JetBrains Mono',Menlo,monospace;letter-spacing:2px;text-transform:uppercase;color:#0f6b5f">NIW Consulting · new inquiry</div>
  <div style="margin-top:8px;font:400 26px/1.2 Georgia,serif;color:#123150">${esc(d.name)}</div>
</td></tr>
<tr><td style="padding:16px 28px 4px"><table role="presentation" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
<tr><td style="padding:8px 28px 24px">
  <div style="font:13px/1.4 -apple-system,Segoe UI,sans-serif;color:#5a6678;margin-bottom:6px">Background and goals</div>
  <div style="white-space:pre-wrap;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#172a44;background:#f7f4ef;border:1px solid #e0d8ca;border-radius:8px;padding:14px 16px">${esc(d.background)}</div>
</td></tr>
<tr><td style="padding:14px 28px 22px;border-top:1px solid #e0d8ca;font:12px/1.5 -apple-system,Segoe UI,sans-serif;color:#5a6678">
  Submitted ${esc(when)} from ${esc(ip)}${country ? ' (' + esc(country) + ')' : ''}. Reply to this email to answer ${esc(d.name)} directly.
</td></tr>
</table></td></tr></table></body></html>`;
}

function ackText(d) {
  return `Hi ${d.name},

Thank you for your consultation request. I have received it and will read your background before I reply, so you can expect a considered answer rather than a quick one, usually within two business days.

If anything changes in the meantime, just reply to this email.

Noble Antwi
NIW Consulting · nobleantwi.com/niw-consulting/

Noble Antwi is a writing and record-building consultant, not an attorney. He does not provide legal advice or represent petitioners before USCIS.`;
}

function ackHtml(d) {
  return `<!doctype html><html><body style="margin:0;background:#f7f4ef;padding:32px 16px;font-family:-apple-system,Segoe UI,sans-serif;color:#172a44">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e0d8ca;border-radius:12px">
<tr><td style="padding:22px 28px;border-bottom:3px solid #ca8327">
  <div style="font:11px/1 'JetBrains Mono',Menlo,monospace;letter-spacing:2px;text-transform:uppercase;color:#0f6b5f">NIW Consulting</div>
  <div style="margin-top:8px;font:400 26px/1.2 Georgia,serif;color:#123150">Received, thank you.</div>
</td></tr>
<tr><td style="padding:20px 28px;font:15px/1.65 -apple-system,Segoe UI,sans-serif">
  <p style="margin:0 0 14px">Hi ${esc(d.name)},</p>
  <p style="margin:0 0 14px">Thank you for your consultation request. I have received it and will read your background before I reply, so you can expect a considered answer rather than a quick one, usually within two business days.</p>
  <p style="margin:0 0 14px">If anything changes in the meantime, just reply to this email.</p>
  <p style="margin:0">Noble Antwi<br><span style="color:#5a6678">NIW Consulting · <a href="https://nobleantwi.com/niw-consulting/" style="color:#0f6b5f">nobleantwi.com/niw-consulting</a></span></p>
</td></tr>
<tr><td style="padding:14px 28px 22px;border-top:1px solid #e0d8ca;font:12px/1.5 -apple-system,Segoe UI,sans-serif;color:#5a6678">
  Noble Antwi is a writing and record-building consultant, not an attorney. He does not provide legal advice or represent petitioners before USCIS.
</td></tr>
</table></td></tr></table></body></html>`;
}
