import { PricingTier, PricingFeature } from "@/components/pricing-plans";

// Pricing features that are used in both cards and table
const coreFeatures: PricingFeature[] = [
  { text: "Unlimited journaling with AI insights", included: true },
  { text: "Psychology Engine 2.0 (bias tracking)", included: true },
  { text: "Deep performance analytics", included: true },
  { text: "Custom routines builder", included: true },
  { text: "Goal ladder framework", included: true },
  { text: "Educational psychology library", included: true },
];

const acceleratedFeatures: PricingFeature[] = [
  { text: "Everything in Core +", included: true },
  { text: "Dedicated mentor assignment", included: true },
  { text: "Weekly mentor coaching calls", included: true },
  { text: "Mentor-reviewed journal entries", included: true },
  { text: "Live trade walkthroughs (educational)", included: true },
  { text: "Personal playbook development", included: true },
  { text: "Monthly progress deep-dives", included: true },
  { text: "Educational alerts feed", included: true },
];

const eliteFeatures: PricingFeature[] = [
  { text: "Everything in Accelerated +", included: true },
  { text: "1-on-1 elite mentor (40+ years experience)", included: true },
  { text: "Bi-weekly coaching sessions", included: true },
  { text: "Real-time psychology consultations", included: true },
  { text: "Custom 90-day playbook creation", included: true },
  { text: "Dedicated discord channel", included: true },
  { text: "Priority educational alerts", included: true },
  { text: "Unlimited mentor messaging", included: true },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "core",
    name: "Core Membership",
    description: "Self-directed trader development",
    price: 10,
    billing: "/month",
    commitment: "Cancel anytime",
    icon: "📚",
    iconBg: "bg-muted",
    features: coreFeatures,
    buttonText: "Start Core Journey",
    buttonVariant: "default",
  },
  {
    id: "accelerated",
    name: "Accelerated Program",
    description: "Mentor-guided development",
    price: 100,
    billing: "/month",
    commitment: "3-month commitment",
    badge: "Most Popular",
    badgeVariant: "default",
    icon: "👥",
    iconBg: "bg-muted",
    features: acceleratedFeatures,
    buttonText: "Start Accelerated Growth",
    buttonVariant: "default",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite Mastery",
    description: "Intensive elite trader development",
    price: 300,
    billing: "/month",
    commitment: "6-month transformation",
    icon: "🏆",
    iconBg: "bg-muted",
    features: eliteFeatures,
    buttonText: "Apply for Elite Program",
    buttonVariant: "outline",
  },
];

export const tableFeatures = [
  "Journaling & Analytics",
  "Psychology Engine",
  "Custom Routines",
  "Educational Content",
  "Mentor Assignment",
  "Weekly Coaching Calls",
  "Live Trade Walkthroughs",
  "1-on-1 Elite Mentors",
];

export const tableData = {
  "Journaling & Analytics": [true, true, true],
  "Psychology Engine": [true, true, true],
  "Custom Routines": [true, true, true],
  "Educational Content": [true, true, true],
  "Mentor Assignment": [false, true, true],
  "Weekly Coaching Calls": [false, true, true],
  "Live Trade Walkthroughs": [false, true, "Priority"],
  "1-on-1 Elite Mentors": [false, false, true],
} as { [key: string]: (boolean | string)[] };

export const psychologyGuarantees = [
  {
    title: "30-Day",
    subtitle: "Money Back Guarantee",
    description: "No market risk required",
  },
  {
    title: "90-Day",
    subtitle: "Transformation Commitment",
    description: "Focus on your mental game",
  },
  {
    title: "Lifetime",
    subtitle: "Access to Psychology Tools",
    description: "Built for long-term growth",
  },
];
