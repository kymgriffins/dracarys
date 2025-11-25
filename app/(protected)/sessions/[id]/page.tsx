"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Video,
  VideoOff,
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Play,
  Download,
  Share2,
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  Star,
  Hand,
  Grid3X3,
  MoreVertical,
  Shield,
  ShieldCheck,
  UserX
} from "lucide-react";

// Mock data for sessions
const mockSessions: any = {
  "1": {
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
    isPremium: false,
    streamUrl: "/api/streams/live-1",
    chatMessages: [
      { id: "1", user: "TraderJoe", message: "Great setup on EUR/USD!", time: "2m ago", role: "student" },
      { id: "2", user: "MarcusChen", message: "Thanks! Watch the 1.0980 resistance level", time: "1m ago", role: "presenter" }
    ]
  },
  "2": {
    id: "2",
    title: "Psychology Workshop: Overcoming Fear",
    instructor: {
      name: "Dr. Sarah Williams",
      avatar: "/avatars/sarah.jpg",
      rating: 4.8
    },
    type: "upcoming",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 60,
    participants: 23,
    maxParticipants: 50,
    price: 25,
    category: "Psychology",
    description: "Learn practical techniques to manage trading fear and make confident decisions.",
    isPremium: true
  },
  "3": {
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
    isPremium: true,
    videoUrl: "/videos/risk-management-masterclass.mp4",
    recordings: [
      {
        title: "Position Sizing Fundamentals",
        duration: "25:30",
        url: "/videos/position-sizing.mp4"
      },
      {
        title: "Risk/Reward Ratios",
        duration: "18:45",
        url: "/videos/risk-reward.mp4"
      },
      {
        title: "Live Trading Examples",
        duration: "76:20",
        url: "/videos/live-examples.mp4"
      }
    ],
    notes: "Risk management is the foundation of successful trading. In this masterclass, we cover essential concepts including position sizing, stop loss placement, and risk/reward optimization.",
    chatMessages: []
  }
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [isParticipant, setIsParticipant] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [viewMode, setViewMode] = useState<"speaker" | "gallery">("speaker");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const session = mockSessions[sessionId];

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <Button onClick={() => router.push('/sessions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  const handleJoinSession = () => {
    if (session.type === "live") {
      // Request permissions and join
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(() => {
        setIsParticipant(true);
        setIsStreaming(true);
      }).catch(() => {
        // Still allow joining without audio
        setIsParticipant(true);
        setIsStreaming(true);
        setIsMuted(true);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/sessions')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{session.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {session.participants} {session.type === "recorded" ? "views" : "participants"}
                </span>
                {session.startTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.type === "live" ? "Live now" :
                     session.type === "upcoming" ? `Starts at ${session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                     `${session.duration}min recorded`}
                  </span>
                )}
                <Badge variant={session.type === "live" ? "destructive" : session.type === "upcoming" ? "default" : "secondary"}>
                  {session.type === "live" ? "LIVE" : session.type === "upcoming" ? "UPCOMING" : "RECORDED"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                  {session.type === "live" && isStreaming ? (
                    // Live streaming interface
                    <div className="w-full h-full flex flex-col">
                      {/* Live conference view */}
                      <div className="flex-1 bg-gray-900 flex items-center justify-center">
                        {isParticipant ? (
                          <div className="text-center text-white">
                            <div className="mb-8">
                              <img
                                src={session.instructor.avatar}
                                alt={session.instructor.name}
                                className="w-32 h-32 rounded-full mx-auto border-4 border-primary"
                              />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{session.instructor.name}</h2>
                            <p className="text-gray-300">{session.instructor.title}</p>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-bold mb-2">Live Session</h3>
                            <p className="text-gray-300 mb-4">Click Join Now to participate</p>
                          </div>
                        )}
                      </div>

                      {/* Video Controls - Only show if user is participant */}
                      {isParticipant && (
                        <div className="p-4 bg-gray-900 border-t border-gray-700">
                          <div className="flex justify-center items-center gap-2">
                            <Button
                              variant={isMuted ? "destructive" : "secondary"}
                              size="sm"
                              onClick={() => setIsMuted(!isMuted)}
                              className="rounded-full w-12 h-12 p-0"
                            >
                              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>

                            <Button
                              variant={!isCameraOn ? "destructive" : "secondary"}
                              size="sm"
                              onClick={() => setIsCameraOn(!isCameraOn)}
                              className="rounded-full w-12 h-12 p-0"
                            >
                              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                            </Button>

                            <Button
                              variant={handRaised ? "default" : "secondary"}
                              size="sm"
                              onClick={() => setHandRaised(!handRaised)}
                              className="rounded-full w-12 h-12 p-0"
                            >
                              <Hand className={`w-5 h-5 ${handRaised ? 'text-accent-foreground' : ''}`} />
                            </Button>

                            <Button
                              variant="secondary"
                              size="sm"
                              className="rounded-full w-12 h-12 p-0"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setIsParticipant(false)}
                              className="rounded-full w-12 h-12 p-0 ml-4"
                            >
                              <UserX className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : session.type === "recorded" ? (
                    // Recorded video player
                    <div className="w-full h-full flex flex-col">
                      <div className="flex-1 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                          <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                          <p className="text-gray-300">Click play to start watching</p>
                        </div>
                      </div>
                      {/* Video controls would go here */}
                      <div className="p-4 bg-gray-800 border-t border-gray-600">
                        <div className="flex justify-center">
                          <Button className="bg-primary hover:bg-primary">
                            <Play className="w-4 h-4 mr-2" />
                            Play Recording
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Upcoming session placeholder
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <div className="text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <h3 className="text-xl font-bold mb-2">Session Starts Soon</h3>
                        <p className="text-muted-foreground">
                          {session.startTime && `Scheduled for ${session.startTime.toLocaleDateString()} at ${session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={session.instructor.avatar} />
                        <AvatarFallback>{session.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{session.title}</h2>
                        <p className="text-lg text-muted-foreground mb-2">by {session.instructor.name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent-foreground fill-current" />
                            <span className="font-medium">{session.instructor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{session.participants.toLocaleString()} {session.type === "recorded" ? "views" : "joined"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.price && (
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          ${session.price}
                        </Badge>
                      )}
                      {session.isPremium && (
                        <Badge variant="default">Premium</Badge>
                      )}
                      {session.type === "live" && !isParticipant && (
                        <Button
                          size="lg"
                          onClick={handleJoinSession}
                          className="bg-muted hover:bg-muted animate-pulse"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Live Session
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {session.description}
                  </p>

                  {/* Additional content for recorded sessions */}
                  {session.type === "recorded" && session.notes && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Session Notes</h3>
                      <p className="text-sm text-muted-foreground">{session.notes}</p>
                    </div>
                  )}

                  {/* Recording playlist for recorded sessions */}
                  {session.type === "recorded" && session.recordings && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Session Content</h3>
                      <div className="space-y-2">
                        {session.recordings.map((recording: any, index: number) => (
                          <Card key={index} className="cursor-pointer hover:bg-muted/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{recording.title}</h4>
                                  <p className="text-sm text-muted-foreground">{recording.duration}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Play className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat - Show for live sessions when joined */}
            {session.type === "live" && isParticipant && (
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {session.chatMessages.map((message: any) => (
                      <div key={message.id} className="flex gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs">
                            {message.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{message.user}</span>
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Send a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={sendChatMessage}>
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants List - Show for live sessions */}
            {session.type === "live" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participants ({session.participants})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Avatar>
                      <AvatarImage src={session.instructor.avatar} />
                      <AvatarFallback>{session.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{session.instructor.name}</p>
                      <p className="text-xs text-muted-foreground">Host</p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">Speaking</Badge>
                  </div>

                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Participant {i}</p>
                        <p className="text-xs text-muted-foreground">Joined</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Download options for recorded sessions */}
            {session.type === "recorded" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Notes (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Session
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
