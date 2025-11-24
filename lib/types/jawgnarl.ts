export interface TradingStats {
  pnl: number;
  winRate: number;
  largestDrawdown: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  mostTradedInstrument: string;
  sessionStartTime: string;
  sessionEndTime: string;
}

export interface MarketData {
  headlines: string[];
  marketCharacter: string;
  volatility: 'low' | 'medium' | 'high';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sectorPerformance: {
    name: string;
    change: number;
  }[];
}

export interface MoodScale {
  value: number; // 0-100
  label: 'Frustrated' | 'Annoyed' | 'Neutral' | 'Optimistic' | 'Euphoric';
  emoji: string;
}

export interface JournalReflection {
  definingMoment: string;
  bestTrade: {
    id: string;
    pnl: number;
    instrument: string;
    setup: string;
    execution: string;
  };
  toughestTrade: {
    id: string;
    pnl: number;
    instrument: string;
    setup: string;
    execution: string;
  };
  planFollowed: boolean;
  riskManaged: boolean;
  learnedSomething: boolean;
}

export interface TradeDriver {
  label: string;
  value: 'great_setup' | 'patience' | 'luck' | 'revenge' | 'fomo';
}

export interface ExecutionQuality {
  label: string;
  value: 'flawless' | 'rushed' | 'hesitant' | 'panicked';
}

export interface AIInsights {
  pattern: string;
  emotionalInsight: string;
  growthOpportunity: string;
  quote: {
    text: string;
    author: string;
  };
  nextSessionGoals: string[];
}

export interface JawGnarlEntry {
  id: string;
  date: string;
  stage: 1 | 2 | 3;
  tradingStats: TradingStats;
  marketData: MarketData;
  mood: MoodScale;
  reflection?: JournalReflection;
  insights?: AIInsights;
  finalIntention: string;
  completed: boolean;
}

export interface StageProps {
  data: Partial<JawGnarlEntry>;
  onUpdate: (data: Partial<JawGnarlEntry>) => void;
  onComplete: () => void;
}
