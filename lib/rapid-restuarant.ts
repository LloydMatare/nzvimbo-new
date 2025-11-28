import { ExternalRestaurant } from '@/types/restaurant';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "50907d5665msh168b69972b42ed9p144a5fjsn339c03fc7bbb";
const RAPIDAPI_HOST = "worldwide-restaurants.p.rapidapi.com";

export class RapidApiService {
  async searchRestaurants(options: {
    location?: string;
    search?: string;
    type?: string;
    limit?: number;
  }): Promise<ExternalRestaurant[]> {
    const {
      location = "Harare, Zimbabwe",
      search = "",
      limit = 20
    } = options;

    try {
      // Get location ID first
      const locationId = await this.getLocationId(location);
      if (!locationId) {
        throw new Error("Location not found");
      }

      // Search restaurants
      const restaurants = await this.searchRestaurantsInLocation(locationId, {
        search,
        limit
      });

      return restaurants;
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  }

  async getRestaurantDetails(restaurantId: string): Promise<ExternalRestaurant | null> {
    try {
      const response = await fetch(`https://${RAPIDAPI_HOST}/detail`, {
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
        return null;
      }

      return this.transformRestaurantDetail(data.results);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      throw error;
    }
  }

  private async getLocationId(location: string): Promise<string | null> {
    const response = await fetch(`https://${RAPIDAPI_HOST}/typeahead`, {
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

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    return data.results?.data?.[0]?.result_object?.location_id || null;
  }

  private async searchRestaurantsInLocation(locationId: string, options: {
    search?: string;
    limit?: number;
  }): Promise<ExternalRestaurant[]> {
    const response = await fetch(`https://${RAPIDAPI_HOST}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        language: "en_US",
        limit: options.limit,
        location_id: locationId,
        currency: "USD",
        ...(options.search && { search_query: options.search })
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurants data");
    }

    const data = await response.json();
    return this.transformRestaurantData(data.results?.data || []);
  }

  private transformRestaurantData(restaurants: any[]): ExternalRestaurant[] {
    return restaurants.map(restaurant => ({
      id: restaurant.location_id,
      name: restaurant.name,
      type: this.mapCuisineToPlaceType(restaurant.cuisine?.[0]?.name),
      rating: parseFloat(restaurant.rating) || 0,
      reviewCount: parseInt(restaurant.num_reviews) || 0,
      priceRange: this.mapPriceLevel(restaurant.price_level),
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      coordinates: {
        lat: parseFloat(restaurant.latitude),
        lng: parseFloat(restaurant.longitude)
      },
      description: restaurant.description || `${restaurant.name} in Zimbabwe`,
      openingHours: restaurant.hours?.weekday_text || [],
      image: restaurant.photo?.images?.medium?.url || "/api/placeholder/400/300",
      amenities: restaurant.cuisine?.map((c: any) => c.name) || [],
      external: true
    }));
  }

  private transformRestaurantDetail(restaurant: any): ExternalRestaurant {
    return {
      id: restaurant.location_id,
      name: restaurant.name,
      type: this.mapCuisineToPlaceType(restaurant.cuisine?.[0]?.name),
      description: restaurant.description || restaurant.writer_summary?.description || restaurant.name,
      rating: parseFloat(restaurant.rating) || 0,
      reviewCount: parseInt(restaurant.num_reviews) || 0,
      priceRange: this.mapPriceLevel(restaurant.price_level),
      address: restaurant.address_obj?.street1 || restaurant.address || "",
      coordinates: {
        lat: parseFloat(restaurant.latitude),
        lng: parseFloat(restaurant.longitude)
      },
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      openingHours: restaurant.hours?.weekday_text || [],
      image: restaurant.photo?.images?.medium?.url || "/api/placeholder/400/300",
      amenities: restaurant.cuisine?.map((c: any) => c.name) || [],
      external: true
    };
  }

  private mapPriceLevel(priceLevel: string): string {
    const priceMap: { [key: string]: string } = {
      "$$$$": "PREMIUM",
      "$$$": "HIGH", 
      "$$": "MEDIUM",
      "$": "LOW"
    };
    return priceMap[priceLevel] || "MEDIUM";
  }

  private mapCuisineToPlaceType(cuisine: string): string {
    const cuisineMap: { [key: string]: string } = {
      "Cafe": "CAFE",
      "Bar": "LOUNGE",
      "Pub": "GRILL_PUB",
      "Nightclub": "NIGHTCLUB",
      "Sports Bar": "SPORTS_BAR",
      "Rooftop": "ROOFTOP_BAR",
      "Hotel": "HOTEL_LODGE"
    };
    
    return cuisineMap[cuisine] || "RESTAURANT";
  }
}

export const rapidApiService = new RapidApiService();