export async function sendRejectionEmail(
  toEmail: string,
  toName: string,
  reason: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Email] RESEND_API_KEY not set — rejection email not sent to ${toEmail}`);
    return;
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:'Georgia',serif;max-width:580px;margin:0 auto;padding:40px 24px;color:#0a0a0a;background:#faf9f7;">
  <h1 style="font-size:26px;font-weight:bold;margin-bottom:4px;">Stonamart</h1>
  <p style="color:#999;font-size:12px;font-family:sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:36px;">Vendor Application Update</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">Dear ${toName},</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">Thank you for applying to the Stonamart Vendor Program. After reviewing your application, we are unable to approve it at this time.</p>
  <div style="border-left:3px solid #c9a961;padding:14px 20px;background:#fff;border-radius:6px;margin:28px 0;">
    <p style="font-size:11px;font-family:sans-serif;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Reason for rejection</p>
    <p style="font-size:15px;color:#0a0a0a;margin:0;line-height:1.7;">${reason}</p>
  </div>
  <p style="font-size:15px;line-height:1.8;color:#333;">Please address the above and you are welcome to re-apply. For questions, reply directly to this email.</p>
  <p style="font-size:15px;line-height:1.8;color:#333;margin-top:36px;">Warm regards,<br/><strong>Stonamart Vendor Team</strong></p>
  <div style="border-top:1px solid #e8e0d5;margin-top:40px;padding-top:20px;">
    <p style="font-size:11px;color:#bbb;font-family:sans-serif;">© 2024 Stonamart · Premium Natural Stone Marketplace</p>
  </div>
</body></html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Stonamart <onboarding@resend.dev>",
        to: [toEmail],
        subject: "Your Stonamart Vendor Application — Update",
        html,
      }),
    });
    if (!res.ok) console.error("[Email] Resend error:", await res.text());
  } catch (err) {
    console.error("[Email] Failed:", err);
  }
}
