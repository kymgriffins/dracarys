"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    { name: "Dashboard", href: "/dashboard" },
    { name: "Courses", href: "/courses" },
    { name: "Live Sessions", href: "/sessions" },
    { name: "Journal", href: "/journal" },
    { name: "Community", href: "/community" },
    { name: "Analytics", href: "/analytics" },
    { name: "Signals", href: "/signals" },
    { name: "Settings", href: "/settings" },
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
