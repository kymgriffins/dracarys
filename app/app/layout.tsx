"use client";

import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Menu, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard" },
    { name: "Courses", href: "/app/courses" },
    { name: "Live Sessions", href: "/app/sessions" },
    { name: "Journal", href: "/app/journal" },
    { name: "Community", href: "/app/community" },
    { name: "Analytics", href: "/app/analytics" },
    { name: "Signals", href: "/app/signals" },
    { name: "Settings", href: "/app/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Dashboard Header */}
      <DashboardHeader onMobileMenuClick={() => setMobileMenuOpen(true)} />

      {/* Responsive Sidebar */}
      <Sidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto pt-16 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
