import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record;

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
      <h2 style="font-size: 22px; font-weight: 700; color: #0C0B1A; margin-bottom: 4px;">New contact form submission</h2>
      <p style="color: #9996AA; font-size: 13px; margin-bottom: 28px;">Stack of Napkins — ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6B6880; font-size: 13px; width: 120px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 500;">${record.first_name} ${record.last_name}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6B6880; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><a href="mailto:${record.email}" style="color: #7B6EF6;">${record.email}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6B6880; font-size: 13px;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${record.company || '—'}</td></tr>
        <tr><td style="padding: 10px 0; color: #6B6880; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; font-size: 14px; line-height: 1.7; color: #0C0B1A;">${record.message || '—'}</td></tr>
      </table>

      <div style="margin-top: 28px;">
        <a href="mailto:${record.email}?subject=Re: Your inquiry — Stack of Napkins" style="display: inline-block; background: #7B6EF6; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Reply to ${record.first_name} →</a>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Stack of Napkins <hello@stackofnapkins.com>",
      to: ["hello@stackofnapkins.com"],
      subject: `New inquiry from ${record.first_name} ${record.last_name} — ${record.company || record.email}`,
      html,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
});
