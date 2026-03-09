import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, code }: any) => {
  const emailUser = process.env.EMAIL_USER as string;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Plain-text fallback — spam filters ka sabse bada requirement
  const textContent = `
Virtual Solution Path

${text}

Your verification code: ${code}

This code expires in 10 minutes. If you did not request this, please ignore this email.

---
Virtual Solution Path | Bank Lane, near State Bank, Faisalabad, Pakistan
virtualsolutions.path@gmail.com
  `.trim();

  // Professional HTML Template
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#082F49;padding:28px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:1px;">Virtual Solution Path</h1>
              <p style="color:#93c5fd;margin:6px 0 0;font-size:13px;">Your Learning Partner</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#082F49;margin:0 0 16px;font-size:20px;">Verify Your Email Address</h2>
              <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 28px;">${text}</p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#eff6ff;border:2px solid #082F49;border-radius:10px;padding:18px 36px;text-align:center;">
                      <p style="margin:0 0 6px;font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
                      <span style="font-size:36px;font-weight:800;color:#082F49;letter-spacing:8px;">${code}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color:#9ca3af;font-size:13px;margin:28px 0 0;text-align:center;">
                ⏱ This code expires in <strong>10 minutes</strong>.<br/>
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Virtual Solution Path &bull; Bank Lane, near State Bank, Faisalabad, Pakistan<br/>
                <a href="mailto:virtualsolutions.path@gmail.com" style="color:#6b7280;text-decoration:none;">virtualsolutions.path@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Virtual Solution Path" <${process.env.EMAIL_USER}>`,
    replyTo: emailUser,
    to,
    subject,
    text: textContent,
    html: htmlContent,
    headers: {
      "X-Mailer": "VSP-Mailer-1.0",
      "List-Unsubscribe": `<mailto:${emailUser}?subject=unsubscribe>`,
      "Sender": emailUser,
    },
  });
};