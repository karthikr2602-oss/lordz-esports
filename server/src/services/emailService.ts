import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devOtp?: string;
}

/**
 * Send Password Reset OTP Email via Resend
 */
export async function sendPasswordResetOtpEmail(
  toEmail: string,
  otp: string,
  recipientName: string = "Athlete"
): Promise<SendOtpResult> {
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL || "LORD ESPORTS <onboarding@resend.dev>";

  console.log(`\n======================================================`);
  console.log(`🔑 [AUTH OTP] Password Reset Code for: ${toEmail}`);
  console.log(`🔑 [AUTH OTP] Verification OTP: [ ${otp} ] (Valid for 10 minutes)`);
  console.log(`======================================================\n`);

  if (!resend) {
    console.warn("⚠️ [Resend] RESEND_API_KEY is not configured in server/.env. Using console OTP delivery.");
    return {
      success: true,
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    };
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Lord Esports — Password Reset Code</title>
  <style>
    body { margin: 0; padding: 0; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; }
    .container { max-width: 580px; margin: 0 auto; background-color: #0C0C10; border: 1px solid #22222A; border-radius: 16px; overflow: hidden; }
    .header { padding: 32px 24px; text-align: center; background: linear-gradient(180deg, #181820 0%, #0C0C10 100%); border-bottom: 1px solid #FFBE32/20; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(255, 190, 50, 0.15); border: 1px solid #FFBE32; border-radius: 20px; color: #FFBE32; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .title { margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #E5E7EB; margin-bottom: 16px; }
    .desc { font-size: 14px; color: #9CA3AF; margin-bottom: 24px; }
    .otp-box { background: #14141C; border: 2px dashed #FFBE32; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #FFBE32; margin: 0; }
    .otp-expiry { font-size: 12px; color: #9CA3AF; margin-top: 8px; }
    .security-note { font-size: 12px; color: #6B7280; background: #08080A; border-radius: 8px; padding: 14px; margin-top: 24px; border-left: 3px solid #FFBE32; }
    .footer { padding: 24px; text-align: center; font-size: 11px; color: #4B5563; border-top: 1px solid #181820; }
  </style>
</head>
<body>
  <div style="padding: 40px 16px;">
    <div class="container">
      <div class="header">
        <span class="badge">SECURITY VERIFICATION</span>
        <h1 class="title">LORD ESPORTS</h1>
        <p style="color: #9CA3AF; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Athlete Passport Verification</p>
      </div>
      
      <div class="content">
        <p class="greeting">Greetings ${recipientName},</p>
        <p class="desc">
          You requested to reset your password for the <strong>Lord Esports Portal</strong>. Use the 6-digit verification code below to authorize your password change.
        </p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-expiry">⏳ Code expires in <strong>10 minutes</strong></div>
        </div>
        
        <div class="security-note">
          <strong>Security Advisory:</strong> If you did not initiate this password reset request, please disregard this email. Your athlete credentials remain secure.
        </div>
      </div>
      
      <div class="footer">
        © ${new Date().getFullYear()} LORD ESPORTS CLAN. All Rights Reserved.<br>
        Premier Indian Esports Tournaments & Pro Gaming Organization.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `[${otp}] Your Lord Esports Password Reset Code`,
      html: htmlContent,
    });

    if (error) {
      console.warn("⚠️ [Resend] Email delivery warning:", error.message);
      return {
        success: true, // Still allow flow since code is logged to server console
        error: error.message,
        devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }

    console.log(`✅ [Resend] Password reset email successfully dispatched to ${toEmail} (ID: ${data?.id})`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: any) {
    console.error("❌ [Resend] Exception sending email:", err.message);
    return {
      success: true,
      error: err.message,
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    };
  }
}
