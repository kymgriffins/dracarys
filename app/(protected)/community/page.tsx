"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Heart,
  Share2,
  Search,
  Filter,
  Users,
  TrendingUp,
  Star,
  ThumbsUp,
  MessageCircle,
  Plus,
  Hash
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: Date;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
}

interface Discussion {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  lastActivity: Date;
  participants: number;
  messages: number;
  category: string;
  isHot: boolean;
}

// Mock community data
const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Mitchell",
      avatar: "/avatars/sarah.jpg",
      role: "Senior Trader"
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    title: "EUR/USD Analysis: Bullish Momentum Building",
    content: "After analyzing the weekly charts, I'm seeing strong bullish momentum building in EUR/USD. The pair has formed a solid base above the 200-week MA and RSI shows oversold conditions. What's your entry strategy for this setup?",
    category: "Technical Analysis",
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    tags: ["EUR/USD", "bullish", "momentum"]
  },
  {
    id: "2",
    author: {
      name: "Marcus Rodriguez",
      avatar: "/avatars/marcus.jpg",
      role: "Psychology Coach"
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    title: "Overcoming Trading FOMO: A Psychological Perspective",
    content: "Fear of Missing Out is one of the biggest psychological challenges traders face. I've noticed many traders jump into trades they haven't properly analyzed just because 'everyone else is doing it.' What's your strategy for dealing with FOMO?",
    category: "Psychology",
    likes: 42,
    comments: 15,
    shares: 7,
    isLiked: true,
    tags: ["psychology", "FOMO", "discipline"]
  },
  {
    id: "3",
    author: {
      name: "Dr. Emma Wilson",
      avatar: "/avatars/emma.jpg",
      role: "Trading Psychologist"
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    title: "Risk Management: Position Sizing Deep Dive",
    content: "Your position size determines your risk, not your potential reward. Let's break down how to properly calculate position sizes based on your risk tolerance and account size. Share your current position sizing method below!",
    category: "Risk Management",
    likes: 67,
    comments: 23,
    shares: 12,
    isLiked: false,
    tags: ["risk", "position-sizing", "money-management"]
  }
];

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    author: {
      name: "James Chen",
      avatar: "/avatars/james.jpg",
      role: "Forex Expert"
    },
    title: "Weekend Market Review & Monday Setup",
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    participants: 12,
    messages: 47,
    category: "Market Analysis",
    isHot: true
  },
  {
    id: "2",
    author: {
      name: "Lisa Anderson",
      avatar: "/avatars/lisa.jpg",
      role: "Mentor"
    },
    title: "Building Psychological Resilience",
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    participants: 8,
    messages: 32,
    category: "Psychology",
    isHot: false
  }
];

const categories = ["All", "Technical Analysis", "Psychology", "Risk Management", "Market Analysis"];

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [discussions, setDiscussions] = useState(mockDiscussions);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "discussions">("feed");

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
        : post
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with fellow traders, share insights, and learn from the community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
          <Button
            variant={activeTab === "feed" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("feed")}
            className="px-4"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feed
          </Button>
          <Button
            variant={activeTab === "discussions" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("discussions")}
            className="px-4"
          >
            <Users className="w-4 h-4 mr-2" />
            Discussions
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === "feed" ? "Search posts..." : "Search discussions..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
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

          <Button className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === "feed" ? "New Post" : "Start Discussion"}
          </Button>
        </div>

        {/* Content */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{post.author.name}</span>
                          <Badge variant="outline" className="text-xs">{post.author.role}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTime(post.timestamp)}</span>
                      </div>
                    </div>

                    <Badge variant="secondary">{post.category}</Badge>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Engagement Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={post.isLiked ? "text-muted-foreground" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>

                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>

                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>

                    <Button variant="outline" size="sm">
                      View Full Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Discussion Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{discussion.category}</Badge>
                    {discussion.isHot && (
                      <Badge className="bg-muted">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {discussion.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={discussion.author.avatar} />
                      <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">{discussion.author.name}</span>
                      <div className="text-xs text-muted-foreground">{discussion.author.role}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {discussion.participants} participants
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {discussion.messages} messages
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="text-xs text-muted-foreground mb-4">
                    Last activity: {formatTime(discussion.lastActivity)}
                  </div>

                  <Button variant="outline" className="w-full">
                    Join Discussion
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(activeTab === "feed" && filteredPosts.length === 0) && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {activeTab === "feed" ? "No posts found" : "No discussions found"}
            </h3>
            <p className="text-muted-foreground">
              {activeTab === "feed"
                ? "Be the first to share your trading insights with the community!"
                : "Start a new discussion to connect with fellow traders!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
