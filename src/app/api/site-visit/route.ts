import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteVisitSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = siteVisitSchema.parse(body);

    // Save to database
    const visit = await prisma.siteVisit.create({
      data: validatedData,
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
