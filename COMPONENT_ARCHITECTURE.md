# Component Architecture: Trader Development Platform

## Overview
This document outlines the component architecture for a trader development platform built with React, Next.js, and shadcn/ui. The architecture focuses on psychology-driven trader development, mentorship, and journaling - excluding ALL market data, charts, and trading execution features.

## Core Component Categories

### 1. Journaling Components
These form the foundation of the user experience.

#### JournalEntry
```tsx
// Main journaling interface
interface JournalEntry {
  entryDate: Date;
  emotionalState: EmotionalState;
  biasChecklist: BiasChecklist;
  trades: TradeEntry[];
  sessionRating: 1-10;
  disciplineScore: 1-10;
  lessonsLearned: string;
}

@Component
class JournalEntryForm extends React.Component {
  // Emotional state selector
  // Bias checklist with checkboxes
  // Trade entries as sub-form
  // Session ratings
  // Auto-save functionality
}
```

#### TradeEntrySubform
```tsx
interface TradeEntry {
  setupType: string; // From user's playbook
  confidenceLevel: 1-10;
  emotionalState: EmotionalState;
  biasPresent: Bias[];
  riskAmount: number;
  rewardAmount: number;
  result: 'win' | 'loss' | 'breakeven';
  lessonsFromTrade: string;
  mistakeCategory: MistakeCategory[];
}

@Component
class TradeEntryForm {
  // Setup type dropdown from playbook
  // Confidence slider
  // Emotional state selector
  // Bias multi-select
  // Risk/reward inputs
  // Result selector with automated calcs
}
```

#### EmotionalIntelligenceWidgets
```tsx
// Emotional state tracking components
@Widget
class EmotionalStateTracker {
  // Visual mood selector with colors
  // Historical emotional patterns chart
  // Emotional triggers log
}

@Widget
class BiasRecognitionTrainer {
  // Interactive bias identification quiz
  // Historical bias pattern overview
  // Bias mitigation reminders
}
```

### 2. Psychology Analytics Dashboard
Performance analytics focused on the mental game.

#### PsychologyDashboard
```tsx
// Main analytics interface
interface AnalyticsView {
  period: '7d' | '30d' | '90d' | '1y';
  userId: string;
  metrics: PsychologyMetrics;
}

@Component
class PsychologyAnalyticsDashboard {
  // Win rate by emotional state
  // Discipline score trends
  // Bias frequency over time
  // Confidence level correlations
  // Performance consistency heatmap
}
```

#### PerformanceMetrics
```tsx
interface PsychologyMetrics {
  psychologicalWinRate: number; // Wins with good emotion management
  disciplineScoreAverage: number;
  consistencyScore: number;
  commonBiases: string[];
  emotionalStabilityIndex: number;
}

@Component
class MetricsCards extends React.Component {
  // Color-coded metric cards
  // Trend indicators (up/down arrows)
  // Period-over-period comparisons
}
```

### 3. Playbook Management System
Rule-based trading framework builder.

#### PlaybookBuilder
```tsx
interface Playbook {
  name: string;
  psychologicalConditions: string[];
  setupDefinitions: Record<string, SetupDefinition>;
  entryRules: string[];
  exitRules: string[];
  riskManagementRules: string[];
  psychologicalRules: string[];
  invalidationCriteria: string[];
}

@Component
class PlaybookEditor {
  // Visual flow builder for rules
  // Conditional logic UI
  // Rule validation
  // Version control interface
  // Mentor collaboration features
}
```

#### PlaybookTemplates
```tsx
// Pre-built playbook starters
@Component
class PlaybookTemplateLibrary {
  // Categorize by experience level
  // One-click import functionality
  // Mentor-recommended templates
  // Community-shared playbooks
}
```

### 4. Mentorship Portal
Direct connection between mentors and students.

#### MentorDashboard
```tsx
interface MentorView {
  activeStudents: Student[];
  upcomingSessions: Session[];
  engagementMetrics: EngagementStats;
}

@Component
class MentorPortal {
  // Student list with progress previews
  // Session scheduler with availability
  // Student progress dashboards
  // Educational content library
}
```

#### MentoringSessionInterface
```tsx
interface MentoringSession {
  studentId: string;
  sessionType: SessionType;
  topics: string[];
  actionItems: ActionItem[];
  followUpDate: Date;
}

@Component
class SessionInterface {
  // Real-time chat with typing indicators
  // Session notes collaborative editing
  // Goal tracking tools
  // Resource sharing
  // Session recording (text-based)
}
```

#### StudentMentorPortal
```tsx
@Component
class StudentMentorView {
  // Assigned mentor profile
  // Upcoming session calendar
  // Previous session summaries
  // Action items checklist
  // Direct messaging
}
```

### 5. Routines & Discipline System
Habit building and discipline tracking.

#### RoutineManager
```tsx
interface Routine {
  name: string;
  type: 'pre_session' | 'post_session' | 'daily' | 'weekly';
  steps: RoutineStep[];
  durationMinutes: number;
  successRateTarget: number;
}

@Component
class RoutineBuilder {
  // Drag-and-drop step ordering
  // Step completion timers
  // Success rate tracking
  // Reminder notifications
}
```

