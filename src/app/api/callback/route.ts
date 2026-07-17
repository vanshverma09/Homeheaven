import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callbackSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = callbackSchema.parse(body);

    // Save to database
    const request = await prisma.callbackRequest.create({
      data: validatedData,
    });

    return NextResponse.json(
      { message: "Callback requested successfully", data: request },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { message: "Failed to submit request", error: error.message },
      { status: 400 }
    );
  }
}
