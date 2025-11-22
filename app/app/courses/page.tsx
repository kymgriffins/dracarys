"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Play,
  Clock,
  Users,
  BookOpen,
  Star,
  Filter,
  Grid,
  List,
  ChevronRight,
  Youtube,
  Lock,
  CheckCircle,
  X
} from "lucide-react";




interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    publishedAt: string;
    channelTitle: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  price?: number;
  isPremium: boolean;
  category: string;
}

// Mock premium courses data
const premiumCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Price Action Mastery",
    description: "Master the art of reading price action and making confident trading decisions in any market condition.",
    thumbnail: "/api/placeholder/400/250",
    duration: "12 weeks",
    level: "Advanced",
    enrolled: 2847,
    rating: 4.9,
    price: 299,
    isPremium: true,
    category: "Technical Analysis"
  },
  {
    id: "2",
    title: "Risk Management & Money Management",
    description: "Learn the secrets of professional traders for protecting capital and maximizing returns.",
    thumbnail: "/api/placeholder/400/250",
    duration: "8 weeks",
    level: "Intermediate",
    enrolled: 1923,
    rating: 4.8,
    price: 199,
    isPremium: true,
    category: "Risk Management"
  },
  {
    id: "3",
    title: "Psychology of Trading Success",
    description: "Transform your mindset and develop the mental fortitude required for consistent trading success.",
    thumbnail: "/api/placeholder/400/250",
    duration: "6 weeks",
    level: "All Levels",
    enrolled: 3456,
    rating: 4.9,
    price: 149,
    isPremium: true,
    category: "Psychology"
  }
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const categories = ["All", "Technical Analysis", "Psychology", "Risk Management", "Free Content"];

  // Fetch YouTube videos on component mount
  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const CHANNEL_HANDLE = process.env.NEXT_PUBLIC_DEFAULT_YOUTUBE_CHANNEL;

        if (!YOUTUBE_API_KEY || !CHANNEL_HANDLE) {
          console.warn('YouTube API key or channel handle not configured');
          setYoutubeVideos([]);
          setLoading(false);
          return;
        }

        // Clean the channel handle (remove @ if present)
        const cleanChannelHandle = CHANNEL_HANDLE.replace('@', '');

        // Try to find the channel by username/handle directly
        try {
          const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&forUsername=${cleanChannelHandle}&part=id,snippet&maxResults=1`
          );

          let channelData;
          let channelId;

          if (channelResponse.ok) {
            channelData = await channelResponse.json();
            channelId = channelData.items?.[0]?.id;
          }

          // If username lookup didn't work, try searching for the handle
          if (!channelId) {
            const searchResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(cleanChannelHandle)}&type=channel&part=snippet&maxResults=1`
            );

            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              channelId = searchData.items?.[0]?.snippet?.channelId;
            }
          }

          if (!channelId) {
            throw new Error('Channel not found');
          }

          // Now fetch videos from the channel
          const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=12&type=video`
          );

          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            // Filter out non-video items and ensure we have valid video data
            const validVideos = (videosData.items || []).filter((item: YouTubeVideo) =>
              item.id?.videoId && item.snippet?.thumbnails
            );
            setYoutubeVideos(validVideos);
          } else {
            throw new Error('Failed to fetch videos');
          }
        } catch (apiError) {
          console.error('YouTube API Error:', apiError);
          // Continue with empty array
          setYoutubeVideos([]);
        }
      } catch (error) {
        console.error('Error in fetchYouTubeVideos:', error);
        setYoutubeVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideos();
  }, []);

  const filteredCourses = premiumCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to human readable
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openVideoPlayer = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setVideoModalOpen(true);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    setVideoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-muted-foreground">
            Master trading with our comprehensive courses and free educational content
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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

          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Free YouTube Content Section */}
        {(selectedCategory === "All" || selectedCategory === "Free Content") && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Free Educational Content</h2>
                <p className="text-muted-foreground">Watch free trading videos from our YouTube channel</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Youtube className="w-3 h-3 mr-1" />
                Free Access
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeVideos.map((video) => (
                  <Card
                    key={video.id.videoId}
                    className="group hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openVideoPlayer(video)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-full aspect-video object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-t-lg">
                          <Button size="lg" className="bg-red-600 hover:bg-red-700 pointer-events-none">
                            <Play className="w-5 h-5 mr-2" />
                            Watch Now
                          </Button>
                        </div>
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          Free
                        </Badge>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 leading-tight">
                          {video.snippet.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {video.snippet.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Youtube className="w-3 h-3 mr-1" />
                            {video.snippet.channelTitle}
                          </span>
                          <span>{new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {youtubeVideos.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12">
                    <Youtube className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No videos available</h3>
                    <p className="text-muted-foreground">Check back later for new content</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Premium Courses Section */}
        {(selectedCategory === "All" || selectedCategory !== "Free Content") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Premium Courses</h2>
                <p className="text-muted-foreground">Comprehensive training programs for serious traders</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Lock className="w-3 h-3 mr-1" />
                Pro Access Required
              </Badge>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}>
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/60" />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-orange-500">
                        ${course.price}
                      </Badge>
                      {course.isPremium && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {course.rating}
                        </div>
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">
                        {course.title}
                      </h3>

                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {course.enrolled.toLocaleString()} enrolled
                        </div>
                      </div>

                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Course - ${course.price}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {videoModalOpen && selectedVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-xl">
                      <Youtube className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {selectedVideo.snippet.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedVideo.snippet.channelTitle} • {new Date(selectedVideo.snippet.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeVideoPlayer}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="relative w-full bg-black rounded-b-3xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1&rel=0`}
                  title={selectedVideo.snippet.title}
                  className="w-full aspect-video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
