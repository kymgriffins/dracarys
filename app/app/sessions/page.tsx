"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  MessageSquare,
  Star,
  ChevronRight,
  Filter,
  Search,
  UserPlus,
  Mic,
  MicOff
} from "lucide-react";

interface Session {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
    rating: number;
  };
  type: "live" | "recorded" | "upcoming";
  startTime?: Date;
  duration: number;
  participants: number;
  maxParticipants?: number;
  price?: number;
  category: string;
  description: string;
  isPremium: boolean;
}

// Mock session data
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Live Market Analysis: Major Pairs Setup",
    instructor: {
      name: "Marcus Chen",
      avatar: "/avatars/marcus.jpg",
      rating: 4.9
    },
    type: "live",
    startTime: new Date(),
    duration: 90,
    participants: 45,
    maxParticipants: 100,
    price: 15,
    category: "Technical Analysis",
    description: "Join our expert analyst for real-time market analysis and trading setups on major forex pairs.",
    isPremium: false
  },
  {
    id: "2",
    title: "Psychology Workshop: Overcoming Fear",
    instructor: {
      name: "Dr. Sarah Williams",
      avatar: "/avatars/sarah.jpg",
      rating: 4.8
    },
    type: "upcoming",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    participants: 23,
    maxParticipants: 50,
    price: 25,
    category: "Psychology",
    description: "Learn practical techniques to manage trading fear and make confident decisions.",
    isPremium: true
  },
  {
    id: "3",
    title: "Risk Management Masterclass (Recording)",
    instructor: {
      name: "James Rodriguez",
      avatar: "/avatars/james.jpg",
      rating: 5.0
    },
    type: "recorded",
    duration: 120,
    participants: 1234,
    category: "Risk Management",
    description: "Comprehensive guide to protecting your trading capital and maximizing returns.",
    isPremium: true
  }
];

const categories = ["All", "Live", "Upcoming", "Recorded", "Psychology", "Technical Analysis", "Risk Management"];

export default function LiveSessionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = mockSessions.filter(session => {
    const matchesCategory =
      selectedCategory === "All" ||
      session.category === selectedCategory ||
      session.type === selectedCategory.toLowerCase();

    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getTypeColor = (type: Session["type"]) => {
    switch (type) {
      case "live": return "bg-red-500 animate-pulse";
      case "upcoming": return "bg-blue-500";
      case "recorded": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: Session["type"]) => {
    switch (type) {
      case "live": return "LIVE NOW";
      case "upcoming": return "UPCOMING";
      case "recorded": return "RECORDED";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Live Sessions</h1>
          <p className="text-muted-foreground">
            Join interactive trading sessions, workshops, and educational content
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                {/* Live indicator */}
                <div className="relative">
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-bold ${getTypeColor(session.type)}`}>
                    {getTypeLabel(session.type)}
                  </div>

                  {/* Session thumbnail/type indicator */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {session.type === "live" ? (
                      <div className="text-center">
                        <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-primary">{session.participants} watching</span>
                        </div>
                      </div>
                    ) : session.type === "upcoming" ? (
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-primary mx-auto mb-2" />
                        <span className="text-sm font-medium text-primary">
                          {session.startTime && formatTime(session.startTime)}
                        </span>
                      </div>
                    ) : (
                      <Play className="w-12 h-12 text-primary" />
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Instructor */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={session.instructor.avatar} />
                      <AvatarFallback>{session.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{session.instructor.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {session.instructor.rating}
                      </div>
                    </div>
                  </div>

                  {/* Title and description */}
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight">
                    {session.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {session.description}
                  </p>

                  {/* Session details */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.duration}min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {session.participants}
                        {session.maxParticipants && `/${session.maxParticipants}`}
                      </div>
                    </div>
                  </div>

                  {/* Price and action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {session.price ? (
                        <span className="text-lg font-bold text-primary">${session.price}</span>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Free
                        </Badge>
                      )}
                      {session.isPremium && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Pro
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className={session.type === "live" ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""}
                    >
                      {session.type === "live" && <Video className="w-4 h-4 mr-2" />}
                      {session.type === "upcoming" && <Calendar className="w-4 h-4 mr-2" />}
                      {session.type === "recorded" && <Play className="w-4 h-4 mr-2" />}
                      {session.type === "live" ? "Join Live" :
                       session.type === "upcoming" ? "Set Reminder" : "Watch Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
