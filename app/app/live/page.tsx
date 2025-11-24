"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Play,
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Crown,
  Star,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  Monitor,
  Smartphone,
  Headphones,
  Settings,
  Bot,
  HelpCircle,
  ThumbsUp,
  Hash,
  AtSign,
  Smile
} from "lucide-react";

const liveStreams = [
  {
    id: "1",
    title: "Live EUR/USD Analysis & Trading Setup",
    presenter: {
      name: "Alex Rodriguez",
      title: "Senior Market Analyst",
      avatar: "/mentors/alex.jpg",
      rating: 4.9,
      followers: 12340
    },
    viewers: 2347,
    isLive: true,
    startTime: Date.now() - (30 * 60 * 1000), // 30 mins ago
    duration: 90,
    description: "Join our live analysis session covering current EUR/USD movements, key support/resistance levels, and potential trade setups",
    thumbnail: "/api/placeholder/400/250",
    tags: ["EUR/USD", "Technical Analysis", "Live Trading"],
    isPremium: false
  },
  {
    id: "2",
    title: "Lord of Merchants: Psychology Masterclass",
    presenter: {
      name: "Lord of Merchants",
      title: "Master Trading Mentor",
      avatar: "/mentors/lord-of-merchants.jpg",
      rating: 5.0,
      followers: 12421
    },
    viewers: 8912,
    isLive: true,
    startTime: Date.now() - (15 * 60 * 1000), // 15 mins ago
    duration: 60,
    description: "Exclusive masterclass on conquering trading psychology, emotional control, and mental edge techniques",
    thumbnail: "/api/placeholder/400/250",
    tags: ["Psychology", "Masterclass", "Emotional Control"],
    isPremium: true
  },
  {
    id: "3",
    title: "Crypto Market Pulse: Bitcoin & Altcoins",
    presenter: {
      name: "Sarah Chen",
      title: "Crypto Strategist",
      avatar: "/mentors/sarah.jpg",
      rating: 4.7,
      followers: 5678
    },
    viewers: 1567,
    isLive: true,
    startTime: Date.now() - (45 * 60 * 1000), // 45 mins ago
    duration: 75,
    description: "Live coverage of cryptocurrency markets with real-time analysis and trade alerts",
    thumbnail: "/api/placeholder/400/250",
    tags: ["Cryptocurrency", "Bitcoin", "Trading Alerts"],
    isPremium: false
  }
];

const upcomingSessions = [
  {
    id: "4",
    title: "Risk Management Deep Dive",
    presenter: "Marcus Johnson",
    startTime: Date.now() + (2 * 60 * 60 * 1000), // 2 hours from now
    duration: 45,
    isPremium: true
  },
  {
    id: "5",
    title: "Q&A with Lord of Merchants",
    presenter: "Lord of Merchants",
    startTime: Date.now() + (24 * 60 * 60 * 1000), // tomorrow
    duration: 30,
    isPremium: true
  },
  {
    id: "6",
    title: "Forex Fundamentals Webinar",
    presenter: "Emily Davis",
    startTime: Date.now() + (3 * 60 * 60 * 1000), // 3 hours from now
    duration: 60,
    isPremium: false
  }
];

const chatMessages = [
  { id: "1", user: "TraderJoe", message: "Great analysis on the EUR/USD setup!", time: "2m ago", role: "student", type: "message", reactions: [] },
  { id: "2", user: "MasterTrader", message: "I saw similar patterns in my morning session", time: "1m ago", role: "premium_student", type: "message", reactions: [] },
  { id: "3", user: "AlexR", message: "@MasterTrader Yes, the market sentiment shifted around 8:30 AM", time: "1m ago", role: "presenter", type: "message", reactions: [{ emoji: "👍", count: 3 }] },
  { id: "4", user: "SarahK", message: "What timeframe are you looking at for entries?", time: "30s ago", role: "student", type: "question", reactions: [] },
  { id: "5", user: "AlexR", message: "@SarahK I'm focusing on 15-min and 1-hour charts right now", time: "10s ago", role: "presenter", type: "message", reactions: [] },
  { id: "6", user: "TradeBot", message: "Welcome to the trading session! Use #help for FAQ or ask questions directly. Learn more about market psychology and risk management.", time: "5s ago", role: "bot", type: "bot_welcome", reactions: [] },
  { id: "7", user: "TradeBot", message: "Question about #entry-timing: Use multiple timeframes to confirm your entries. Start with higher timeframes (4H, Daily) for trend direction, then zoom into 15M-1H for precise entry.", time: "2s ago", role: "bot", type: "faq_response", reactions: [{ emoji: "💡", count: 1 }] }
];

