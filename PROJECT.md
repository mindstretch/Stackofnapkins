# Stack of Napkins — Project Context

## What it is
AI agency that builds and deploys custom agents for professional services businesses (law firms, medical practices, real estate, etc.). Positioned as "custom AI employees", not consulting or automation tools.

## Status
Site live at stackofnapkins.com. Pre-launch — no clients yet.

## Stack
Static HTML, Supabase, Resend, Vercel, Supabase Edge Functions (Deno)

## Pages
- `light.html` — homepage
- `work.html` — case studies + industry use cases (6 verticals)
- `contact.html` — contact form (wired to Supabase + email flows)
- `services.html`, `process.html`, `about.html` — supporting pages
- `case-dental.html`, `case-law.html` — individual case study pages

## Credentials
See `/Users/tp/projects/stack-of-napkins/.env.local`

## Domains & Services
- Domain: stackofnapkins.com (GoDaddy)
- Email: hello@stackofnapkins.com (Google Workspace + Resend verified)
- Office: 625 Broad St Suite 240, Newark NJ 07102
- Supabase: https://hqnhovkfofbxfqtftewa.supabase.co
  - RLS enabled: inserts public, reads blocked
  - pg_net trigger on contact_submissions → fires Edge Function on INSERT
- Edge Function: `notify-contact` — deployed, sends internal notification + confirmation email via Resend
- Deployed: Vercel (auto-deploy from main)

## Email Flow (contact form)
1. User submits contact.html → POST to Supabase REST API
2. Supabase INSERT triggers `on_contact_submission` (pg_net)
3. pg_net calls Edge Function `notify-contact`
4. Edge Function sends two emails via Resend:
   - Internal: to hello@stackofnapkins.com (full submission details)
   - Confirmation: to submitter (dark-theme branded email, dry wit voice)

## Open
- First client (MIN-108)
- Twilio SMS setup (MIN-111)
- Google Business API access (MIN-112)
- Guardian security product pages (MIN-113, MIN-114)
- Playbook doc (MIN-116)
