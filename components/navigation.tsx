"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps): React.ReactNode {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ""}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="Dracarys home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
          </Link>
          <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
            Dracarys
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            Features
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            Pricing
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            About
          </Link>

          {isLoading ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link href="/protected/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="focus-visible:ring-2 focus-visible:ring-ring">Sign In</Button>
              </Link>
              <Link href="/app/dashboard">
                <Button variant="ghost" className="focus-visible:ring-2 focus-visible:ring-ring">Dashboard</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              <Link href="/protected/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
