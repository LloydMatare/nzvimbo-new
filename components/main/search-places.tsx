import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";

// Add this function to your SearchPlaces component
const searchRestaurants = async (filters: any) => {
  try {
    const queryParams = new URLSearchParams({
      location: "Zimbabwe",
      ...filters,
    });

    const response = await fetch(`/api/restaurants?${queryParams}`);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return [];
  }
};

function SearchPlaces() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Desktop Search */}
      <div className="hidden lg:flex flex-col gap-6">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="location" className="text-sm font-medium mb-2">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter area or city..."
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="place-type" className="text-sm font-medium mb-2">
              Place Type
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="grill-pub">Grill & Pub</SelectItem>
                <SelectItem value="hotel">Hotel & Lodge</SelectItem>
                <SelectItem value="sports-bar">Sports Bar</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="nightclub">Nightclub</SelectItem>
                <SelectItem value="rooftop-bar">Rooftop Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm font-medium mb-2">Price Range</Label>
            <div className="flex gap-2">
              <Input placeholder="Min price" type="number" className="w-full" />
              <Input placeholder="Max price" type="number" className="w-full" />
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 h-10">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden flex flex-col gap-4">
        <div className="flex gap-2">
          <Input placeholder="Search places..." className="flex-1" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Places</SheetTitle>
                <SheetDescription>
                  Refine your search to find the perfect spot
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile-location">Location</Label>
                  <Input
                    id="mobile-location"
                    placeholder="Enter area or city..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile-type">Place Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="grill-pub">Grill & Pub</SelectItem>
                      <SelectItem value="hotel">Hotel & Lodge</SelectItem>
                      <SelectItem value="sports-bar">Sports Bar</SelectItem>
                      <SelectItem value="cafe">Cafe</SelectItem>
                      <SelectItem value="lounge">Lounge</SelectItem>
                      <SelectItem value="nightclub">Nightclub</SelectItem>
                      <SelectItem value="rooftop-bar">Rooftop Bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min price" type="number" />
                    <Input placeholder="Max price" type="number" />
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default SearchPlaces;
