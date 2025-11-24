"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Home, Zap, Target, TrendingUp, TrendingDown } from "lucide-react";

const lessonData = {
  level: 3,
  title: "Level 3: The Sniper - Gate 1",
  subtitle: "ICT Power of 3 (P3) Model",
  description: "Master precision trade entry using ICT's proprietary Power of 3 model - the foundation of institutional trading setups.",
  xpReward: 150,
  estimatedTime: "20 minutes",
  objectives: [
    "Identify Bullish Power of 3 setups",
    "Recognize displacement & retracement phases",
    "Apply optimal entry timing"
  ],
  keyConcepts: {
    title: "Power of 3 (P3) Framework",
    sections: [
      {
        title: "Phase 1: Displacement",
        description: "Strong directional move that displaces price from recent ranges, creating imbalance.",
        image: "/images/p3-displacement.svg",
        bulletPoints: [
          "Sudden, aggressive price movement",
          "Breaks previous resistance/support levels",
          "Creates liquidity void (FVGs)",
          "Sets up institutional positioning"
        ]
      },
      {
        title: "Phase 2: Retracement",
        description: "Price reacts back to test displaced levels, offering entry opportunities.",
        image: "/images/p3-retracement.svg",
        bulletPoints: [
          "Price returns toward point of origin",
          "Creates optimal trade entry (OTE)",
          "Tests previous levels as support/resistance",
          "Institutional accumulation/distribution zone"
        ]
      },
      {
        title: "Phase 3: Continuation",
        description: "Price resumes original directional momentum, validating the setup.",
        image: "/images/p3-continuation.svg",
        bulletPoints: [
          "Breaks retracement resistance/support",
          "Resumes displacement direction",
          "Confirms institutional thesis",
          "Provides multiple profit targets"
        ]
      }
    ]
  },
  assessment: {
    title: "P3 Mastery Assessment",
    explanation: `The Power of 3 model identifies institutional market structure where price moves in three distinct phases:
    - **Displacement**: Strong directional move breaking structure
    - **Retracement**: Price returns to test, creating entry opportunity
    - **Continuation**: Price resumes direction, validating entries`,
    questions: [
      {
        id: 1,
        question: "In a Bullish Power of 3 setup, the displacement phase should:",
        options: [
          "Move price strongly downward",
          "Move price strongly upward",
          "Create no clear direction",
          "Stay within previous ranges"
        ],
        correctAnswer: 1,
        explanation: "Bullish P3 displacement is characterized by a strong upward directional move that breaks higher-level resistance."
      },
      {
        id: 2,
        question: "The Optimal Trade Entry (OTE) in a P3 setup typically occurs during:",
        options: [
          "The displacement phase",
          "The retracement phase",
          "The continuation phase",
          "Before displacement begins"
        ],
        correctAnswer: 1,
        explanation: "The retracement phase offers the best risk-reward entries as price returns to displaced levels where institutions positioned."
      },
      {
        id: 3,
        question: "A P3 setup is fully validated when:",
        options: [
          "Displacement ends",
          "Retracement completes",
          "Price resumes directional momentum",
          "FVG appears"
        ],
        correctAnswer: 2,
        explanation: "Phase 3 (continuation) validates the entire P3 thesis by breaking retracement levels and resuming the original displacement direction."
      },
      {
        id: 4,
        question: "Which market condition is LEAST favorable for P3 entries?",
        options: [
          "Strong displacement move",
          "Clear retracement structure",
          "High-volume rejection",
          "News-driven volatility"
        ],
        correctAnswer: 3,
        explanation: "News-driven volatility creates chaotic conditions where P3 setups lose reliability due to unpredictable market behavior."
      }
    ]
  }
};

