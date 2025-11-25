"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  MessageSquare,
  Star,
  Filter,
  Search,
  UserPlus,
  Mic,
  MicOff,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Sparkles,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  isUserHosted?: boolean;
}

interface SessionFormData {
  title: string;
  description: string;
  duration: number;
  category: string;
  isPrivate: boolean;
  maxParticipants: number;
  price: number;
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

const categories = ["All", "Live", "Upcoming", "Recorded", "My Sessions", "Psychology", "Technical Analysis", "Risk Management"];

export default function LiveSessionsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState<SessionFormData>({
    title: "",
    description: "",
    duration: 60,
    category: "Technical Analysis",
    isPrivate: false,
    maxParticipants: 100,
    price: 0,
    isPremium: false
  });

  // Check if user has an active live session
  const activeLiveSession = mySessions.find(session => session.type === "live");

  const combinedSessions = [...mockSessions, ...mySessions];

  const handleCreateSession = () => {
    if (!formData.title.trim()) {
      alert("Please enter a session title");
      return;
    }

    const newSession: Session = {
      id: Date.now().toString(),
      title: formData.title,
      instructor: {
        name: "You", // Current user
        avatar: "/avatars/current-user.jpg",
        rating: 4.5
      },
      type: "live",
      startTime: new Date(),
      duration: formData.duration,
      participants: 1,
      maxParticipants: formData.maxParticipants,
      price: formData.price || undefined,
      category: formData.category,
      description: formData.description,
      isPremium: formData.isPremium,
      isUserHosted: true
    };

    setMySessions(prev => [newSession, ...prev]);
    setIsStreaming(true);
    setIsCreateDialogOpen(false);

    // Reset form
    setFormData({
      title: "",
      description: "",
      duration: 60,
      category: "Technical Analysis",
      isPrivate: false,
      maxParticipants: 100,
      price: 0,
      isPremium: false
    });
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      duration: session.duration,
      category: session.category,
      isPrivate: false, // You could extend this
      maxParticipants: session.maxParticipants || 100,
      price: session.price || 0,
      isPremium: session.isPremium
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSession = () => {
    if (!editingSession || !formData.title.trim()) return;

    setMySessions(prev => prev.map(session =>
      session.id === editingSession.id ? {
        ...session,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        category: formData.category,
        maxParticipants: formData.maxParticipants,
        price: formData.price || undefined,
        isPremium: formData.isPremium
      } : session
    ));

    setIsEditDialogOpen(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) {
      setMySessions(prev => prev.filter(session => session.id !== sessionId));
      setIsStreaming(false); // End streaming if deleting active session
    }
  };

  const handleEndSession = (sessionId: string) => {
    setMySessions(prev => prev.map(session =>
      session.id === sessionId ? { ...session, type: "recorded" as const } : session
    ));
    setIsStreaming(false);
  };

  const handleQuickStart = () => {
    // Quick start with default settings
    setFormData(prev => ({
      ...prev,
      title: `Live Trading Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: "Join me for a live trading analysis and Q&A session"
    }));
    setIsCreateDialogOpen(true);
  };

  const filteredSessions = combinedSessions.filter(session => {
    const matchesCategory =
      selectedCategory === "All" ||
      session.category === selectedCategory ||
      session.type === selectedCategory.toLowerCase() ||
      (selectedCategory === "My Sessions" && session.isUserHosted);

    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getTypeColor = (type: Session["type"]) => {
    switch (type) {
      case "live": return "bg-muted animate-pulse";
      case "upcoming": return "bg-primary";
      case "recorded": return "bg-secondary";
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Live Sessions</h1>
            <p className="text-muted-foreground">
              Join interactive trading sessions, workshops, and educational content
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isStreaming && (
              <Badge className="bg-muted text-muted-foreground animate-pulse">
                <div className="w-2 h-2 bg-muted rounded-full mr-2"></div>
                LIVE NOW
              </Badge>
            )}

            <Button
              variant="outline"
              onClick={handleQuickStart}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Quick Start
            </Button>

            {/* Create Session Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Live Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Live Session</DialogTitle>
                  <DialogDescription>
                    Set up your live trading session. You'll be able to share your screen, voice, and interact with participants.
                  </DialogDescription>
                </DialogHeader>

                <SessionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreateSession}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
            <Card key={session.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => router.push(`/sessions/${session.id}`)}>
              <CardContent className="p-0">
                {/* Live indicator */}
                <div className="relative">
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-bold ${getTypeColor(session.type)}`}>
                    {getTypeLabel(session.type)}
                  </div>

                  {session.isUserHosted && (
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30">
                            <MoreVertical className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditSession(session)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-muted-foreground"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  {/* Session thumbnail/type indicator */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {session.type === "live" ? (
                      <div className="text-center">
                        <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
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
                      <p className="font-medium text-sm flex items-center gap-2">
                        {session.instructor.name}
                        {session.isUserHosted && (
                          <Badge variant="outline" className="text-xs px-1 py-0 bg-primary text-primary border-primary">
                            Your Session
                          </Badge>
                        )}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-accent-foreground mr-1" />
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
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          Free
                        </Badge>
                      )}
                      {session.isPremium && (
                        <Badge variant="secondary" className="bg-primary text-primary">
                          Pro
                        </Badge>
                      )}
                      {session.isUserHosted && (
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Settings className="w-3 h-3 mr-1" />
                          Managed
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <Button
                        size="sm"
                        className={session.type === "live" ? "bg-muted hover:bg-muted animate-pulse" : ""}
                      >
                        {session.type === "live" && <Video className="w-4 h-4 mr-2" />}
                        {session.type === "upcoming" && <Calendar className="w-4 h-4 mr-2" />}
                        {session.type === "recorded" && <Play className="w-4 h-4 mr-2" />}
                        {session.type === "live" ? "Join Live" :
                         session.type === "upcoming" ? "Set Reminder" : "Watch Now"}
                      </Button>

                      {session.isUserHosted && session.type === "live" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEndSession(session.id)}
                          className="text-muted-foreground border-muted hover:bg-muted"
                        >
                          End Session
                        </Button>
                      )}

                      {session.isUserHosted && session.type === "recorded" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Reopen session functionality
                            setMySessions(prev => prev.map(s =>
                              s.id === session.id ? { ...s, type: "live" as const, startTime: new Date() } : s
                            ));
                            setIsStreaming(true);
                          }}
                          className="text-primary border-primary hover:bg-primary"
                        >
                          Restart Session
                        </Button>
                      )}
                    </div>
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

        {/* Edit Session Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
              <DialogDescription>
                Update your session details. Changes will be reflected immediately.
              </DialogDescription>
            </DialogHeader>

            <SessionForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateSession}
              onCancel={() => setIsEditDialogOpen(false)}
              submitText="Update Session"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function SessionForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitText = "Start Live Session"
}: {
  formData: SessionFormData;
  setFormData: (data: SessionFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitText?: string;
}) {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            placeholder="e.g., EUR/USD Market Analysis Live"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what you'll be covering in the session..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="300"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: string) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical Analysis">Technical Analysis</SelectItem>
                <SelectItem value="Psychology">Psychology</SelectItem>
                <SelectItem value="Risk Management">Risk Management</SelectItem>
                <SelectItem value="Forex">Forex</SelectItem>
                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                <SelectItem value="Q&A">Q&A</SelectItem>
                <SelectItem value="Live Trading">Live Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="max-participants">Max Participants</Label>
            <Input
              id="max-participants"
              type="number"
              min="1"
              max="500"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 100 })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-premium"
            checked={formData.isPremium}
            onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked as boolean })}
          />
          <Label htmlFor="is-premium" className="text-sm font-medium">
            Premium Session
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-private"
            checked={formData.isPrivate}
            onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked as boolean })}
          />
          <Label htmlFor="is-private" className="text-sm font-medium">
            Private Session (invite only)
            <span className="block text-xs text-muted-foreground ml-6">
              {formData.isPrivate ? (
                <>
                  <EyeOff className="w-3 h-3 inline mr-1" />
                  Only invited participants can view
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 inline mr-1" />
                  Anyone can join
                </>
              )}
            </span>
          </Label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          {submitText}
        </Button>
      </DialogFooter>
    </>
  );
}
