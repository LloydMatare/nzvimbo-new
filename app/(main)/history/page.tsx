"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Calendar,
  Star,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Trash2,
  Share2,
  Bookmark,
  Eye,
} from "lucide-react";

function History() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [filter, setFilter] = useState("all");

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      placeName: "The Urban Grill House",
      type: "Grill & Pub",
      date: "2024-01-15",
      time: "19:30",
      guests: 4,
      status: "completed",
      rating: 4.8,
      price: "$160",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      placeName: "Skyline Rooftop Bar",
      type: "Rooftop Lounge",
      date: "2024-01-10",
      time: "20:00",
      guests: 2,
      status: "completed",
      rating: 4.6,
      price: "$110",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      placeName: "Brew Masters",
      type: "Craft Beer Pub",
      date: "2024-01-20",
      time: "18:00",
      guests: 6,
      status: "upcoming",
      rating: null,
      price: "$210",
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      placeName: "Jazz & Wine Lounge",
      type: "Lounge",
      date: "2024-01-05",
      time: "21:00",
      guests: 2,
      status: "cancelled",
      rating: null,
      price: "$120",
      image: "/api/placeholder/300/200",
    },
  ];

  // Mock data for viewed places
  const viewedPlaces = [
    {
      id: 1,
      name: "Sports Arena Bar",
      type: "Sports Bar",
      viewedAt: "2024-01-18 14:30",
      rating: 4.3,
      price: "$35",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      name: "Ocean View Restaurant",
      type: "Fine Dining",
      viewedAt: "2024-01-17 11:15",
      rating: 4.7,
      price: "$85",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      name: "Cozy Corner Cafe",
      type: "Cafe",
      viewedAt: "2024-01-16 09:45",
      rating: 4.5,
      price: "$25",
      image: "/api/placeholder/300/200",
    },
  ];

  // Mock data for saved places
  const savedPlaces = [
    {
      id: 1,
      name: "Sunset Rooftop",
      type: "Rooftop Bar",
      savedAt: "2024-01-12",
      rating: 4.9,
      price: "$45",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      name: "The Vintage Pub",
      type: "Traditional Pub",
      savedAt: "2024-01-08",
      rating: 4.4,
      price: "$30",
      image: "/api/placeholder/300/200",
    },
  ];

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", variant: "default" as const },
      upcoming: { label: "Upcoming", variant: "secondary" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">History</h1>
              <p className="text-muted-foreground mt-1">
                Track your bookings, views, and saved places
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  placeholder="Search history..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Filter Button - Mobile */}
              <Button variant="outline" size="icon" className="sm:hidden">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-3 lg:max-w-md">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {bookings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="viewed" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Viewed</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {viewedPlaces.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {savedPlaces.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Your Bookings</h2>

              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={booking.image}
                        alt={booking.placeName}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {booking.placeName}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              {booking.type}
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Guests:
                            </span>
                            <span>{booking.guests}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Total:
                            </span>
                            <span className="font-semibold">
                              {booking.price}
                            </span>
                          </div>
                        </div>

                        {/* Rating for completed bookings */}
                        {booking.status === "completed" && booking.rating && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {booking.rating}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              You rated this place
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                        {booking.status === "upcoming" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" className="h-8">
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredBookings.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No bookings found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {filter === "all"
                        ? "You haven't made any bookings yet."
                        : `No ${filter} bookings found.`}
                    </p>
                    <Button>Explore Places</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Viewed Places Tab */}
          <TabsContent value="viewed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recently Viewed</h2>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewedPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="group hover:shadow-lg transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-tight">
                            {place.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-muted-foreground text-xs mb-2">
                          {place.type}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating}</span>
                          </div>
                          <span className="font-semibold">{place.price}</span>
                        </div>

                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            Viewed{" "}
                            {new Date(place.viewedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1 text-xs h-8">
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saved Places Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Places</h2>
              <span className="text-muted-foreground text-sm">
                {savedPlaces.length} places saved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="group hover:shadow-lg transition-all"
                >
                  <CardContent className="p-4">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-32 rounded-lg object-cover mb-3"
                    />

                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{place.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground text-xs mb-3">
                      {place.type}
                    </p>

                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                      </div>
                      <span className="font-semibold">{place.price}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs h-8">
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default History;
