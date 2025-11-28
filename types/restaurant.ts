export interface ExternalRestaurant {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  address: string;
  phone?: string;
  website?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  openingHours: string[];
  image: string;
  amenities: string[];
  external?: boolean;
}

export interface RestaurantSearchResponse {
  results: ExternalRestaurant[];
  location: string;
  total: number;
}