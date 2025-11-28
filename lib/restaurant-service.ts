class RestaurantService {
  private rapidapiKey: string;
  private rapidapiHost: string;

  constructor() {
    this.rapidapiKey = process.env.RAPIDAPI_KEY || "50907d5665msh168b69972b42ed9p144a5fjsn339c03fc7bbb";
    this.rapidapiHost = "worldwide-restaurants.p.rapidapi.com";
  }

  async searchZimbabweRestaurants(options: {
    location?: string;
    search?: string;
    type?: string;
    limit?: number;
  }) {
    const {
      location = "Harare, Zimbabwe",
      search = "",
      type = "",
      limit = 20
    } = options;

    try {
      // Get location ID first
      const locationId = await this.getLocationId(location);
      if (!locationId) {
        throw new Error("Location not found");
      }

      // Search restaurants
      const restaurants = await this.searchRestaurants(locationId, {
        search,
        type,
        limit
      });

      return restaurants;
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  }

  private async getLocationId(location: string): Promise<string | null> {
    const response = await fetch(`https://${this.rapidapiHost}/typeahead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": this.rapidapiHost,
        "x-rapidapi-key": this.rapidapiKey,
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

  private async searchRestaurants(locationId: string, options: {
    search?: string;
    type?: string;
    limit?: number;
  }) {
    const response = await fetch(`https://${this.rapidapiHost}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": this.rapidapiHost,
        "x-rapidapi-key": this.rapidapiKey,
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

  private transformRestaurantData(restaurants: any[]) {
    return restaurants.map(restaurant => ({
      id: restaurant.location_id,
      name: restaurant.name,
      type: restaurant.cuisine?.[0]?.name || "Restaurant",
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
      description: restaurant.description || `${restaurant.name}`,
      openingHours: restaurant.hours?.weekday_text || [],
      image: restaurant.photo?.images?.medium?.url || "/api/placeholder/400/300",
      amenities: restaurant.cuisine?.map((c: any) => c.name) || [],
      external: true // Mark as external data
    }));
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
}

export const restaurantService = new RestaurantService();