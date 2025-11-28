// app/(main)/places/[id]/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Share2,
  Bookmark,
  MapPin,
  Star,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  ChevronLeft,
  Calendar,
  MessageCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
}

// Mock data for place details
const placeData = {
  id: 1,
  name: "The Urban Grill House",
  type: "Grill & Pub",
  description:
    "A modern grill house offering premium steaks, craft beers, and live music in a sophisticated yet relaxed atmosphere. Perfect for casual dinners, business meetings, and weekend hangouts.",
  rating: 4.8,
  reviewCount: 247,
  priceRange: "$$",
  address: "123 City Center, Avondale, Harare",
  coordinates: { lat: -17.824858, lng: 31.053028 },
  phone: "+263 123 456 789",
  website: "www.urbangrill.com",
  socialMedia: {
    facebook: "urbangrill",
    instagram: "@urbangrill",
    twitter: "@urbangrill",
  },
  hours: {
    Monday: "11:00 - 23:00",
    Tuesday: "11:00 - 23:00",
    Wednesday: "11:00 - 23:00",
    Thursday: "11:00 - 00:00",
    Friday: "11:00 - 01:00",
    Saturday: "10:00 - 01:00",
    Sunday: "10:00 - 22:00",
  },
  amenities: [
    "Live Music",
    "Outdoor Seating",
    "WiFi",
    "Parking",
    "Wheelchair Accessible",
    "Takeaway",
  ],
  images: [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
  ],
  menu: [
    {
      category: "Starters",
      items: [
        {
          name: "Garlic Bread",
          price: "$8",
          description: "Freshly baked with herb butter",
        },
        {
          name: "Buffalo Wings",
          price: "$12",
          description: "Spicy with blue cheese dip",
        },
      ],
    },
    {
      category: "Main Course",
      items: [
        {
          name: "Ribeye Steak",
          price: "$32",
          description: "300g with roasted vegetables",
        },
        {
          name: "Grilled Salmon",
          price: "$28",
          description: "With lemon butter sauce",
        },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Amazing food and great atmosphere! The live music was fantastic.",
      helpful: 12,
    },
    {
      id: 2,
      user: "John D.",
      rating: 4,
      date: "2024-01-12",
      comment:
        "Good place for hanging out with friends. Drinks were reasonably priced.",
      helpful: 8,
    },
  ],
};

function Place({ params }: PageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: 2,
  });

  const place = placeData;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking logic here
    console.log("Booking data:", bookingData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/places">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold truncate">{place.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isBookmarked ? "fill-primary text-primary" : ""
                  }`}
                />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <Image
              src={place.images[selectedImage]}
              alt={place.name}
              width={800}
              height={400}
              className="w-full h-64 lg:h-96 rounded-2xl object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {place.images.slice(1).map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${place.name} ${index + 2}`}
                width={200}
                height={150}
                className="w-full h-32 lg:h-48 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedImage(index + 1)}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Place Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {place.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{place.rating}</span>
                  <span className="text-muted-foreground">
                    ({place.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {place.priceRange}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {place.description}
              </p>
            </div>

            {/* Contact & Location */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{place.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{place.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <a
                        href={`https://${place.website}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {place.website}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Social Media</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" size="icon" asChild>
                        <a href="#">
                          <Facebook className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#">
                          <Instagram className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Hours */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(place.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {place.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Menu Tab */}
              <TabsContent value="menu" className="mt-6">
                <div className="space-y-6">
                  {place.menu.map((category, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4">
                          {category.category}
                        </h3>
                        <div className="space-y-4">
                          {category.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex justify-between items-start border-b pb-4 last:border-b-0"
                            >
                              <div>
                                <h4 className="font-medium mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  {item.description}
                                </p>
                              </div>
                              <span className="font-semibold text-primary">
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Review Stats */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold">
                            {place.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(place.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {place.reviewCount} reviews
                          </div>
                        </div>
                        <Button className="ml-auto">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Write a Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {place.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Photos Tab */}
              <TabsContent value="photos" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {place.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${place.name} ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-48 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${place.priceRange === "$$" ? "40" : "30"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average price per person
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book a Table at {place.name}</DialogTitle>
                      <DialogDescription>
                        Make a reservation for your visit
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date</label>
                          <Input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                date: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time</label>
                          <Input
                            type="time"
                            value={bookingData.time}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                time: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Number of Guests
                        </label>
                        <Select
                          value={bookingData.guests.toString()}
                          onValueChange={(value) =>
                            setBookingData({
                              ...bookingData,
                              guests: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "person" : "people"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Special Requests (Optional)
                        </label>
                        <Textarea placeholder="Any special requirements..." />
                      </div>
                      <Button type="submit" className="w-full">
                        Confirm Booking
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full mb-4" asChild>
                  <Link href="/maps">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Link>
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{place.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price Range</span>
                    <span>{place.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {place.rating}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Place;
