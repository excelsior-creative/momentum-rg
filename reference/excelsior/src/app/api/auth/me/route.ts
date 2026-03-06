import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify the token and get the user
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}

