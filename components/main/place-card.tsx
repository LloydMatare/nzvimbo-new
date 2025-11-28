import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

function PlaceCard() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative">
        <Image
          src="/api/placeholder/400/300"
          alt="Place image"
          className="w-full h-48 object-cover"
          width={100}
          height={100}
        />
        <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
          Grill & Pub
        </Badge>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">4.8</span>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1">The Urban Grill House</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3" />
            <span>Avondale, Harare</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Open until 11 PM</span>
          </div>
          <div className="font-semibold text-primary">$40.00</div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          Premium grill house with craft beers and live music. Perfect for
          casual evenings and group hangouts.
        </p>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            Book Now
          </Button>
          <Link href={`/places/${5}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlaceCard;
