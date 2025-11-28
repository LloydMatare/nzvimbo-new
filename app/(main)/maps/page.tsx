// app/(main)/maps/page.tsx
"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Navigation,
  List,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

// Add these imports for Mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set your Mapbox token here - make sure to use a valid token
mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.your-actual-mapbox-token-here";

interface Place {
  id: number;
  name: string;
  type: string;
  rating: number;
  price: string;
  distance: string;
  coordinates: { lat: number; lng: number };
  openUntil: string;
  image: string;
}

function Maps() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: "all",
    rating: "all",
  });
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Mock data for places - moved inside useMemo to prevent recreation
  const places = useMemo(
    () => [
      {
        id: 1,
        name: "The Urban Grill House",
        type: "Grill & Pub",
        rating: 4.8,
        price: "$40",
        distance: "0.8km",
        coordinates: { lat: -17.824858, lng: 31.053028 },
        openUntil: "23:00",
        image: "/api/placeholder/300/200",
      },
      {
        id: 2,
        name: "Skyline Bar & Lounge",
        type: "Lounge",
        rating: 4.6,
        price: "$60",
        distance: "1.2km",
        coordinates: { lat: -17.822858, lng: 31.055028 },
        openUntil: "02:00",
        image: "/api/placeholder/300/200",
      },
      {
        id: 3,
        name: "Riverside Pub",
        type: "Pub",
        rating: 4.4,
        price: "$35",
        distance: "0.5km",
        coordinates: { lat: -17.826858, lng: 31.051028 },
        openUntil: "01:00",
        image: "/api/placeholder/300/200",
      },
    ],
    []
  );

  // Add 3D buildings to the map - defined with useCallback to prevent recreation
  const add3DBuildings = useCallback((mapInstance: mapboxgl.Map) => {
    // Only add 3D buildings if the source layer exists
    if (mapInstance.getSource("composite")) {
      mapInstance.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.6,
        },
      });
    }
  }, []);

  // Use useMemo to compute filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, places]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox token is valid
    if (
      !mapboxgl.accessToken ||
      mapboxgl.accessToken.includes("your-mapbox-token")
    ) {
      setMapError(
        "Please set a valid Mapbox access token in your environment variables"
      );
      return;
    }

    const initializeMap = () => {
      try {
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center: [31.053028, -17.824858], // Default center (Harare, Zimbabwe)
          zoom: 14,
          pitch: 45,
          bearing: -17.6,
          antialias: true,
        });

        mapInstance.addControl(new mapboxgl.NavigationControl());

        mapInstance.on("load", () => {
          setMap(mapInstance);
          add3DBuildings(mapInstance);
        });

        mapInstance.on("error", (e) => {
          console.error("Mapbox error:", e);
          setMapError("Failed to load map. Please check your Mapbox token.");
        });

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([longitude, latitude]);

              mapInstance.setCenter([longitude, latitude]);
              mapInstance.setZoom(14);

              // Add user location marker
              new mapboxgl.Marker({ color: "#3b82f6" })
                .setLngLat([longitude, latitude])
                .setPopup(
                  new mapboxgl.Popup().setHTML(
                    '<div class="p-2"><h3 class="font-semibold">Your Location</h3></div>'
                  )
                )
                .addTo(mapInstance);
            },
            (error) => {
              console.log("Error getting location:", error);
            }
          );
        }

        return mapInstance;
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to initialize map");
        return null;
      }
    };

    const mapInstance = initializeMap();

    return () => {
      mapInstance?.remove();
    };
  }, [add3DBuildings]);

  // Update markers when places or filters change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for filtered places
    filteredPlaces.forEach((place) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = `
        <div class="relative">
          <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
            <span class="text-white text-xs font-bold">${place.id}</span>
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.coordinates.lng, place.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2 min-w-[200px]">
                <h3 class="font-semibold text-sm">${place.name}</h3>
                <p class="text-muted-foreground text-xs mb-2">${place.type}</p>
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-600">★</span>
                    <span>${place.rating}</span>
                  </div>
                  <span class="font-semibold">${place.price}</span>
                </div>
                <button class="mt-2 w-full bg-primary text-white text-xs py-1 px-2 rounded hover:bg-primary/90 transition-colors">
                  View Details
                </button>
              </div>
            `)
        )
        .addTo(map);

      el.addEventListener("click", () => {
        setSelectedPlace(place);
      });

      marker.getPopup()?.on("open", () => {
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [map, filteredPlaces]);

  // Fly to selected place
  useEffect(() => {
    if (map && selectedPlace) {
      map.flyTo({
        center: [selectedPlace.coordinates.lng, selectedPlace.coordinates.lat],
        zoom: 16,
        essential: true,
      });
    }
  }, [map, selectedPlace]);

  const handleCurrentLocation = () => {
    if (map && userLocation) {
      map.flyTo({
        center: userLocation,
        zoom: 14,
        essential: true,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          map?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search places, pubs, bars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>

              {/* Filter Button - Mobile */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsListOpen(true)}
              >
                <Filter className="w-4 h-4" />
              </Button>

              {/* List View Toggle - Mobile */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsListOpen(true)}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3 ml-4">
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="pub">Pub</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="lounge">Lounge</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priceRange: value }))
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="low">$ - Budget</SelectItem>
                  <SelectItem value="medium">$$ - Moderate</SelectItem>
                  <SelectItem value="high">$$$ - Premium</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setIsListOpen(true)}
                className="hidden xl:flex"
              >
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Map Container */}
        <div ref={mapContainer} className="flex-1 relative">
          {/* Error State */}
          {mapError && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Map Error</h3>
                <p className="text-sm max-w-sm mb-4">{mapError}</p>
                <p className="text-xs text-muted-foreground">
                  Please set a valid Mapbox token in your .env.local file
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!map && !mapError && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Loading Map...</h3>
                <p className="text-sm max-w-sm">Initializing Mapbox...</p>
              </div>
            </div>
          )}

          {/* Current Location Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 shadow-lg z-10"
            onClick={handleCurrentLocation}
          >
            <Navigation className="w-4 h-4" />
          </Button>

          {/* List View Toggle - Mobile */}
          <Button
            variant="secondary"
            className="absolute bottom-4 left-4 shadow-lg lg:hidden z-10"
            onClick={() => setIsListOpen(true)}
          >
            <List className="w-4 h-4 mr-2" />
            Show List
          </Button>
        </div>

        {/* Places List Sidebar - Desktop */}
        <div className="hidden xl:block w-96 border-l bg-background overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Nearby Places ({filteredPlaces.length})
            </h2>
            <div className="space-y-4">
              {filteredPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPlace(place)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Image
                        src={place.image}
                        alt={place.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {place.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {place.distance}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {place.type}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>Until {place.openUntil}</span>
                            </div>
                            <span className="font-semibold">{place.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile List View Sheet */}
        <Sheet open={isListOpen} onOpenChange={setIsListOpen}>
          <SheetContent side="bottom" className="h-[80vh] p-8">
            <SheetHeader className="flex-row items-center justify-between mb-4">
              <div>
                <SheetTitle>Nearby Places</SheetTitle>
                <SheetDescription>
                  {filteredPlaces.length} places found
                </SheetDescription>
              </div>
            </SheetHeader>

            <div className="space-y-3 overflow-y-auto h-full pb-4 p-4">
              {filteredPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPlace(place);
                    setIsListOpen(false);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <Image
                        src={place.image}
                        alt={place.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm">
                            {place.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {place.distance}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mb-2">
                          {place.type}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>Until {place.openUntil}</span>
                            </div>
                            <span className="font-semibold">{place.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Place Detail Sheet */}
        <Sheet
          open={!!selectedPlace}
          onOpenChange={(open) => !open && setSelectedPlace(null)}
        >
          <SheetContent side="right" className="w-full sm:max-w-md p-8">
            {selectedPlace && (
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPlace(null)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <SheetTitle>{selectedPlace.name}</SheetTitle>
                  </div>
                  <SheetDescription>{selectedPlace.type}</SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  <Image
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    width={400}
                    height={192}
                    className="w-full h-48 rounded-lg object-cover"
                  />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedPlace.rating} Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Open until {selectedPlace.openUntil}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPlace.distance} away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {selectedPlace.price}
                      </span>
                      <span className="text-muted-foreground">avg. price</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Maps;
