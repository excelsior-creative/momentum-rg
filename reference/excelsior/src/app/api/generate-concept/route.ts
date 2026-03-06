import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// In-memory rate limiting store (use Redis in production for multi-instance)
const rateLimitStore = new Map<
  string,
  { count: number; firstRequest: number }
>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
    }
  }
}

// Get client IP from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

// Check rate limit for IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  cleanupRateLimitStore();

  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  // Reset if window has passed
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  // Skip verification in development or if no token provided
  const isDev = process.env.NODE_ENV === "development";

  if (!token) {
    console.warn("No reCAPTCHA token provided, skipping verification");
    return true; // Allow if no token (reCAPTCHA not configured on frontend)
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return true; // Allow if not configured
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

    const data = await response.json();

    console.log("reCAPTCHA response:", {
      success: data.success,
      score: data.score,
      action: data.action,
    });

    // For v3, check score threshold (0.3 is lenient, adjust as needed)
    // In dev mode, be more lenient
    const threshold = isDev ? 0.1 : 0.3;

    if (data.success && data.score >= threshold) {
      return true;
    }

    // If success but low score, still allow but log it
    if (data.success) {
      console.warn(
        `reCAPTCHA score too low: ${data.score} (threshold: ${threshold})`
      );
      // In dev, allow anyway
      if (isDev) return true;
    }

    console.warn("reCAPTCHA verification failed:", data);
    return false;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    // Allow on error in dev mode
    return isDev;
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Check rate limit first
    const { allowed, remaining } = checkRateLimit(clientIP);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message:
            "You have reached the maximum number of free generations. Please contact us for more.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const { email, brandDescription, recaptchaToken } = await request.json();

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        // Don't count this against rate limit - revert
        const record = rateLimitStore.get(clientIP);
        if (record && record.count > 0) {
          record.count--;
        }

        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!email || !brandDescription) {
      return NextResponse.json(
        { error: "Email and brand description are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Build the augmented prompt for website concept generation
    const augmentedPrompt = `Design a modern website homepage layout for a brand.

Brand: ${brandDescription}

CRITICAL REQUIREMENTS:
- Create ONLY the webpage design itself - NO browser window, NO browser chrome, NO URL bar
- NO desk, room, computer screen, or any environmental background
- The image should BE the actual webpage, filling the entire canvas edge-to-edge
- Full-bleed design with content starting from the very top of the image

Design Elements:
- Navigation bar at the top with logo and menu items
- Hero section with bold headline typography and call-to-action button
- Professional, modern aesthetic with clean visual hierarchy
- Cohesive color palette matching the brand personality
- High-quality imagery or graphics relevant to the brand
- Proper spacing, alignment, and contemporary design trends
- Make it look like a premium agency designed this website

Output: A clean, full-bleed website homepage design with no frames or backgrounds.`;

    // Call Replicate's Nano Banana Pro model
    const output = await replicate.run("google/nano-banana-pro", {
      input: {
        prompt: augmentedPrompt,
        resolution: "2K",
        image_input: [],
        aspect_ratio: "9:16",
        output_format: "png",
        safety_filter_level: "block_only_high",
      },
    });

    // Get the image URL from the output
    const imageUrl =
      typeof output === "object" && output !== null && "url" in output
        ? (output as { url: () => string }).url()
        : String(output);

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        email,
        remaining,
      },
      {
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Replicate API Error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return NextResponse.json(
          {
            error:
              "API authentication failed. Please check your Replicate API token.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate concept. Please try again." },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check remaining generations
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const record = rateLimitStore.get(clientIP);

  const used = record ? record.count : 0;
  const remaining = Math.max(0, RATE_LIMIT - used);

  return NextResponse.json({
    limit: RATE_LIMIT,
    used,
    remaining,
  });
}