#### DisciplineTracker
```tsx
interface DisciplineMetrics {
  completionRate: number;
  streakLength: number;
  timingConsistency: number;
  qualityRatings: number[];
}

@Component
class DisciplineDashboard {
  // Streak counters with animations
  // Completion heatmaps
  // Timing trend analysis
  // Quality rating history
}
```

### 6. Educational Alerts System
Mentor-led educational notifications (NOT trading signals).

#### EducationalAlerts
```tsx
interface EducationalAlert {
  title: string;
  content: string;
  psychologicalFocus: string;
  learningObjectives: string[];
  targetAudience: 'beginners' | 'intermediates' | 'advanced';
}

@Component
class AlertManagement {
  // Alert composer with rich text
  // Audience targeting
  // Scheduling system
  // Engagement tracking
}
```

#### StudentAlertFeed
```tsx
@Component
class EducationalFeed {
  // Personalized alert feed
  // Read/unread status tracking
  // Bookmarking system
  // Follow-up action logging
}
```

### 7. Goal Setting & Progress Tracking
90-day development plans and milestones.

#### GoalLadderSystem
```tsx
interface Goal {
  title: string;
  category: 'psychological' | 'discipline' | 'performance' | 'knowledge';
  targetValue: any;
  currentValue: any;
  targetDate: Date;
  milestones: Milestone[];
}

@Component
class GoalManager {
  // Hierarchical goal structure (90-day plan)
  // Progress visualization
  // Milestone celebrations
  // Goal evolution tracking
}
```

## Component Design Principles

### Psychology-First Design
```tsx
// All components should support emotional intelligence
interface PsychologyAwareComponent {
  showEmotionalContext: boolean;
  enableBiasTracking: boolean;
  trackConfidenceLevels: boolean;
  supportSelfReflection: boolean;
}
```

### Mentorship Integration
```tsx
// Components that integrate with mentoring
interface MentorIntegrable {
  allowMentorVisibility: boolean;
  supportCollaborativeEditing: boolean;
  trackMentorEngagement: boolean;
}
```

### Progressive Disclosure
```tsx
// Show complex features gradually
interface ProgressiveComponent {
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
  showAdvancedFeatures: boolean;
  unlockCriteria: UnlockRule[];
}
```

## Data Flow Architecture

### State Management
```tsx
// Global state slices
interface GlobalStore {
  user: UserProfile & PsychologyProfile;
  journals: JournalState;
  playbooks: PlaybookState;
  mentoring: MentoringState;
  analytics: AnalyticsState;
}

// Local state management within components
interface ComponentStore {
  formData: any;
  validationErrors: ValidationErrors;
  loadingStates: LoadingStates;
  uiPreferences: UIModel;
}
```

### API Integration
```tsx
// Supabase-focused API layer
interface JournalAPI {
  createEntry: (entry: JournalEntry) => Promise<JournalEntry>;
  getEntries: (filters: JournalFilters) => Promise<JournalEntry[]>;
  updateEmotionalState: (entryId: string, state: EmotionalState) => Promise<void>;
}

interface AnalyticsAPI {
  getPsychologyMetrics: (period: Period) => Promise<PsychologyMetrics>;
  getTrendAnalysis: (metricType: string, period: Period) => Promise<TrendData[]>;
}
```

## Component Reuse Strategy

### Shared UI Components
```tsx
// Emotion-themed components
@Reusable
export function EmotionSelector({ emotions, onSelect, showHistory }) { ... }

@Reusable
export function ConfidenceSlider({ value, onChange, context }) { ... }

@Reusable
export function BiasChecklist({ biases, checkedItems, onChange }) { ... }
```

### Layout Components
```tsx
// Psychology-focused layout patterns
@Layout
export function JournalLayout({ header, sidebar, main, footer }) { ... }

@Layout
export function MentoringInterface({ mentorPanel, studentPanel, sharedTools }) { ... }
```

## Mobile Responsiveness

### Adaptive Components
```tsx
// Mobile-optimized versions
interface ResponsiveJournal {
  mobileView: CompactJournalView;
  tabletView: StandardJournalView;
  desktopView: FullFeatureJournalView;
}

// Touch-friendly interactions for mobile
@MobileOptimized
export function TouchOptimizedSelector({ options, onSelect }) { ... }
```

## Testing Strategy

### Component Testing Priorities
```tsx
// Focus on psychology workflow accuracy
@PsychologyFlowTest
export function EmotionTrackingWorkflow() { ... }

@MentorshipInteractionTest
export function MentorStudentCollaboration() { ... }

@JournalingQualityTest
export function EmotionalReflectionAccuracy() { ... }
```

## Implementation Roadmap

### Phase 1: Core Journaling (Week 1-2)
- JournalEntryForm
- EmotionalStateTracker
- TradeEntryForm
- BasicAnalyticsDashboard

### Phase 2: Psychology Engine (Week 3-4)
- AdvancedAnalyticsDashboard
- BiasRecognitionTrainer
- ConfidenceLevelTrackers
- Emotions-Metrics Correlations

### Phase 3: Mentorship System (Week 5-6)
- MentorPortal
- MentoringSessionInterface
- EducationalAlerts
- SharedGoalTracking

### Phase 4: Advanced Features (Week 7-8)
- PlaybookBuilder
- RoutineManager
- GoalLadderSystem
- AdvancedAnalytics

This architecture ensures the platform serves its true purpose: trader development through psychology, discipline, and mentorship - never crossing into forbidden market data or trading execution territory.
