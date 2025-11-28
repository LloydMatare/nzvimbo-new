import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rapidApiService } from "@/lib/rapid-restuarant";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const priceRange = searchParams.get("priceRange");
    const search = searchParams.get("search");
    const source = searchParams.get("source") || "all"; // all, local, external
    const location = searchParams.get("location") || "Harare, Zimbabwe";
    const limit = parseInt(searchParams.get("limit") || "20");

    let localPlaces: any[] = [];
    let externalPlaces: any[] = [];

    // Fetch local places from database
    if (source === "all" || source === "local") {
      const where: any = {
        isActive: true,
      };

      if (type && type !== "all") {
        where.type = type;
      }

      if (priceRange && priceRange !== "all") {
        where.priceRange = priceRange;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      localPlaces = await prisma.place.findMany({
        where,
        include: {
          images: true,
          amenities: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          featured: "desc",
        },
        take: limit,
      });
    }

    // Fetch external places from RapidAPI
    if (source === "all" || source === "external") {
      try {
        externalPlaces = await rapidApiService.searchRestaurants({
          location,
          search: search || undefined,
          limit: Math.floor(limit / 2), // Split limit between local and external
        });
      } catch (error) {
        console.error("Error fetching external places:", error);
        // Continue with local places only if external fails
      }
    }

    // Combine and transform results
    const combinedResults = [
      ...localPlaces.map(place => ({
        ...place,
        external: false,
        image: place.images[0]?.url || "/api/placeholder/400/300"
      })),
      ...externalPlaces
    ];

    return NextResponse.json({
      results: combinedResults,
      total: combinedResults.length,
      source: {
        local: localPlaces.length,
        external: externalPlaces.length
      }
    });

  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is merchant or admin
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || (dbUser.role !== "MERCHANT" && dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    // Create place with related data
    const place = await prisma.place.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        address: body.address,
        coordinates: body.coordinates,
        phone: body.phone,
        website: body.website,
        email: body.email,
        priceRange: body.priceRange,
        merchantId: dbUser.role === "MERCHANT" ? dbUser.id : body.merchantId,
        images: {
          create: body.images?.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt,
            order: index
          })) || []
        },
        amenities: {
          create: body.amenities?.map((amenity: string) => ({
            name: amenity
          })) || []
        },
        hours: {
          create: body.hours?.map((hour: any) => ({
            day: hour.day,
            openTime: hour.openTime,
            closeTime: hour.closeTime
          })) || []
        },
        menus: {
          create: body.menus?.map((menu: any) => ({
            category: menu.category,
            items: menu.items
          })) || []
        }
      },
      include: {
        images: true,
        amenities: true,
        menus: true,
        hours: true,
        merchant: {
          select: {
            businessName: true,
            email: true
          }
        }
      },
    });

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error creating place:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}