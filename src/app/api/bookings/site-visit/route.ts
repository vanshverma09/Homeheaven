import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteVisitSchema } from "@/lib/validations";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = siteVisitSchema.parse(body);
    const userId = await getUserId();

    // Save to database
    const visit = await prisma.siteVisit.create({
      data: {
        ...validatedData,
        ...(userId && { userId }),
      },
    });

    return NextResponse.json(
      { message: "Site visit requested successfully", data: visit },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Site visit error:", error);
    return NextResponse.json(
      { message: "Failed to submit request", error: error.message },
      { status: 400 }
    );
  }
}
