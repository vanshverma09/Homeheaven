import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user?.isAdmin ?? false;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        priceLabel: data.price,
        type: data.type,
        category: data.category,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        image: data.image,
        images: data.images || [],
        amenities: [],
      }
    });

    return NextResponse.json({ message: "Property created", property }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating property", error: error.message }, { status: 500 });
  }
}
