"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Trophy,
  Star,
  Zap,
  Award,
  TrendingUp,
  Users,
  Target,
  X,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Achievement } from "@/lib/types/affiliate-points";

interface NotificationItem {
  id: string;
  type: 'achievement' | 'points' | 'level_up' | 'leaderboard' | 'milestone';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface RealTimeNotificationsProps {
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

export function RealTimeNotifications({
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead
}: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock real-time notifications - in a real app this would come from WebSocket or SSE
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: 'notif-1',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        description: 'You earned the "Social Butterfly" badge for following on 5 platforms',
        icon: <Trophy className="w-4 h-4" />,
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        data: { achievementId: 'social-butterfly' }
      },
      {
        id: 'notif-2',
        type: 'points',
        title: 'Points Earned!',
        description: '+25 points for following on Twitter',
        icon: <Star className="w-4 h-4" />,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false
      },
      {
        id: 'notif-3',
        type: 'level_up',
        title: 'Level Up!',
        description: 'Congratulations! You reached Level 12',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600 bg-green-50 border-green-200',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: 'notif-4',
        type: 'leaderboard',
        title: 'Leaderboard Update',
        description: 'You moved up 2 positions in the weekly rankings!',
        icon: <Award className="w-4 h-4" />,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true
      }
    ];

    // Simulate receiving notifications over time
    const addNotification = (notification: NotificationItem) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // Add initial notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomTypes: NotificationItem['type'][] = ['points', 'achievement', 'milestone'];
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];

      const newNotification: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: randomType,
        title: randomType === 'points' ? 'Points Earned!' :
               randomType === 'achievement' ? 'Achievement Unlocked!' :
               'Milestone Reached!',
        description: randomType === 'points' ? `+${Math.floor(Math.random() * 50) + 10} points earned` :
                    randomType === 'achievement' ? 'New badge unlocked for your engagement!' :
                    'You hit a new engagement milestone!',
        icon: randomType === 'points' ? <Star className="w-4 h-4" /> :
              randomType === 'achievement' ? <Trophy className="w-4 h-4" /> :
              <Target className="w-4 h-4" />,
        color: randomType === 'points' ? 'text-blue-600 bg-blue-50 border-blue-200' :
               randomType === 'achievement' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
               'text-green-600 bg-green-50 border-green-200',
        timestamp: new Date(),
        read: false
      };

      // Only add notification occasionally (simulating real activity)
      if (Math.random() > 0.7) {
        addNotification(newNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.read) {
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      onMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    onMarkAllAsRead?.();
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {showPanel && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 shadow-lg border-2">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs">Start engaging to get notified!</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full border ${notification.color}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-tight">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowPanel(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Click outside to close */}
      {showPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPanel(false)}
        />
      )}
    </div>
  );
}
