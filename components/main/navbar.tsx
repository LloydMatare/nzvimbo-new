"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";
import Title from "./title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const navItems = [
  {
    id: 1,
    name: "Places",
    url: "/places",
  },
  {
    id: 2,
    name: "Maps",
    url: "/maps",
  },
  {
    id: 3,
    name: "History",
    url: "/history",
  },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

  const navLinkClass = (url: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
      isActive(url)
        ? "text-primary bg-primary/10 font-semibold"
        : "text-muted-foreground hover:text-foreground"
    );

  const mobileNavLinkClass = (url: string) =>
    cn(
      "text-lg font-medium transition-colors px-4 py-3 rounded-lg border-l-4",
      isActive(url)
        ? "text-primary bg-primary/10 font-semibold border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent"
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Title />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <ul className="flex items-center gap-1">
              {navItems.map((nav) => (
                <li key={nav.id}>
                  <Link className={navLinkClass(nav.url)} href={nav.url}>
                    {nav.name}
                  </Link>
                </li>
              ))}
            </ul>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton>
                  <Button
                    variant={"outline"}
                    className="text-xs cursor-pointer"
                  >
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="text-xs hover:bg-black/60 cursor-pointer">
                    Sign up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full p-8">
                  <div className="flex items-center justify-between mb-8">
                    <Title />
                  </div>

                  <nav className="flex-1 flex flex-col space-y-2">
                    {navItems.map((nav) => (
                      <Link
                        key={nav.id}
                        className={mobileNavLinkClass(nav.url)}
                        href={nav.url}
                        onClick={handleNavClick}
                      >
                        {nav.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-8 pt-6 border-t">
                    <SignedOut>
                      <div className="flex flex-col space-y-3">
                        <SignInButton>
                          <Button
                            variant="outline"
                            className="w-full justify-center"
                            onClick={handleNavClick}
                          >
                            Sign in
                          </Button>
                        </SignInButton>
                        <SignUpButton>
                          <Button
                            className="w-full justify-center hover:bg-black/60"
                            onClick={handleNavClick}
                          >
                            Sign up
                          </Button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex justify-center">
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
