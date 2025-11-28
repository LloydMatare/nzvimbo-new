import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
      
      // Recent bookings - handle cases where user might be null
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          place: { 
            select: { name: true } 
          },
          user: { 
            select: { 
              firstName: true, 
              lastName: true 
            } 
          }
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

    // Transform recent bookings to handle null users
    const transformedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      date: booking.createdAt.toISOString(),
      totalAmount: booking.totalAmount,
      status: booking.status,
      place: {
        name: booking.place?.name || "Unknown Place"
      },
      user: {
        firstName: booking.user?.firstName || "Unknown",
        lastName: booking.user?.lastName || "User"
      }
    }));

    const stats = {
      totalUsers,
      totalPlaces,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentBookings: transformedRecentBookings,
      popularPlaces
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    
    // Return fallback data with proper structure
    const fallbackStats = {
      totalUsers: 0,
      totalPlaces: 0,
      totalBookings: 0,
      totalRevenue: 0,
      recentBookings: [],
      popularPlaces: []
    };
    
    return NextResponse.json(fallbackStats);
  }
}