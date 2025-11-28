// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get stats in parallel
    const [
      totalUsers,
      totalPlaces,
      totalBookings,
      totalRevenue,
      recentBookings,
      popularPlaces
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total places
      prisma.place.count({ where: { isActive: true } }),
      
      // Total bookings
      prisma.booking.count(),
      
      // Total revenue (sum of completed bookings)
      prisma.booking.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalAmount: true }
      }),
      
      // Recent bookings
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          place: { select: { name: true } },
          user: { select: { firstName: true, lastName: true } }
        }
      }),
      
      // Popular places
      prisma.place.findMany({
        take: 5,
        where: { isActive: true },
        orderBy: { reviewCount: "desc" },
        select: {
          id: true,
          name: true,
          rating: true,
          reviewCount: true
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalPlaces,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentBookings,
      popularPlaces
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}