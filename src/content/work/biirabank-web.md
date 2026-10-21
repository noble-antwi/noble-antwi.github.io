---
title: "biirabank.com: The Public Tier"
kicker: "Edge security · Cloudflare · Biira Bank"
summary: "Biira Bank's public website on Cloudflare Workers: zero JavaScript, a Content Security Policy with no script source at all, TLS 1.2 as the floor, and an independent security-header grade that moved from F to A+. Testing found the site still answering on a default hostname the zone's controls did not cover, and closed it."
category: cloud
status: active
statusLabel: "Live · hardening continues"
order: 25
period: "September 2026 to present"
role: "Design, build, harden, document"
repo: https://github.com/noble-antwi/biirabank-web
docs: https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/18-public-web-presence-and-edge-hardening.md
docsLabel: "Runbook 18: public web presence and edge hardening"
stack: ["Cloudflare Workers", "Static assets", "Wrangler", "HTML", "CSS", "Content Security Policy", "HSTS", "TLS 1.2+"]
relatedTags: ["cloudflare", "web-security", "csp", "tls", "homelab"]
hero: ../../assets/work/biirabank-web/site-home.png
heroAlt: "The biirabank.com homepage: a fictional bank's site with a banner stating it is not a real financial institution"
heroCaption: "biirabank.com. The ribbon, a section and the footer all say the same thing: Biira Bank is fictional, holds no deposits and provides no financial services."
stats:
  - { value: "F → A+", label: "Independent header grade" }
  - { value: "0", label: "Lines of JavaScript" }
  - { value: "6", label: "Security headers set at the edge" }
  - { value: "1.2", label: "Minimum TLS version" }
gallery:
  - src: ../../assets/work/biirabank-web/web-01-securityheaders-before-f.png
    alt: "securityheaders.com grading biirabank.com F before hardening"
    caption: "Before: grade F, five of the six headers missing, and the scan had reached the site over plain HTTP."
  - src: ../../assets/work/biirabank-web/web-02-securityheaders-after-aplus.png
    alt: "securityheaders.com grading biirabank.com A+ after hardening"
    caption: "About an hour later: A+, all six headers present over HTTPS, and the page served from the edge cache. The grader is public and not under the lab's control, which is the point."
---

## Why the lab needed a website

Everything else in the [Enterprise Security Homelab](/work/enterprise-security-homelab/) sits behind a firewall on private address space. That leaves out a whole class of controls that only exist at the edge: transport security a third party can grade, browser security headers, a web application firewall, bot filtering.

A public site brings those into scope. It also gives the lab's attack host a target that is legitimately in bounds, because the lab owns the domain, and it is where two later pieces of work will land: a sign-in hand-off into the lab's directory, and an AI support assistant governed as a non-human identity. Both need a real public surface to mean anything.

## How it is built

Plain HTML and CSS. No framework, no JavaScript, no build step. The `public/` folder is uploaded to Cloudflare's edge as **Worker static assets** with one `wrangler deploy`.

Static assets on Workers, rather than Cloudflare Pages, was a deliberate choice. It is Cloudflare's recommendation for new projects, and it leaves room for server-side code later, such as the sign-in hand-off, without a migration.

## How it is hardened

Every control is applied at the zone level and verified from outside Cloudflare's own dashboard.

| Control | Setting |
|---|---|
| Encryption mode | Full (Strict): the origin must present a certificate from a real authority |
| Minimum TLS | 1.2. Handshakes at 1.0 and 1.1 are refused, confirmed by attempting each |
| Always Use HTTPS | On. Plain HTTP redirects before any content is served |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | Set on every response by one transform rule |
| `Content-Security-Policy` | `default-src 'none'`, styles and fonts from the site and Google Fonts only, `frame-ancestors 'none'`, and no script source at all |
| Default `workers.dev` hostname | Disabled |
| Real User Monitoring | Off, because it injects a script and the policy allows none |

The Content Security Policy has no `script-src` because the page has no scripts. That is the strongest policy there is, and it is only possible because the site was built to deserve it: the one inline script it shipped with was removed rather than allowed. The styles were moved into their own file before the policy went on, because the order matters. Apply the policy first and the live page renders bare.

## The finding

After the custom domain was attached, the site was still reachable on its default `*.workers.dev` hostname, and the dashboard switches for that hostname appeared to be off. Every control in the table applies to `biirabank.com`, not to Cloudflare's own domain. So a visitor using the `workers.dev` name received the same page with none of the protections.

That is a textbook alternate-hostname bypass, the kind of finding that leads a penetration test report. It was found by testing rather than by reading the dashboard, and closed.

## Decisions worth explaining

**Measured from outside.** A hosting dashboard tells you what is configured. An independent grader, and a handshake attempted at each TLS version, tell you what a visitor actually gets.

**Build the page to deserve the policy.** Allowing one inline script would have been quicker. Removing it is what made a policy with no script source possible.

**Honest by design.** The site is a working demonstration, not a bank, and says so in three places. A realistic fictional organisation is useful only while nobody could mistake it for a real one.

## What is next

- The web application firewall's managed rules, with a captured example of a real blocked request.
- A second independent grade, from SSL Labs, covering the TLS work specifically.
- SPF, DMARC and a null MX record, so the domain cannot be used to send convincing mail.
- The sign-in hand-off into the lab's directory, and later the governed AI support assistant.
