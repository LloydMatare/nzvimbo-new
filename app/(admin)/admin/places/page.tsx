"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { AddPlaceModal } from "@/components/forms/add-place-modal";

interface Place {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  priceRange: string;
  rating: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  merchant: {
    businessName: string;
    email: string;
  };
  images: Array<{ url: string }>;
  amenities: Array<{ name: string }>;
  _count: {
    bookings: number;
    reviews: number;
    favorites: number;
  };
}

export default function AdminPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPlaces();
  }, [pagination.page, search, typeFilter, statusFilter]);

  const fetchPlaces = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/places?${params}`);
      const data = await response.json();

      setPlaces(data.places);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlaceStatus = async (placeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchPlaces(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  const toggleFeatured = async (placeId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (response.ok) {
        fetchPlaces(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "outline";
      };
    } = {
      RESTAURANT: { label: "Restaurant", variant: "default" },
      GRILL_PUB: { label: "Grill & Pub", variant: "secondary" },
      HOTEL_LODGE: { label: "Hotel & Lodge", variant: "outline" },
      SPORTS_BAR: { label: "Sports Bar", variant: "secondary" },
      CAFE: { label: "Cafe", variant: "outline" },
      LOUNGE: { label: "Lounge", variant: "default" },
      NIGHTCLUB: { label: "Nightclub", variant: "secondary" },
      ROOFTOP_BAR: { label: "Rooftop Bar", variant: "outline" },
    };

    const config = typeConfig[type] || {
      label: type,
      variant: "outline" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriceRangeBadge = (priceRange: string) => {
    const priceConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "outline";
      };
    } = {
      LOW: { label: "$", variant: "outline" },
      MEDIUM: { label: "$$", variant: "default" },
      HIGH: { label: "$$$", variant: "secondary" },
      PREMIUM: { label: "$$$$", variant: "default" },
    };

    const config = priceConfig[priceRange] || {
      label: priceRange,
      variant: "outline" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Place Management</h1>
          <p className="text-muted-foreground">
            Manage all places and their visibility on the platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <AddPlaceModal onPlaceAdded={fetchPlaces} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search places by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                <SelectItem value="GRILL_PUB">Grill & Pub</SelectItem>
                <SelectItem value="SPORTS_BAR">Sports Bar</SelectItem>
                <SelectItem value="CAFE">Cafe</SelectItem>
                <SelectItem value="LOUNGE">Lounge</SelectItem>
                <SelectItem value="NIGHTCLUB">Nightclub</SelectItem>
                <SelectItem value="ROOFTOP_BAR">Rooftop Bar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Places Table */}
      <Card>
        <CardHeader>
          <CardTitle>Places ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Place</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={place.images[0]?.url || "/api/placeholder/40/40"}
                        alt={place.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{place.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {place.address.slice(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(place.type)}</TableCell>
                  <TableCell>{getPriceRangeBadge(place.priceRange)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{place.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({place._count.reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {place.merchant.businessName}
                      </div>
                      <div className="text-muted-foreground">
                        {place.merchant.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{place._count.bookings}</TableCell>
                  <TableCell>
                    <Badge variant={place.isActive ? "default" : "secondary"}>
                      {place.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {place.featured && (
                      <Badge variant="default" className="ml-1">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleFeatured(place.id, place.featured)
                          }
                        >
                          {place.featured ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Feature
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            togglePlaceStatus(place.id, place.isActive)
                          }
                        >
                          {place.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} places
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
