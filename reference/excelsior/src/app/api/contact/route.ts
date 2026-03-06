import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

type ContactRequest = {
  name: string;
  email: string;
  message: string;
  recaptchaToken?: string;
};

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

async function verifyRecaptcha(
  token: string
): Promise<{ valid: boolean; score?: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return { valid: true };
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data: RecaptchaResponse = await response.json();

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const isValid =
      data.success && (data.score === undefined || data.score >= 0.5);

    return { valid: isValid, score: data.score };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { valid: false };
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateEmailHTML(
  name: string,
  email: string,
  message: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                Excelsior Creative
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">
                New Contact Inquiry
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Contact Details -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      From
                    </p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                      ${name}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Email
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #1a1a1a; font-size: 16px; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0 0 10px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Message
                    </p>
                    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5722; padding: 20px; border-radius: 0 4px 4px 0;">
                      <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${message}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your inquiry to Excelsior Creative" style="display: inline-block; background: linear-gradient(135deg, #FF5722 0%, #E91E63 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                      Reply to ${name.split(" ")[0]}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 25px 30px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                This message was sent via the contact form at 
                <a href="https://excelsiorcreative.com" style="color: #FF5722; text-decoration: none;">excelsiorcreative.com</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #444; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                © ${new Date().getFullYear()} Excelsior Creative
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();
    const { name, email, message, recaptchaToken } = body;

    // Verify reCAPTCHA if token is provided and secret key is configured
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);

      if (!recaptchaResult.valid) {
        console.warn("reCAPTCHA verification failed", {
          score: recaptchaResult.score,
        });
        return NextResponse.json(
          { error: "Security verification failed. Please try again." },
          { status: 403 }
        );
      }
    }

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Send email via Payload's native email adapter (configured with Resend)
    const payload = await getPayloadClient();

    await payload.sendEmail({
      to: "team@excelsiorcreative.com",
      from: "Excelsior Creative <noreply@excelsiorcreative.com>",
      replyTo: email,
      subject: `New Contact: ${name}`,
      html: generateEmailHTML(name.trim(), email.trim(), message.trim()),
    });

    return NextResponse.json({
      success: true,
      message: "We'll be in touch with you as soon as possible!",
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
