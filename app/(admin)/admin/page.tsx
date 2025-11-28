// app/(dashboard)/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
} from "lucide-react";

interface Booking {
  id: string;
  date: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  place: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Place {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
}

interface DashboardStats {
  totalUsers: number;
  totalPlaces: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  popularPlaces: Place[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  // In the fetchStats function, add error handling:
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // You can set a fallback state here if needed
      setStats({
        totalUsers: 0,
        totalPlaces: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
        popularPlaces: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const getBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "PENDING":
        return "secondary";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
      case "NO_SHOW":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                {`Welcome back! Here's what's happening with your platform today.`}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Places
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalPlaces || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5 new this month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalBookings || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {stats?.totalRevenue
                    ? stats.totalRevenue.toLocaleString()
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500" /> +18%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {booking.place.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.user.firstName} {booking.user.lastName} •{" "}
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ${booking.totalAmount}
                          </p>
                          <Badge
                            variant={getBadgeVariant(booking.status)}
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No recent bookings
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular Places */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Places</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.popularPlaces && stats.popularPlaces.length > 0 ? (
                    stats.popularPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{place.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-2 w-2 rounded-full ${
                                    i < Math.floor(place.rating)
                                      ? "bg-yellow-400"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {place.rating} ({place.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No popular places</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 gap-2"
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 gap-2"
                >
                  <MapPin className="h-6 w-6" />
                  <span>Add Place</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 gap-2"
                >
                  <Calendar className="h-6 w-6" />
                  <span>View Bookings</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 gap-2"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Revenue Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
