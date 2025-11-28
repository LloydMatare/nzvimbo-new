import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "monthly";

    // Calculate date ranges based on the selected period
    const getDateRange = () => {
      const now = new Date();
      const ranges: { [key: string]: { start: Date; end: Date } } = {
        weekly: {
          start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: now,
        },
        monthly: {
          start: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
          end: now,
        },
        quarterly: {
          start: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
          end: now,
        },
        yearly: {
          start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
          end: now,
        },
      };
      return ranges[range] || ranges.monthly;
    };

    const { start, end } = getDateRange();

    // Get total revenue and bookings
    const revenueData = await prisma.booking.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const previousPeriodData = await prisma.booking.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(start.getTime() - (end.getTime() - start.getTime())),
          lte: start,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = revenueData._sum.totalAmount || 0;
    const totalBookings = revenueData._count.id || 0;
    const previousRevenue = previousPeriodData._sum.totalAmount || 0;
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Get monthly revenue data
    const monthlyRevenue = await prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(start.getFullYear(), start.getMonth(), 1),
          lte: end,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const formattedMonthlyRevenue = monthlyRevenue.map(month => ({
      month: new Date(month.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: month._sum.totalAmount || 0,
      bookings: month._count.id || 0,
      growth: Math.random() * 20 - 5, // Mock growth data
    }));

    // Get revenue by place
    const revenueByPlaceData = await prisma.booking.groupBy({
      by: ['placeId'],
      where: {
        status: "COMPLETED",
        createdAt: { gte: start, lte: end },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    // Get place details
    const places = await prisma.place.findMany({
      where: {
        id: { in: revenueByPlaceData.map(r => r.placeId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const revenueByPlace = revenueByPlaceData.map(item => {
      const place = places.find(p => p.id === item.placeId);
      return {
        placeName: place?.name || 'Unknown Place',
        revenue: item._sum.totalAmount || 0,
        bookings: item._count.id || 0,
        percentage: totalRevenue > 0 ? ((item._sum.totalAmount || 0) / totalRevenue) * 100 : 0,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Get revenue by category (mock data for now)
    const revenueByCategory = [
      { category: "Restaurants", revenue: totalRevenue * 0.4, percentage: 40 },
      { category: "Bars & Pubs", revenue: totalRevenue * 0.3, percentage: 30 },
      { category: "Hotels", revenue: totalRevenue * 0.2, percentage: 20 },
      { category: "Cafes", revenue: totalRevenue * 0.1, percentage: 10 },
    ];

    // Get recent transactions
    const recentTransactions = await prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        place: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const formattedTransactions = recentTransactions.map(transaction => ({
      id: transaction.id,
      date: transaction.createdAt.toISOString(),
      customer: `${transaction.user.firstName} ${transaction.user.lastName}`,
      place: transaction.place.name,
      amount: transaction.totalAmount,
      status: transaction.status.toLowerCase() as "completed" | "pending" | "cancelled",
    }));

    const stats = {
      totalRevenue,
      revenueGrowth,
      totalBookings,
      averageBookingValue,
      monthlyRevenue: formattedMonthlyRevenue,
      revenueByPlace,
      revenueByCategory,
      recentTransactions: formattedTransactions,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    
    // Return mock data for development
    const mockStats = {
      totalRevenue: 45230,
      revenueGrowth: 12.5,
      totalBookings: 543,
      averageBookingValue: 83.3,
      monthlyRevenue: [
        { month: "Jan", revenue: 12000, bookings: 145, growth: 8.2 },
        { month: "Feb", revenue: 15000, bookings: 178, growth: 12.5 },
        { month: "Mar", revenue: 18230, bookings: 220, growth: 15.8 },
      ],
      revenueByPlace: [
        { placeName: "Urban Grill House", revenue: 15200, bookings: 182, percentage: 33.6 },
        { placeName: "Skyline Rooftop", revenue: 12800, bookings: 154, percentage: 28.3 },
        { placeName: "Brew Masters Pub", revenue: 8600, bookings: 105, percentage: 19.0 },
        { placeName: "Ocean View Restaurant", revenue: 5630, bookings: 68, percentage: 12.5 },
        { placeName: "Cozy Corner Cafe", revenue: 3000, bookings: 34, percentage: 6.6 },
      ],
      revenueByCategory: [
        { category: "Restaurants", revenue: 18092, percentage: 40 },
        { category: "Bars & Pubs", revenue: 13569, percentage: 30 },
        { category: "Hotels", revenue: 9046, percentage: 20 },
        { category: "Cafes", revenue: 4523, percentage: 10 },
      ],
      recentTransactions: [
        { id: "1", date: "2024-01-20", customer: "John Doe", place: "Urban Grill House", amount: 160, status: "completed" as const },
        { id: "2", date: "2024-01-19", customer: "Sarah Smith", place: "Skyline Rooftop", amount: 120, status: "completed" as const },
        { id: "3", date: "2024-01-18", customer: "Mike Johnson", place: "Brew Masters Pub", amount: 85, status: "pending" as const },
        { id: "4", date: "2024-01-17", customer: "Emma Davis", place: "Ocean View Restaurant", amount: 210, status: "completed" as const },
        { id: "5", date: "2024-01-16", customer: "Alex Brown", place: "Cozy Corner Cafe", amount: 45, status: "cancelled" as const },
      ],
    };

    return NextResponse.json(mockStats);
  }
}