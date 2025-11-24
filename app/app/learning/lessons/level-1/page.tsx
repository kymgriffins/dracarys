"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Home, Zap } from "lucide-react";

const lessonData = {
  level: 1,
  title: "Level 1: The Foundation",
  subtitle: "Market Maker Series Primer",
  description: "Understanding the basic movements that occur within markets, and what causes them.",
  xpReward: 75,
  estimatedTime: "15 minutes",
  objectives: [
    "Identify bullish and bearish market movements",
    "Understand fair value gaps",
    "Recognize order blocks on charts"
  ],
  concept: {
    title: "Market Structure Basics",
    content: `The market operates through continuous auctions where buyers and sellers interact. Price moves in response to order flow - when more buyers than sellers push price up, when more sellers than buyers push price down.\n\nProfessional traders understand that markets have natural rhythms and predictable behaviors. The key is learning to read these patterns before they complete.`,
    slides: [
      {
        title: "The Auction Process",
        image: "/images/market-structure.svg",
        explanation: "Every price movement represents a battle between buyers and sellers. The goal is to join the winning side of the auction."
      },
      {
        title: "Order Flow Fundamentals",
        image: "/images/order-flow.svg",
        explanation: "Buy orders vs Sell orders create imbalance. Understanding this imbalance is key to predicting price direction."
      }
    ]
  },
  assessment: {
    title: "Foundation Assessment",
    questions: [
      {
        id: 1,
        question: "What happens when there are significantly more buyers than sellers in the market?",
        options: [
          "Price moves higher",
          "Price moves lower",
          "Price stays the same",
          "Market closes"
        ],
        correctAnswer: 0,
        explanation: "When buyers have more aggressive orders, they win the auction and push prices higher. This creates upward momentum."
      },
      {
        id: 2,
        question: "Fair Value Gaps occur when:",
        options: [
          "Price moves too quickly in one direction",
          "Market makers take a break",
          "Imbalances appear between candlesticks",
          "Trading hours end"
        ],
        correctAnswer: 2,
        explanation: "FVG represent areas where price moves too fast and too far from the previous price action, creating gaps that professional traders use as references."
      },
      {
        id: 3,
        question: "An Order Block is:",
        options: [
          "A limit order waiting to be filled",
          "An area where large institutions accumulated positions",
          "A place to buy and sell orders",
          "Where orders get blocked by the exchange"
        ],
        correctAnswer: 1,
        explanation: "Order Blocks are fair value areas where large market participants accumulated or distributed positions. These areas often become key reference points for future price action."
      }
    ]
  }
};

