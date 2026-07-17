import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
    }

    // In a real application, you would generate a token and send an email here.
    // For now, we just mock the success response.
    
    return NextResponse.json(
      { message: "If an account with that email exists, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Request failed", error: error.message }, { status: 500 });
  }
}