const faqItems = [
  {
    id: "1",
    question: "How do I spot trading opportunities?",
    answer: "Look for confluence of multiple factors: trend direction, support/resistance levels, momentum indicators, and market psychology.",
    tags: ["strategy", "analysis"]
  },
  {
    id: "2",
    question: "What is proper risk management?",
    answer: "Never risk more than 1-2% of your account per trade. Use stop losses consistently. Calculate position size based on risk, not potential profit.",
    tags: ["risk", "management"]
  },
  {
    id: "3",
    question: "How to control trading emotions?",
    answer: "Maintain a trading journal to track emotional states and mistakes. Practice meditation and take breaks when feeling emotional.",
    tags: ["psychology", "emotions"]
  },
  {
    id: "4",
    question: "Best timeframe for beginners?",
    answer: "Start with 1-hour or 4-hour charts to avoid noise and focus on significant price action.",
    tags: ["beginners", "timeframes"]
  },
  {
    id: "5",
    question: "When to take profits?",
    answer: "Exit trades when you reach your target, the market shows reversal signals, or when risk/reward becomes unfavorable.",
    tags: ["exits", "strategy"]
  }
];

export default function LivePage() {
  const [activeTab, setActiveTab] = useState("streams");
  const [isStreamingSelected, setIsStreamingSelected] = useState(false);
  const [selectedStream, setSelectedStream] = useState(liveStreams[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (startTime: number) => {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'presenter': return 'bg-red-100 text-red-800';
      case 'premium_student': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');

      // Check for FAQ keywords
      const lowerMessage = chatMessage.toLowerCase();
      if (lowerMessage.includes('#help') || lowerMessage.includes('help')) {
        setShowFAQ(true);
      }
    }
  };

  // Filtered FAQ based on search
  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Enhanced message rendering based on type
  const renderMessage = (message: typeof chatMessages[0]) => {
    const isBot = message.role === 'bot';
    const isQuestion = message.type === 'question';
    const hasReactions = message.reactions && message.reactions.length > 0;

    return (
      <div key={message.id} className={`flex gap-2 ${isBot ? 'bg-blue-50/50 rounded-lg p-2' : ''}`}>
        <Avatar className="w-5 h-5 flex-shrink-0">
          <AvatarFallback className={`text-xs ${isBot ? 'bg-blue-500 text-white' : ''}`}>
            {isBot ? <Bot className="w-3 h-3" /> : message.user.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium flex items-center gap-1">
              {isBot && <Bot className="w-3 h-3 text-blue-500" />}
              {message.user}
            </span>

            {message.role !== 'student' && !isBot && (
              <Badge className={`text-xs px-1 py-0 ${getRoleColor(message.role)}`}>
                {message.role.replace('_', ' ')}
              </Badge>
            )}

            {isBot && (
              <Badge className="text-xs px-1 py-0 bg-blue-100 text-blue-800">
                Bot
              </Badge>
            )}

            {isQuestion && (
              <HelpCircle className="w-3 h-3 text-orange-500" />
            )}

            <span className="text-xs text-muted-foreground">{message.time}</span>
          </div>

          <p className={`text-xs break-words ${isBot ? 'text-blue-900' : 'text-muted-foreground'}`}>
            {message.message}
          </p>

          {/* Reactions */}
          {hasReactions && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 rounded px-1 py-0.5 flex items-center gap-1 hover:bg-gray-200 cursor-pointer"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600">{reaction.count}</span>
                </span>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 px-1 text-xs text-gray-400 hover:text-gray-600"
              >
                + 👍
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Live Trading Community</h1>
            <p className="text-muted-foreground">
              Join live streams, webinars, and interactive trading sessions
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              3 Live Streams
            </Badge>

            <Button
              variant={isStreamingSelected ? "default" : "outline"}
              onClick={() => setIsStreamingSelected(!isStreamingSelected)}
            >
              <Video className="w-4 h-4 mr-2" />
              {isStreamingSelected ? 'End Stream' : 'Go Live'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stream Grid */}
          <div className="lg:col-span-3">
            <div className="flex gap-2 mb-6 border-b border-border pb-4">
              <Button
                variant={activeTab === "streams" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("streams")}
              >
                Live Streams ({liveStreams.length})
              </Button>
              <Button
                variant={activeTab === "upcoming" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Sessions
              </Button>
              <Button
                variant={activeTab === "community" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("community")}
              >
                Community
              </Button>
            </div>

            {/* Live Streams Tab */}
            {activeTab === "streams" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveStreams.map((stream) => (
                  <Card key={stream.id} className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center min-h-[240px]">
                          <div className="text-center text-white">
                            <Video className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-lg font-medium">Live Stream</p>
                            <p className="text-sm opacity-90 mt-1">Click to join the session</p>
                          </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500">
                            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                            LIVE
                          </Badge>
                        </div>

                        {/* Premium Indicator */}
                        {stream.isPremium && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500">
                              <Crown className="w-3 h-3 mr-1" />
                              PREMIUM
                            </Badge>
                          </div>
                        )}

                        {/* Viewer Count */}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {stream.viewers.toLocaleString()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{stream.title}</h3>

                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{stream.presenter.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{stream.presenter.name}</span>
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">{stream.presenter.rating}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(stream.startTime)}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {stream.tags[0]}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => {
                              setSelectedStream(stream);
                              setIsStreamingSelected(true);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch Live
                          </Button>
                          {stream.isPremium && (
                            <Button variant="outline" size="sm">
                              <Crown className="w-3 h-3 mr-1" />
                              Join Pro
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Upcoming Sessions */}
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{session.title}</h3>
                            {session.isPremium && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(session.startTime).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center">
                              <Monitor className="w-4 h-4 mr-1" />
                              {session.duration} min
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Presented by {session.presenter}
                          </p>
                        </div>

                        <Button
                          variant={session.isPremium ? "default" : "secondary"}
                          onClick={() => console.log(`Join session ${session.id}`)}
                        >
                          {session.isPremium ? (
                            <>
                              <Crown className="w-4 h-4 mr-1" />
                              Join Premium Session
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 mr-1" />
                              Set Reminder
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Community Tab */}
            {activeTab === "community" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Community Session</CardTitle>
                    <CardDescription>
                      Join the trader community for discussions, insights, and networking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-bold mb-2">Community Meeting</h3>
                    <p className="text-muted-foreground mb-4">
                      Weekly live community session every Friday at 3 PM UTC
                    </p>
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Community Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mentor Office Hours</CardTitle>
                    <CardDescription>
                      Schedule 1-on-1 time with trading mentors and experts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Lord of Merchants', 'Alex Rodriguez', 'Marcus Johnson'].map((mentor) => (
                      <div key={mentor} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{mentor.split(' ')[0][0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentor}</p>
                            <p className="text-sm text-muted-foreground">Available for booking</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streaming Controls (if active) */}
            {isStreamingSelected && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Streaming Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className={isMuted ? "bg-red-100" : ""}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={!isCameraOn ? "bg-red-100" : ""}
                    >
                      {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Stream Status</p>
                    <Badge className="bg-red-100 text-red-800">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      LIVE
                    </Badge>
                  </div>

                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    onClick={() => setIsStreamingSelected(false)}
                  >
                    <VideoOff className="w-4 h-4 mr-2" />
                    End Stream
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Chat Panel */}
            <Card className="h-96">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Chat
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  234 active viewers
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Chat Messages */}
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div key={index} className="flex gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {message.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{message.user}</span>
                          {message.role !== 'student' && (
                            <Badge className={`text-xs px-1 py-0 ${getRoleColor(message.role)}`}>
                              {message.role.replace('_', ' ')}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
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

            {/* Stream Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stream Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Watching</span>
                  <span className="font-medium">8,912</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hours Streamed</span>
                  <span className="font-medium">127.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Views This Month</span>
                  <span className="font-medium">12,834</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
