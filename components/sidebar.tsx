"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Shield,
  User,
  LogOut
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
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
  { name: "Workspaces", href: "/app/workspaces", icon: Users },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Portfolio", href: "/app/portfolio", icon: Wallet, badge: "Beta" },
  { name: "Trading", href: "/app/trading", icon: TrendingUp },
  { name: "Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Payment", href: "/payment/stripe", icon: Wallet },
];

const quickActions = [
  { name: "New Task", href: "/app/tasks/new", icon: Plus, shortcut: "N" },
  { name: "New Workspace", href: "/app/workspaces/new", icon: Users },
  { name: "Quick Trade", href: "/app/trading/quick", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Get user initials for avatar fallback
  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="fixed inset-0 z-40 lg:hidden">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:translate-x-0 transform -translate-x-full lg:static lg:inset-0 transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <Link href="/app/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dracarys</span>
              <Badge variant="secondary" className="ml-2">Pro</Badge>
            </Link>
          </div>

          {/* Search */}
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

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <action.icon className="w-4 h-4 mr-3" />
                    {action.name}
                    {action.shortcut && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {action.shortcut}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-border p-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
            >
              <Bell className="w-4 h-4 mr-3" />
              Notifications
              <Badge variant="destructive" className="ml-auto text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Settings */}
            <Link href="/app/settings">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === "/app/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto mt-4">
                  <div className="flex items-center space-x-3 w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt={user?.email || "User"} />
                      <AvatarFallback className="text-sm bg-primary/10 text-primary">
                        {getUserInitials(user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </div>
                    </div>
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
            <div className="mt-4 flex justify-center">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
