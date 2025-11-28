import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "50907d5665msh168b69972b42ed9p144a5fjsn339c03fc7bbb";
const RAPIDAPI_HOST = "worldwide-restaurants.p.rapidapi.com";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;

    const detailsUrl = `https://${RAPIDAPI_HOST}/detail`;
    
    const response = await fetch(detailsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        language: "en_US",
        location_id: restaurantId,
        currency: "USD"
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant details");
    }

    const data = await response.json();

    if (!data.results) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const restaurant = data.results;

    // Transform to match our app structure
    const transformedData = {
      id: restaurant.location_id,
      name: restaurant.name,
      type: restaurant.cuisine?.[0]?.name || "Restaurant",
      description: restaurant.description || restaurant.writer_summary?.description || restaurant.name,
      rating: parseFloat(restaurant.rating) || 0,
      reviewCount: parseInt(restaurant.num_reviews) || 0,
      priceRange: restaurant.price_level || "$$",
      address: restaurant.address_obj?.street1 || restaurant.address || "",
      coordinates: {
        lat: parseFloat(restaurant.latitude),
        lng: parseFloat(restaurant.longitude)
      },
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      email: restaurant.email || "",
      hours: restaurant.hours?.weekday_text?.reduce((acc: any, day: string) => {
        const [dayName, ...hours] = day.split(": ");
        acc[dayName] = hours.join(": ");
        return acc;
      }, {}) || {},
      amenities: restaurant.cuisine?.map((c: any) => c.name) || [],
      images: restaurant.photo?.images 
        ? Object.values(restaurant.photo.images).map((img: any) => img.url)
        : ["/api/placeholder/800/600"],
      reviews: restaurant.reviews?.map((review: any) => ({
        id: review.id,
        user: review.user?.username || "Anonymous",
        rating: parseInt(review.rating),
        date: review.published_date,
        comment: review.text,
        helpful: 0
      })) || []
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant details" },
      { status: 500 }
    );
  }
}