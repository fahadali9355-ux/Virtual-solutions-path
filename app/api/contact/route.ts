import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Plain-text version (anti-spam requirement)
    const textContent = `
New Contact Form Inquiry - VSP

Name: ${firstName} ${lastName}
Email: ${email}

Message:
${message}

---
Virtual Solution Path | Bank Lane, near State Bank, Faisalabad, Pakistan
    `.trim();

    const mailOptions = {
      from: `"VSP Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,  // ✅ Reply directly to the sender
      subject: `New Inquiry from ${firstName} ${lastName}`,
      text: textContent, // ✅ Plain-text fallback (anti-spam)
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f7f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#082F49;padding:24px 36px;">
          <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">VSP Contact Form</h1>
          <p style="color:#93c5fd;margin:4px 0 0;font-size:12px;">New message received</p>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <strong style="color:#374151;">Name:</strong>
              <span style="color:#4b5563;margin-left:8px;">${firstName} ${lastName}</span>
            </td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">
              <strong style="color:#374151;">Email:</strong>
              <a href="mailto:${email}" style="color:#0284c7;margin-left:8px;">${email}</a>
            </td></tr>
            <tr><td style="padding:16px 0 0;">
              <strong style="color:#374151;display:block;margin-bottom:8px;">Message:</strong>
              <div style="background:#f8fafc;border-left:4px solid #0284c7;padding:14px 16px;border-radius:0 8px 8px 0;color:#374151;line-height:1.7;">${message}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 36px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Virtual Solution Path &bull; Faisalabad, Pakistan</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      headers: {
        "X-Mailer": "VSP-ContactForm-1.0",
      },
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email Sent Successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}
