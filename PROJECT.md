# Stack of Napkins — Project Context

## What it is
AI agency that builds and deploys custom agents for professional services businesses (law firms, medical practices, real estate, etc.). Positioned as "custom AI employees", not consulting or automation tools.

## Status
Site live at stackofnapkins.com. Pre-launch — no clients yet.

## Stack
Static HTML, Supabase, Resend, Vercel

## Pages
- `light.html` — homepage
- `work.html` — cases + industry use cases
- `contact.html` — contact form (wired to Supabase + email notification)

## Credentials
See `/Users/tp/projects/stack-of-napkins/.env.local`

## Domains & Services
- Domain: stackofnapkins.com (GoDaddy)
- Email: hello@stackofnapkins.com (Google Workspace + Resend verified)
- Office: 625 Broad St Suite 240, Newark NJ 07102
- Supabase: https://hqnhovkfofbxfqtftewa.supabase.co
  - RLS enabled: inserts public, reads blocked
  - pg_net trigger: new contact → email to hello@stackofnapkins.com
- Deployed: Vercel (auto-deploy from main)

## Open
- First client
- Contact page — Gmail integration pending
- Zashi owns design — briefs in workspace-design/projects/stack-of-napkins/
