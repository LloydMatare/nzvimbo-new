"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Places",
    href: "/admin/places",
    icon: MapPin,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Revenue",
    href: "/admin/revenue",
    icon: DollarSign,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const getUserDisplayName = () => {
    if (!isLoaded) return "Loading...";
    if (!user) return "Unknown User";

    return (
      user.fullName ||
      user.firstName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "User"
    );
  };

  const getUserRole = () => {
    // You would typically get this from your database based on the Clerk user ID
    // For now, we'll assume all users accessing /admin are admins
    return "Administrator";
  };

  return (
    <div className="flex h-full flex-col bg-background border-r">
      {/* Logo/Brand */}
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span className="text-lg">Nzvimbo Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        {!isLoaded ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.imageUrl}
              alt={getUserDisplayName()}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getUserRole()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Not Signed In</p>
              <p className="text-xs text-muted-foreground truncate">
                Please sign in
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
