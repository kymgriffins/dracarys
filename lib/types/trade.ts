// Trade type definitions - Compact version for validation

export interface Trade {
  id: string;
  journal_id: string;
  user_id: string;
  entry_time: Date;
  result: 'win' | 'loss' | 'breakeven';
}

export interface TradeAnalysis {
  total_trades: number;
  win_rate: number;
  psychological_win_rate: number;
}

export const TradeSchema = {
  id: 'string',
  result: ['win', 'loss', 'breakeven']
};