export default function LessonLevel1Page() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'concept' | 'assessment' | 'complete'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < lessonData.assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const correctCount = selectedAnswers.filter((answer, index) =>
        answer === lessonData.assessment.questions[index].correctAnswer
      ).length;
      setScore(correctCount);
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const currentQuestion = lessonData.assessment.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/app/learning/gamified">
              <Button variant="outline" size="sm" className="hover:bg-slate-100 shadow-sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Gauntlet
              </Button>
            </Link>
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-lg">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">{lessonData.xpReward} XP</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    Level {lessonData.level} - Foundation
                  </Badge>
                  <p className="text-xs text-slate-600 mt-1">Beginner Friendly</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-2xl">⏰</span>
                <span className="text-sm font-medium">{lessonData.estimatedTime}</span>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Lesson Progress</span>
                <span className="text-sm text-slate-500">
                  {currentStep === 'intro' ? '0' :
                   currentStep === 'concept' ? '50' :
                   currentStep === 'assessment' ? (showResults ? '100' : '75') :
                   '100'}%
                </span>
              </div>
              <Progress
                value={
                  currentStep === 'intro' ? 0 :
                  currentStep === 'concept' ? 50 :
                  currentStep === 'assessment' ? (showResults ? 100 : 75) :
                  100
                }
                className="h-3 bg-slate-200"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Introduction</span>
                <span>Concept</span>
                <span>Assessment</span>
                <span>Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentStep === 'intro' && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">📚</span>
                </div>
                <div>
                  <CardTitle className="text-3xl text-slate-800 mb-2">{lessonData.title}</CardTitle>
                  <p className="text-slate-600 text-lg">{lessonData.subtitle}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                <p className="text-lg text-slate-700 leading-relaxed">{lessonData.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Learning Objectives
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {lessonData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 font-medium">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <Button
                  onClick={() => setCurrentStep('concept')}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  Begin Your Learning Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'concept' && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-4">{lessonData.concept.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                {lessonData.concept.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-slate-800 leading-relaxed">{paragraph}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessonData.concept.slides.map((slide, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-4 text-slate-800">{slide.title}</h4>
                      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center shadow-inner">
                        <span className="text-slate-500 text-sm font-medium">Interactive Chart</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{slide.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  onClick={() => setCurrentStep('assessment')}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  Take Foundation Assessment
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'assessment' && !showResults && currentQuestion && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-2">{lessonData.assessment.title}</CardTitle>
              <p className="text-slate-600 text-center">Question {currentQuestionIndex + 1} of {lessonData.assessment.questions.length}</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{currentQuestion.question}</h3>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(index)}
                      className="w-full justify-start text-left h-auto p-6 whitespace-normal shadow-sm hover:shadow-md transition-all text-slate-700 hover:bg-slate-50"
                    >
                      <span className="font-bold text-lg mr-4">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-base">{option}</span>
                    </Button>
                  </div>
                ))}
              </div>

              {selectedAnswers[currentQuestionIndex] !== undefined && (
                <div className={`p-4 rounded-lg border ${
                  selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? 'Excellent! You understand this concept.'
                          : 'Not quite right. Here\'s why:'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  {currentQuestionIndex === lessonData.assessment.questions.length - 1 ? 'Complete Foundation Assessment' : 'Next Question'}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-6">
                {score === lessonData.assessment.questions.length ? '🏆 Mastery Achieved!' : '📚 Review Complete'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center space-y-4">
                <div className="text-8xl font-bold mb-4">
                  {Math.round((score / lessonData.assessment.questions.length) * 100)}%
                </div>
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl font-bold">
                    {score}/{lessonData.assessment.questions.length}
                  </span>
                </div>
                <p className="text-slate-600 text-lg">
                  {score === lessonData.assessment.questions.length
                    ? 'Perfect! You\'ve mastered the foundational concepts.'
                    : `${score} questions correct out of ${lessonData.assessment.questions.length}. Keep learning!`}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xl text-slate-800 text-center">Detailed Results</h4>
                {lessonData.assessment.questions.map((question, index) => (
                  <Card key={question.id} className={`shadow-md ${
                    selectedAnswers[index] === question.correctAnswer
                      ? 'border-green-300 bg-green-50/80'
                      : 'border-red-300 bg-red-50/80'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {selectedAnswers[index] === question.correctAnswer ? (
                          <CheckCircle className="w-7 h-7 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-7 h-7 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-800 mb-3">{question.question}</h5>
                          <p className="text-sm text-slate-600 mb-3 font-medium">Explanation: {question.explanation}</p>
                          <div className="space-y-1">
                            <div className="text-xs text-slate-500">Your answer:
                              <span className={`ml-2 font-medium ${
                                selectedAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {question.options[selectedAnswers[index] || 0]}
                              </span>
                            </div>
                            {selectedAnswers[index] !== question.correctAnswer && (
                              <div className="text-xs text-slate-500">Correct answer:
                                <span className="ml-2 font-medium text-green-600">
                                  {question.options[question.correctAnswer]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200">
                {score === lessonData.assessment.questions.length ? (
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-300 rounded-2xl">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                        <span className="text-3xl">🎉</span>
                      </div>
                      <h3 className="text-2xl font-bold text-orange-800 mb-2">Foundation Master!</h3>
                      <p className="text-orange-700 mb-4">You understand market structure fundamentals perfectly</p>
                      <div className="flex items-center justify-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <span className="font-bold text-lg text-slate-800">+{lessonData.xpReward} XP Earned</span>
                      </div>
                    </div>
                    <Link href="/app/learning/gamified" className="block">
                      <Button size="lg" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transform transition-all hover:scale-[1.02]">
                        Advance to Level 2: The Scout
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                        <span className="text-3xl">📚</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800 mb-2">Keep Building Knowledge!</h3>
                      <p className="text-blue-700 mb-4">Review the explanations above and try again for full mastery</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={handleRetry}
                        className="h-14 text-lg font-semibold border-2 hover:bg-slate-50 transform transition-all hover:scale-[1.02]"
                      >
                        Study Again
                      </Button>
                      <Link href="/app/learning/gamified" className="block">
                        <Button size="lg" className="w-full h-14 text-lg font-semibold bg-slate-600 hover:bg-slate-700 shadow-lg transform transition-all hover:scale-[1.02]">
                          Return to Gauntlet
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
