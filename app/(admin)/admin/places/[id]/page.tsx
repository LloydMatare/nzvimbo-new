"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Trash2,
  MapPin,
  Clock,
  Wifi,
  Car,
  Music,
  Edit3,
} from "lucide-react";

interface Place {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  coordinates: { lat: number; lng: number };
  phone?: string;
  website?: string;
  email?: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  merchant: {
    businessName: string;
    email: string;
  };
  images: Array<{ id: string; url: string; alt: string; order: number }>;
  amenities: Array<{ id: string; name: string }>;
  hours: Array<{
    id: string;
    day: string;
    openTime: string;
    closeTime: string;
  }>;
  menus: Array<{ id: string; category: string; items: any }>;
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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditPlacePage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchPlace();
  }, [placeId]);

  const fetchPlace = async () => {
    try {
      const response = await fetch(`/api/places/${placeId}`);
      if (response.ok) {
        const data = await response.json();
        setPlace(data);

        // Initialize form data
        setFormData({
          name: data.name,
          description: data.description,
          type: data.type,
          priceRange: data.priceRange,
          address: data.address,
          phone: data.phone || "",
          website: data.website || "",
          email: data.email || "",
          isActive: data.isActive,
          featured: data.featured,
          hours:
            data.hours.length > 0
              ? data.hours
              : daysOfWeek.map((day) => ({
                  day,
                  openTime: "09:00",
                  closeTime: "17:00",
                })),
          amenities: data.amenities.map((a: any) => a.name),
          images: data.images,
        });
      }
    } catch (error) {
      console.error("Error fetching place:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh the data
        fetchPlace();
        alert("Place updated successfully!");
      } else {
        alert("Failed to update place");
      }
    } catch (error) {
      console.error("Error updating place:", error);
      alert("Error updating place");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/places");
        alert("Place deleted successfully!");
      } else {
        alert("Failed to delete place");
      }
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Error deleting place");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const toggleStatus = async () => {
    if (!place) return;

    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !place.isActive,
        }),
      });

      if (response.ok) {
        fetchPlace(); // Refresh data
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const toggleFeatured = async () => {
    if (!place) return;

    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !place.featured,
        }),
      });

      if (response.ok) {
        fetchPlace(); // Refresh data
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!place || !formData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Place not found</h1>
          <Button onClick={() => router.push("/admin/places")} className="mt-4">
            Back to Places
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/places")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Place</h1>
            <p className="text-muted-foreground">{place.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={place.isActive ? "default" : "secondary"}>
            {place.isActive ? "Active" : "Inactive"}
          </Badge>
          {place.featured && <Badge variant="default">Featured</Badge>}
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Place Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Place Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select
                    value={formData.priceRange}
                    onValueChange={(value) =>
                      handleInputChange("priceRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opening Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.hours.map((hour: any, index: number) => (
                <div key={hour.day} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label className="font-medium">{hour.day}</Label>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => {
                        const newHours = [...formData.hours];
                        newHours[index].openTime = e.target.value;
                        handleInputChange("hours", newHours);
                      }}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => {
                        const newHours = [...formData.hours];
                        newHours[index].closeTime = e.target.value;
                        handleInputChange("hours", newHours);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "WiFi",
                  "Parking",
                  "Live Music",
                  "Outdoor Seating",
                  "Wheelchair Accessible",
                  "Takeaway",
                  "Delivery",
                  "Reservations",
                ].map((amenity) => (
                  <div
                    key={amenity}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.amenities.includes(amenity)
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    }`}
                    onClick={() => {
                      const newAmenities = formData.amenities.includes(amenity)
                        ? formData.amenities.filter(
                            (a: string) => a !== amenity
                          )
                        : [...formData.amenities, amenity];
                      handleInputChange("amenities", newAmenities);
                    }}
                  >
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions */}
        <TabsContent value="actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Status</p>
                    <p className="text-sm text-muted-foreground">
                      {place.isActive
                        ? "Place is visible to users"
                        : "Place is hidden from users"}
                    </p>
                  </div>
                  <Button
                    variant={place.isActive ? "destructive" : "default"}
                    onClick={toggleStatus}
                  >
                    {place.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Featured</p>
                    <p className="text-sm text-muted-foreground">
                      {place.featured
                        ? "Place is featured on homepage"
                        : "Place is not featured"}
                    </p>
                  </div>
                  <Button
                    variant={place.featured ? "destructive" : "default"}
                    onClick={toggleFeatured}
                  >
                    {place.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Place</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this place and all its data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/admin/places")}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Place</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{place.name}"? This action cannot
              be undone and will permanently delete all associated data
              including bookings, reviews, and images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Place
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
