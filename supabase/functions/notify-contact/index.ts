import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record;

  const firstName = record.first_name || "there";
  const messagePreview = (record.message || "").slice(0, 200) + ((record.message || "").length > 200 ? "…" : "");

  // ── 1. Internal notification email (to Tas) ──────────────────────────────
  const internalHtml = `
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

  // ── 2. Confirmation email (to submitter) ─────────────────────────────────
  const confirmationHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>We got it.</title>
</head>
<body style="margin:0;padding:0;background:#F7F6F3;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F7F6F3;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 24px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;">
          <tr>
            <td style="padding-bottom:40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation" style="display:inline-table;">
                      <tr><td style="width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(123,110,246,0.4);font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:rgba(20,18,28,0.45);letter-spacing:0.1px;">Stack of <span style="color:#7B6EF6;">Napkins</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="width:36px;height:2px;background:linear-gradient(90deg,#7B6EF6,#E8805A);border-radius:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:30px;font-weight:400;line-height:1.2;letter-spacing:-0.5px;color:#14121C;">We got it, ${firstName}.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;line-height:1.75;color:rgba(20,18,28,0.5);">Your message landed. Here's what happens next.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid rgba(20,18,28,0.09);border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:#7B6EF6;">Your message</p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;line-height:1.7;color:rgba(20,18,28,0.5);">&ldquo;${messagePreview}&rdquo;</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                <tr>
                  <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#7B6EF6;letter-spacing:0.3px;">01</span></td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#14121C;line-height:1.4;margin-bottom:3px;">A human reads this.</p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;color:rgba(20,18,28,0.5);line-height:1.6;">Yes, a real one. We're an AI company, not a bot company. Someone on our team reviews every inquiry personally.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                <tr><td style="height:1px;background:rgba(20,18,28,0.07);font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                <tr>
                  <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#7B6EF6;letter-spacing:0.3px;">02</span></td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#14121C;line-height:1.4;margin-bottom:3px;">We respond the same day. Usually faster.</p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;color:rgba(20,18,28,0.5);line-height:1.6;">If your situation is clear, we'll come back with a direct take — what we'd build, what it would do, what it would cost.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                <tr><td style="height:1px;background:rgba(20,18,28,0.07);font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#7B6EF6;letter-spacing:0.3px;">03</span></td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#14121C;line-height:1.4;margin-bottom:3px;">If it's a fit, we talk.</p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;color:rgba(20,18,28,0.5);line-height:1.6;">30 minutes. No pitch deck. We diagnose, you decide. Either way you leave knowing exactly what your ops would look like with a real agent running them.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:36px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:rgba(232,128,90,0.06);border:1px solid rgba(232,128,90,0.18);border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;line-height:1.65;color:#C96A3A;">The irony isn't lost on us — an AI agency sending you a confirmation email. At least this one got here in under a second.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:44px;">
              <p style="margin:0 0 16px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;color:rgba(20,18,28,0.45);line-height:1.6;">Want to add context, share a doc, or just talk sooner? Reply directly to this email.</p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#7B6EF6;border-radius:8px;">
                    <a href="mailto:hello@stackofnapkins.com" style="display:inline-block;padding:12px 24px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">Reply to this email &#8594;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid rgba(20,18,28,0.08);padding-top:28px;">
              <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:rgba(20,18,28,0.3);line-height:1.6;letter-spacing:0.02em;">
                <a href="https://stackofnapkins.com" style="color:rgba(20,18,28,0.3);text-decoration:none;">stackofnapkins.com</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:hello@stackofnapkins.com" style="color:rgba(20,18,28,0.3);text-decoration:none;">hello@stackofnapkins.com</a>
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:rgba(20,18,28,0.2);line-height:1.6;">625 Broad St Suite 240, Newark NJ 07102</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  // Fire both emails in parallel
  const [internalRes, confirmationRes] = await Promise.all([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Stack of Napkins <hello@stackofnapkins.com>",
        to: ["hello@stackofnapkins.com"],
        subject: `New inquiry from ${record.first_name} ${record.last_name} — ${record.company || record.email}`,
        html: internalHtml,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Stack of Napkins <hello@stackofnapkins.com>",
        reply_to: "hello@stackofnapkins.com",
        to: [record.email],
        subject: "We got it.",
        html: confirmationHtml,
      }),
    }),
  ]);

  const [internalData, confirmationData] = await Promise.all([
    internalRes.json(),
    confirmationRes.json(),
  ]);

  return new Response(
    JSON.stringify({ internal: internalData, confirmation: confirmationData }),
    { status: internalRes.ok && confirmationRes.ok ? 200 : 207 }
  );
});