export default function LessonLevel3Page() {
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
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/app/learning/gamified">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Back to Gauntlet
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{lessonData.xpReward} XP Reward</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Level {lessonData.level} - Sniper</Badge>
            <span className="text-sm text-muted-foreground">{lessonData.estimatedTime}</span>
          </div>
          <Progress
            value={
              currentStep === 'intro' ? 0 :
              currentStep === 'concept' ? 40 :
              currentStep === 'assessment' ? (showResults ? 100 : 70) :
              100
            }
            className="h-2"
          />
        </div>
      </div>

      {/* Main Content */}
      {currentStep === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{lessonData.title}</CardTitle>
            <p className="text-muted-foreground">{lessonData.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{lessonData.description}</p>

            <div className="space-y-3">
              <h4 className="font-semibold">By the end of this lesson, you will be able to:</h4>
              <ul className="space-y-2">
                {lessonData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Pro Tip</h4>
              <p className="text-blue-700 text-sm">
                Institute vs Retail: P3 setups represent how large institutions position for directional moves.
                Retail traders often enter too early in Phase 1 or too late in Phase 3. Master Phases 2 entries!
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={() => setCurrentStep('concept')} size="lg" className="w-full">
                Begin P3 Mastery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'concept' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{lessonData.keyConcepts.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {lessonData.keyConcepts.sections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold
                      ${section.title.includes('Displacement') ? 'bg-red-500 text-white' :
                        section.title.includes('Retracement') ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'}`}
                    >
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold">{section.title}</h3>
                  </div>

                  <p className="text-muted-foreground">{section.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Key Characteristics:</h4>
                      <ul className="space-y-1">
                        {section.bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">{section.title} Chart</span>
                    </div>
                  </div>

                  {index < lessonData.keyConcepts.sections.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Bullish P3 Setup</h4>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Displacement: Strong bullish break</li>
                  <li>• Retracement: Return to support</li>
                  <li>• Continuation: Break to new highs</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Bearish P3 Setup</h4>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Displacement: Strong bearish break</li>
                  <li>• Retracement: Return to resistance</li>
                  <li>• Continuation: Break to new lows</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep('intro')} className="flex-1">
              Review Concepts
            </Button>
            <Button onClick={() => setCurrentStep('assessment')} size="lg" className="flex-1">
              Take P3 Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 'assessment' && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{lessonData.assessment.title}</CardTitle>
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {lessonData.assessment.questions.length}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{lessonData.assessment.explanation}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(index)}
                      className="w-full justify-start text-left h-auto p-4 whitespace-normal"
                    >
                      <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {selectedAnswers[currentQuestionIndex] !== undefined && (
                  selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                    <span className="text-green-600">✓ Correct! Perfect application of P3 philosophy.</span>
                  ) : (
                    <span className="text-red-600">✗ Review the P3 framework and try again.</span>
                  )
                )}
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                size="lg"
              >
                {currentQuestionIndex === lessonData.assessment.questions.length - 1 ? 'Complete Mastery' : 'Next Scenario'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {score === lessonData.assessment.questions.length ? '🎯 P3 Mastery Achieved!' : '📚 Time to Hone Your Skills'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {Math.round((score / lessonData.assessment.questions.length) * 100)}%
              </div>
              <p className="text-muted-foreground">
                {score} out of {lessonData.assessment.questions.length} sniper scenarios mastered
              </p>
            </div>

            <div className="space-y-4">
              {lessonData.assessment.questions.map((question, index) => (
                <Card key={question.id} className={
                  selectedAnswers[index] === question.correctAnswer
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-red-200 bg-red-50/50'
                }>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{question.question}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{question.explanation}</p>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={selectedAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                              {question.options[selectedAnswers[index] || 0]}
                            </span>
                          </div>
                          {selectedAnswers[index] !== question.correctAnswer && (
                            <div>
                              <span className="text-muted-foreground">Correct: </span>
                              <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {score === lessonData.assessment.questions.length ? (
                <div className="w-full space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-purple-800 mb-1">P3 Sniper Achieved! 🎯</h3>
                    <p className="text-purple-700 mb-2">
                      You're now equipped to identify institutional Power of 3 setups like a professional trader.
                      The sniper precision comes from understanding the institutional thesis behind each move.
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold">+{lessonData.xpReward} XP</span>
                    </div>
                  </div>
                  <Link href="/app/learning/gamified" className="w-full">
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
                      Continue to Level 4: The Strategist
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-blue-800 mb-1">Refine Your Sniper Vision 📊</h3>
                    <p className="text-blue-700">
                      P3 mastery comes with practice. Review the displacement, retracement, and continuation phases.
                      Every professional trader started where you are now - persistent analysis leads to sniper accuracy.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleRetry} className="w-full">
                      Master P3 Again
                    </Button>
                    <Link href="/app/learning/gamified" className="w-full">
                      <Button size="lg" className="w-full">
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
  );
}
