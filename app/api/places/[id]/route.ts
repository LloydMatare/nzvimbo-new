import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { rapidApiService } from "@/lib/rapid-restuarant";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const placeId = params.id;

    // Check if it's an external ID (numeric) or database ID (ObjectId)
    const isExternalId = /^\d+$/.test(placeId);

    if (isExternalId) {
      // Fetch from RapidAPI
      const externalPlace = await rapidApiService.getRestaurantDetails(placeId);
      
      if (!externalPlace) {
        return NextResponse.json({ error: "Place not found" }, { status: 404 });
      }

      return NextResponse.json(externalPlace);
    } else {
      // Fetch from database
      const place = await prisma.place.findUnique({
        where: { 
          id: placeId,
          isActive: true 
        },
        include: {
          images: true,
          amenities: true,
          menus: true,
          hours: true,
          reviews: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          merchant: {
            select: {
              businessName: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        },
      });

      if (!place) {
        return NextResponse.json({ error: "Place not found" }, { status: 404 });
      }

      return NextResponse.json(place);
    }
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || (dbUser.role !== "MERCHANT" && dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    const place = await prisma.place.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        featured: body.featured,
        // Update related data if provided
        ...(body.images && {
          images: {
            deleteMany: {},
            create: body.images.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt,
              order: index
            }))
          }
        }),
        ...(body.amenities && {
          amenities: {
            deleteMany: {},
            create: body.amenities.map((amenity: string) => ({
              name: amenity
            }))
          }
        })
      },
      include: {
        images: true,
        amenities: true,
        menus: true,
        hours: true,
      },
    });

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error updating place:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || (dbUser.role !== "MERCHANT" && dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await prisma.place.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting place:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}