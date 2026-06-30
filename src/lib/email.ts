export async function sendProductRequestEmail(
  vendor: { name: string; email: string; companyName?: string | null },
  request: {
    id: string;
    title: string;
    category: string;
    description: string;
    quantity: string;
    unit: string;
    targetCity: string;
    budgetMin: number | null;
    budgetMax: number | null;
    mediaUrls?: string[];
  }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Email] RESEND_API_KEY not set — broadcast not sent to ${vendor.email}`);
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://stonamart.com"; // Use NEXT_PUBLIC_APP_URL for consistency
  const respondUrl = `${baseUrl}/vendor/requests?requestId=${request.id}`;

  const budgetText =
    request.budgetMin && request.budgetMax
      ? `₹${Number(request.budgetMin).toLocaleString("en-IN")} – ₹${Number(request.budgetMax).toLocaleString("en-IN")} per ${request.unit}`
      : request.budgetMin
      ? `from ₹${Number(request.budgetMin).toLocaleString("en-IN")} per ${request.unit}`
      : "Negotiable";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#3a2f26;background:#FDFBF8;">
  <h1 style="font-size:26px;font-weight:bold;margin-bottom:4px;">Stonamart</h1>
  <p style="color:#999;font-size:12px;font-family:sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:36px;">Sourcing Request — Action Required</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">Dear ${vendor.companyName ?? vendor.name},</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">We have an <strong>urgent customer sourcing request</strong> and you may have the product. Please review the details below:</p>
  <div style="background:#fff;border:1px solid #e8e0d5;border-radius:12px;padding:24px;margin:28px 0;">
    <p style="font-size:11px;font-family:sans-serif;color:#B8865A;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Product Required</p>
    <h2 style="font-size:20px;font-weight:bold;color:#3a2f26;margin:0 0 16px;">${request.title}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;font-size:12px;font-family:sans-serif;color:#888;width:120px;">Category</td><td style="padding:6px 0;font-size:14px;color:#333;">${request.category}</td></tr>
      ${request.quantity ? `<tr><td style="padding:6px 0;font-size:12px;font-family:sans-serif;color:#888;">Quantity</td><td style="padding:6px 0;font-size:14px;color:#333;">${request.quantity} ${request.unit}</td></tr>` : ""}
      ${request.targetCity ? `<tr><td style="padding:6px 0;font-size:12px;font-family:sans-serif;color:#888;">Location</td><td style="padding:6px 0;font-size:14px;color:#333;">${request.targetCity}</td></tr>` : ""}
      <tr><td style="padding:6px 0;font-size:12px;font-family:sans-serif;color:#888;">Budget</td><td style="padding:6px 0;font-size:14px;color:#333;font-weight:bold;">${budgetText}</td></tr>
    </table>
    ${request.description ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid #f0ece6;"><p style="font-size:12px;font-family:sans-serif;color:#888;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.1em;">Additional Details</p><p style="font-size:14px;color:#555;line-height:1.7;margin:0;">${request.description}</p></div>` : ""}
    ${request.mediaUrls && request.mediaUrls.length > 0 ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid #f0ece6;"><p style="font-size:12px;font-family:sans-serif;color:#888;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em;">Reference Photos</p><div style="display:flex;gap:8px;flex-wrap:wrap;">${request.mediaUrls.slice(0, 4).map((url) => `<img src="${url}" alt="Reference" style="width:120px;height:90px;object-fit:cover;border-radius:8px;border:1px solid #e8e0d5;" />`).join("")}</div></div>` : ""}
  </div>
  <p style="font-size:15px;line-height:1.8;color:#333;">If you have this product available, click below to let us know and share your pricing:</p>
  <div style="text-align:center;margin:32px 0;">
    <a href="${respondUrl}" style="display:inline-block;background:#B8865A;color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-family:sans-serif;font-size:14px;font-weight:bold;letter-spacing:0.05em;">I Have This Product</a>
  </div>
  <p style="font-size:13px;line-height:1.7;color:#888;">This request has been sent to all Stonamart registered vendors. First to respond with matching stock gets priority. Log in to your vendor portal for more details.</p>
  <p style="font-size:15px;line-height:1.8;color:#333;margin-top:36px;">Best regards,<br/><strong>Stonamart Sourcing Team</strong></p>
  <div style="border-top:1px solid #e8e0d5;margin-top:40px;padding-top:20px;">
    <p style="font-size:11px;color:#bbb;font-family:sans-serif;">© 2024 Stonamart · Premium Natural Stone Marketplace<br/>You received this because you are a registered Stonamart vendor.</p>
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
        to: [vendor.email],
        subject: `🔍 Sourcing Request: ${request.title} — Stonamart`,
        html,
      }),
    });
    if (!res.ok) console.error("[Email] Resend error:", await res.text());
  } catch (err) {
    console.error("[Email] sendProductRequestEmail failed:", err);
  }
}

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
<body style="font-family:'Georgia',serif;max-width:580px;margin:0 auto;padding:40px 24px;color:#3a2f26;background:#FDFBF8;">
  <h1 style="font-size:26px;font-weight:bold;margin-bottom:4px;">Stonamart</h1>
  <p style="color:#999;font-size:12px;font-family:sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:36px;">Vendor Application Update</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">Dear ${toName},</p>
  <p style="font-size:15px;line-height:1.8;color:#333;">Thank you for applying to the Stonamart Vendor Program. After reviewing your application, we are unable to approve it at this time.</p>
  <div style="border-left:3px solid #B8865A;padding:14px 20px;background:#fff;border-radius:6px;margin:28px 0;">
    <p style="font-size:11px;font-family:sans-serif;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Reason for rejection</p>
    <p style="font-size:15px;color:#3a2f26;margin:0;line-height:1.7;">${reason}</p>
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
