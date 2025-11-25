"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Target,
  Wallet,
  Calendar,
  MessageSquare,
  FileText,
  BookOpen,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dashboard V2", href: "/dashboard/v2", icon: LayoutDashboard, badge: "New" },
  { name: "Courses", href: "/courses", icon: BookOpen, badge: "2" },
  { name: "Journal", href: "/journal", icon: FileText },
  { name: "Gamified Learning", href: "/learning/gamified", icon: Target, badge: "Visual" },
  { name: "JawGnarl v2", href: "/jawgnarl", icon: Target, badge: "New" },
  { name: "Community", href: "/community", icon: MessageSquare, badge: "3" },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Affiliates", href: "/affiliates", icon: DollarSign, badge: "Mentor" },
  { name: "Prop Firms", href: "/props", icon: Target, badge: "Funded" },
  { name: "Brokers", href: "/brokers", icon: Users, badge: "Trade" },
  { name: "Signals", href: "/signals", icon: TrendingUp, badge: "Pro" },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose = () => {} }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-collapse on tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setSidebarCollapsed(isTablet);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2"
          onClick={onMobileClose}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          {(!sidebarCollapsed || isHovering) && (
            <>
              <span className="text-xl font-bold">Dracarys</span>
              <Badge variant="secondary" className="ml-2">Pro</Badge>
            </>
          )}
        </Link>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto hidden lg:flex h-8 w-8 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Search - only show when not collapsed */}
      {(!sidebarCollapsed || isHovering) && (
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={onMobileClose}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  (!sidebarCollapsed || isHovering) ? "h-10" : "h-12 px-3",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={sidebarCollapsed && !isHovering ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!sidebarCollapsed || isHovering) && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
                {(!sidebarCollapsed || isHovering) && item.badge && (
                  <Badge
                    variant={item.badge === "Pro" ? "secondary" : item.badge === "Visual" ? "secondary" : "destructive"}
                    className="ml-auto text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {item.badge === "Pro" ? "P" : item.badge === "Visual" ? "V" : item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-4">
        {/* Notifications - only show when expanded */}
        {(!sidebarCollapsed || isHovering) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
          >
            <Bell className="w-4 h-4 mr-3" />
            Notifications
            <Badge variant="destructive" className="ml-auto text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              4
            </Badge>
          </Button>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-2 h-auto mt-2 transition-all duration-200",
                (!sidebarCollapsed || isHovering) ? "" : "px-3"
              )}
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className={cn("flex-shrink-0", (!sidebarCollapsed || isHovering) ? "w-8 h-8" : "w-6 h-6")}>
                  <AvatarImage src="" alt={user?.email || "User"} />
                  <AvatarFallback className="text-sm bg-primary/10 text-primary">
                    {getUserInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
                {(!sidebarCollapsed || isHovering) && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </div>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="w-4 h-4 mr-2" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        {(!sidebarCollapsed || isHovering) && (
          <div className="mt-4 flex justify-center">
            <ThemeSwitcher />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-card z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </>
      )}

      {/* Desktop/Table Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col transition-all duration-300 ease-in-out bg-card border-r border-border",
          "fixed md:inset-y-0 md:left-0 md:z-40",
          sidebarCollapsed && !isHovering ? "md:w-16" : "md:w-64"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <SidebarContent />
      </div>
    </>
  );
}
