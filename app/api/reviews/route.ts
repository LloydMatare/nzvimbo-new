import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    
    // Create review
    const review = await prisma.review.create({
      data: {
        rating: body.rating,
        comment: body.comment,
        userId: user.id,
        placeId: body.placeId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    // Update place rating and review count
    const placeReviews = await prisma.review.findMany({
      where: { placeId: body.placeId },
      select: { rating: true }
    });

    const averageRating = placeReviews.reduce((acc, curr) => acc + curr.rating, 0) / placeReviews.length;

    await prisma.place.update({
      where: { id: body.placeId },
      data: {
        rating: averageRating,
        reviewCount: placeReviews.length
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}