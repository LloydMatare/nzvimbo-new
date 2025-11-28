import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Users, Clock, Shield } from "lucide-react";
import PlaceCard from "@/components/main/place-card";
import Link from "next/link";

export function meta() {
  return [
    { title: "Nzimbo - Find Your Perfect Spot" },
    {
      name: "description",
      content:
        "Discover amazing pubs, bars, restaurants, and relaxing places to unwind. Book your perfect evening with Nzimbo.",
    },
  ];
}

export default function Home() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Smart Discovery",
      description:
        "Find hidden gems and popular spots tailored to your preferences",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Verified Reviews",
      description:
        "Real experiences from real people to help you choose the perfect place",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Availability",
      description: "See live wait times and book instantly without the hassle",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Booking",
      description: "Your reservations are safe with our secure payment system",
    },
  ];

  const popularCategories = [
    { name: "Sports Bars", count: "124 spots", color: "bg-blue-500" },
    { name: "Rooftop Lounges", count: "89 spots", color: "bg-purple-500" },
    { name: "Live Music", count: "67 spots", color: "bg-green-500" },
    { name: "Craft Beer Pubs", count: "156 spots", color: "bg-amber-500" },
    { name: "Fine Dining", count: "92 spots", color: "bg-red-500" },
    { name: "Cozy Cafes", count: "203 spots", color: "bg-indigo-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-muted/30 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Find Your Perfect
              <span className="text-primary block">Evening Spot</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the best pubs, bars, restaurants, and relaxing places in
              your city. Book tables, check live music events, and create
              unforgettable moments.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-background rounded-2xl shadow-lg border p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for pubs, bars, restaurants..."
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 border-l">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 px-8">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/places">Explore Places</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/maps">View on Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Verified Places</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25+</div>
              <div className="text-muted-foreground">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Nzimbo?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make finding and booking your perfect evening spot effortless
              and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore our most sought-after evening spots
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category, index) => (
              <Card
                key={index}
                className="cursor-pointer group hover:shadow-lg transition-all"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Places */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Recently Added
                <span className="text-primary"> Spots</span>
              </h2>
              <p className="text-muted-foreground">
                Fresh additions to our curated collection
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/places">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PlaceCard />
            <PlaceCard />
            <PlaceCard />
            <PlaceCard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Spot?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of people discovering and booking amazing places
              every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/places">Start Exploring</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="/maps">View Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
