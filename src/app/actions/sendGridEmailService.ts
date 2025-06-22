"use server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);

export async function sendVerificationMail(email: string, token: string) {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

  const mail = {
    to: email,
    from: process.env.NEXT_PUBLIC_SENDGRID_EMAIL as string,
    subject: "Verify your email!",
    text: "This is a verification email.",
    html: `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
                    .verification-button { margin: 20px 0; }
                    .button { background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
                    .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; }
                    .small { font-size: 12px; color: #7f8c8d; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">Verify Your Account</div>
                <p>Hello,</p>
                <p>Thank you for signing up with LEGION Fitness. Please verify your email address by clicking the button below:</p>
                
                <div class="verification-button">
                    <a href="${verificationLink}" class="button">Verify Email Address</a>
                </div>
                
                <p class="small">This link will expire in 24 hours. If you didn't request this verification, you can safely ignore this email.</p>
                
                <div class="footer">
                    <p>Best regards,<br>LEGION Fitness Team</p>
                </div>
            </body>
            </html>`,
  };

  try {
    await sgMail.send(mail);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    return { success: false };
  }
}

export async function sendLoginCredentials(email: string, password: string) {
  const loginLink = "http://localhost:3000/login";

  const mail = {
    to: email,
    from: process.env.NEXT_PUBLIC_SENDGRID_EMAIL as string,
    subject: "Your LEGION Fitness Login Credentials",
    text: `Here are your login credentials for LEGION Fitness.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately for security reasons.`,
    html: `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
                    .credentials-box { background: #f8f9fa; border: 1px solid #eaeaea; padding: 15px; border-radius: 4px; margin: 20px 0; }
                    .login-button { margin: 20px 0; }
                    .button { background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
                    .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; }
                    .warning { color: #e74c3c; font-weight: bold; }
                    .small { font-size: 12px; color: #7f8c8d; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">Your LEGION Fitness Account</div>
                <p>Hello,</p>
                <p>Here are your login credentials for accessing your LEGION Fitness account:</p>
                
                <div class="credentials-box">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                
                <p class="warning">For your security, please change your password immediately after logging in.</p>
                
                <div class="login-button">
                    <a href="${loginLink}" class="button">Login to Your Account</a>
                </div>
                
                <p class="small">If you didn't request this account, please contact our support team immediately.</p>
                
                <div class="footer">
                    <p>Best regards,<br>LEGION Fitness Team</p>
                </div>
            </body>
            </html>`,
  };
  try {
    await sgMail.send(mail);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    return { success: false };
  }
}
