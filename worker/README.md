# NIW inquiry worker

A small Cloudflare Worker that receives the consultation form on
nobleantwi.com/niw-consulting/ and emails it through Resend. Nothing is
stored; the email is the record.

## Deploy, once

From this folder:

```bash
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

The first deploy creates `forms.nobleantwi.com` in DNS automatically,
because the zone is already on Cloudflare.

`consulting@nobleantwi.com` must be a sender the Resend domain allows.
The domain is already verified for the lab digest, so any address at
nobleantwi.com works.

## Optional: Turnstile

The honeypot field stops simple bots. For invisible human verification:

1. Cloudflare dashboard, Turnstile, Add widget, hostname `nobleantwi.com`,
   widget mode Managed.
2. `npx wrangler secret put TURNSTILE_SECRET` with the secret key.
3. Put the site key in `src/data/niw.ts` on the site and redeploy the site.

Until both halves exist the worker skips the check, so the form keeps
working either way.

## Test

```bash
curl -X POST https://forms.nobleantwi.com/inquiry \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"you@example.com","role":"Engineer","field":"Cybersecurity","degree":"Master","timeline":"6 to 12 months","background":"Testing the form."}'
```

You should receive the inquiry, and the test address should receive the
acknowledgement.
