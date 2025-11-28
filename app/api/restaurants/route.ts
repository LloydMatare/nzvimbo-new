import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "50907d5665msh168b69972b42ed9p144a5fjsn339c03fc7bbb";
const RAPIDAPI_HOST = "worldwide-restaurants.p.rapidapi.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "Harare, Zimbabwe";
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const limit = searchParams.get("limit") || "20";

    // First, search for location ID
    const locationSearchUrl = `https://${RAPIDAPI_HOST}/typeahead`;
    
    const locationResponse = await fetch(locationSearchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        q: location,
        language: "en_US"
      }),
    });

    if (!locationResponse.ok) {
      throw new Error("Failed to fetch location data");
    }

    const locationData = await locationResponse.json();
    
    if (!locationData.results?.data?.length) {
      return NextResponse.json({ 
        error: "Location not found",
        results: [] 
      });
    }

    const locationId = locationData.results.data[0].result_object.location_id;

    // Now search for restaurants in that location
    const restaurantsUrl = `https://${RAPIDAPI_HOST}/search`;
    
    const restaurantsResponse = await fetch(restaurantsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        language: "en_US",
        limit: parseInt(limit),
        location_id: locationId,
        currency: "USD",
        ...(search && { search_query: search })
      }),
    });

    if (!restaurantsResponse.ok) {
      throw new Error("Failed to fetch restaurants data");
    }

    const restaurantsData = await restaurantsResponse.json();
    
    // Transform the data to match our app's structure
    const transformedResults = restaurantsData.results?.data?.map((restaurant: any) => ({
      id: restaurant.location_id,
      name: restaurant.name,
      type: restaurant.cuisine?.[0]?.name || "Restaurant",
      rating: parseFloat(restaurant.rating) || 0,
      reviewCount: parseInt(restaurant.num_reviews) || 0,
      priceRange: restaurant.price_level || "$$",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      coordinates: {
        lat: parseFloat(restaurant.latitude),
        lng: parseFloat(restaurant.longitude)
      },
      description: restaurant.description || `${restaurant.name} in ${location}`,
      openingHours: restaurant.hours?.weekday_text || [],
      images: [restaurant.photo?.images?.medium?.url || "/api/placeholder/400/300"],
      amenities: restaurant.cuisine?.map((c: any) => c.name) || []
    })) || [];

    return NextResponse.json({
      results: transformedResults,
      location: locationData.results.data[0].result_object.name
    });

  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch restaurants",
        results: [] 
      },
      { status: 500 }
    );
  }
}