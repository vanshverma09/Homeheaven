import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const saved = await prisma.savedProperty.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ savedProperties: saved }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching saved properties", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { propertyId } = await req.json();
    if (typeof propertyId !== "number") {
      return NextResponse.json({ message: "Invalid property ID" }, { status: 400 });
    }

    const saved = await prisma.savedProperty.create({
      data: { userId, propertyId },
    });
    return NextResponse.json({ message: "Property saved", savedProperty: saved }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Property already saved" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error saving property", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const propertyId = parseInt(searchParams.get("propertyId") || "");

    if (isNaN(propertyId)) {
      return NextResponse.json({ message: "Invalid property ID" }, { status: 400 });
    }

    await prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        }
      }
    });
    return NextResponse.json({ message: "Property removed" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error removing property", error: error.message }, { status: 500 });
  }
}
