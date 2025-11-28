"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus, MapPin, Clock, Wifi, Car, Music } from "lucide-react";

interface AddPlaceModalProps {
  onPlaceAdded?: () => void;
}

const placeTypes = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "GRILL_PUB", label: "Grill & Pub" },
  { value: "HOTEL_LODGE", label: "Hotel & Lodge" },
  { value: "SPORTS_BAR", label: "Sports Bar" },
  { value: "CAFE", label: "Cafe" },
  { value: "LOUNGE", label: "Lounge" },
  { value: "NIGHTCLUB", label: "Nightclub" },
  { value: "ROOFTOP_BAR", label: "Rooftop Bar" },
];

const priceRanges = [
  { value: "LOW", label: "$ - Budget" },
  { value: "MEDIUM", label: "$$ - Moderate" },
  { value: "HIGH", label: "$$$ - Premium" },
  { value: "PREMIUM", label: "$$$$ - Luxury" },
];

const amenitiesList = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "live_music", label: "Live Music", icon: Music },
  { id: "outdoor", label: "Outdoor Seating" },
  { id: "wheelchair", label: "Wheelchair Accessible" },
  { id: "takeaway", label: "Takeaway" },
  { id: "delivery", label: "Delivery" },
  { id: "reservations", label: "Reservations" },
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AddPlaceModal({ onPlaceAdded }: AddPlaceModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    type: "",
    priceRange: "",
    address: "",
    coordinates: { lat: 0, lng: 0 },
    phone: "",
    website: "",
    email: "",

    // Hours
    hours: daysOfWeek.map((day) => ({
      day,
      openTime: "09:00",
      closeTime: "17:00",
      closed: false,
    })),

    // Amenities
    amenities: [] as string[],

    // Images
    images: [] as Array<{ url: string; alt: string }>,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHourChange = (index: number, field: string, value: string) => {
    const updatedHours = [...formData.hours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, hours: updatedHours }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", alt: "" }],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index: number, field: string, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty images
      const validImages = formData.images.filter(
        (img) => img.url.trim() !== ""
      );

      const response = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: validImages,
          // Convert hours to the format expected by the API
          hours: formData.hours.map((hour) => ({
            day: hour.day,
            openTime: hour.closed ? "Closed" : hour.openTime,
            closeTime: hour.closed ? "Closed" : hour.closeTime,
          })),
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          type: "",
          priceRange: "",
          address: "",
          coordinates: { lat: 0, lng: 0 },
          phone: "",
          website: "",
          email: "",
          hours: daysOfWeek.map((day) => ({
            day,
            openTime: "09:00",
            closeTime: "17:00",
            closed: false,
          })),
          amenities: [],
          images: [],
        });
        onPlaceAdded?.();
      } else {
        console.error("Failed to create place");
      }
    } catch (error) {
      console.error("Error creating place:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Place
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Place</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new place to the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="hours">Opening Hours</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Place Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter place name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Place Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {placeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range *</Label>
                  <Select
                    value={formData.priceRange}
                    onValueChange={(value) =>
                      handleInputChange("priceRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+263 123 456 789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the place, its atmosphere, specialties, etc."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full address"
                    required
                  />
                  <Button type="button" variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Opening Hours Tab */}
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Opening Hours</CardTitle>
                  <CardDescription>
                    Set the opening hours for each day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.hours.map((hour, index) => (
                    <div key={hour.day} className="flex items-center gap-4">
                      <div className="w-24">
                        <Label className="text-sm font-medium">
                          {hour.day}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) =>
                            handleHourChange(index, "openTime", e.target.value)
                          }
                          disabled={hour.closed}
                        />
                        <span className="text-sm text-muted-foreground">
                          to
                        </span>
                        <Input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) =>
                            handleHourChange(index, "closeTime", e.target.value)
                          }
                          disabled={hour.closed}
                        />
                      </div>
                      <Button
                        type="button"
                        variant={hour.closed ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleHourChange(index, "closed", !hour.closed)
                        }
                      >
                        {hour.closed ? "Closed" : "Open"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Amenities & Features
                  </CardTitle>
                  <CardDescription>
                    Select the amenities available at this place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <div
                          key={amenity.id}
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.amenities.includes(amenity.id)
                              ? "border-primary bg-primary/5"
                              : "border-muted"
                          }`}
                          onClick={() => toggleAmenity(amenity.id)}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span className="text-sm">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Images</CardTitle>
                  <CardDescription>
                    Add images to showcase the place (URLs for now)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          placeholder="Image URL"
                          value={image.url}
                          onChange={(e) =>
                            updateImage(index, "url", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Alt text"
                          value={image.alt}
                          onChange={(e) =>
                            updateImage(index, "alt", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImage}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "hours", "amenities", "media"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "media" && (
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "hours", "amenities", "media"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Place"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
