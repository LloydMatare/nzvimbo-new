// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clerkId, email, role, firstName, lastName, businessName, preferences } = body;

    // Create user in database
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        firstName,
        lastName,
        role: role.toUpperCase(),
        ...(role === 'merchant' && businessName ? { businessName } : {}),
      },
      create: {
        clerkId,
        email,
        firstName,
        lastName,
        role: role.toUpperCase(),
        ...(role === 'merchant' && businessName ? { businessName } : {}),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}