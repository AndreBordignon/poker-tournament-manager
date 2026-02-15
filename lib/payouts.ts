export interface PayoutStructure {
  positions: number;
  percentages: number[];
  name: string;
}

// Estruturas de pagamento comuns
export const PAYOUT_STRUCTURES: Record<string, PayoutStructure> = {
  // Winner Takes All
  winner_all: {
    positions: 1,
    percentages: [100],
    name: 'Winner Takes All',
  },
  
  // Top 2
  top2_70_30: {
    positions: 2,
    percentages: [70, 30],
    name: 'Top 2 (70/30)',
  },
  top2_65_35: {
    positions: 2,
    percentages: [65, 35],
    name: 'Top 2 (65/35)',
  },
  
  // Top 3
  top3_50_30_20: {
    positions: 3,
    percentages: [50, 30, 20],
    name: 'Top 3 (50/30/20)',
  },
  top3_60_25_15: {
    positions: 3,
    percentages: [60, 25, 15],
    name: 'Top 3 (60/25/15)',
  },
  
  // Top 4
  top4_40_30_20_10: {
    positions: 4,
    percentages: [40, 30, 20, 10],
    name: 'Top 4 (40/30/20/10)',
  },
  top4_50_25_15_10: {
    positions: 4,
    percentages: [50, 25, 15, 10],
    name: 'Top 4 (50/25/15/10)',
  },
  
  // Top 5
  top5_40_25_18_12_5: {
    positions: 5,
    percentages: [40, 25, 18, 12, 5],
    name: 'Top 5 (40/25/18/12/5)',
  },
  top5_45_25_15_10_5: {
    positions: 5,
    percentages: [45, 25, 15, 10, 5],
    name: 'Top 5 (45/25/15/10/5)',
  },
  
  // Top 6
  top6_35_23_17_12_8_5: {
    positions: 6,
    percentages: [35, 23, 17, 12, 8, 5],
    name: 'Top 6 (35/23/17/12/8/5)',
  },
  
  // Top 7
  top7_33_21_15_11_9_7_4: {
    positions: 7,
    percentages: [33, 21, 15, 11, 9, 7, 4],
    name: 'Top 7 (33/21/15/11/9/7/4)',
  },
  
  // Top 8
  top8_30_20_14_11_9_7_5_4: {
    positions: 8,
    percentages: [30, 20, 14, 11, 9, 7, 5, 4],
    name: 'Top 8 (30/20/14/11/9/7/5/4)',
  },
  
  // Top 9
  top9_28_18_13_10_9_7_6_5_4: {
    positions: 9,
    percentages: [28, 18, 13, 10, 9, 7, 6, 5, 4],
    name: 'Top 9 (28/18/13/10/9/7/6/5/4)',
  },
  
  // Top 10
  top10_27_17_12_10_8_7_6_5_4_4: {
    positions: 10,
    percentages: [27, 17, 12, 10, 8, 7, 6, 5, 4, 4],
    name: 'Top 10 (27/17/12/10/8/7/6/5/4/4)',
  },
};

export interface Payout {
  position: number;
  percentage: number;
  amount: number;
}

export interface PayoutCalculation {
  prizePool: number;
  rake: number;
  netPrizePool: number;
  payouts: Payout[];
  structure: PayoutStructure;
}

export function calculatePayouts(
  totalPrizePool: number,
  structureKey: string,
  rakePercentage: number = 0
): PayoutCalculation {
  const structure = PAYOUT_STRUCTURES[structureKey];
  
  if (!structure) {
    throw new Error('Invalid payout structure');
  }
  
  // Calcula rake (comissão da casa)
  const rake = totalPrizePool * (rakePercentage / 100);
  const netPrizePool = totalPrizePool - rake;
  
  // Calcula pagamentos
  const payouts: Payout[] = structure.percentages.map((percentage, index) => ({
    position: index + 1,
    percentage,
    amount: Math.floor(netPrizePool * (percentage / 100)),
  }));
  
  return {
    prizePool: totalPrizePool,
    rake,
    netPrizePool,
    payouts,
    structure,
  };
}

// Função para sugerir estrutura baseada no número de jogadores
export function suggestPayoutStructure(totalPlayers: number): string {
  if (totalPlayers <= 5) return 'winner_all';
  if (totalPlayers <= 8) return 'top2_70_30';
  if (totalPlayers <= 12) return 'top3_50_30_20';
  if (totalPlayers <= 16) return 'top4_40_30_20_10';
  if (totalPlayers <= 20) return 'top5_40_25_18_12_5';
  if (totalPlayers <= 25) return 'top6_35_23_17_12_8_5';
  if (totalPlayers <= 30) return 'top7_33_21_15_11_9_7_4';
  if (totalPlayers <= 35) return 'top8_30_20_14_11_9_7_5_4';
  if (totalPlayers <= 40) return 'top9_28_18_13_10_9_7_6_5_4';
  return 'top10_27_17_12_10_8_7_6_5_4_4';
}

// Função para criar estrutura customizada
export function createCustomPayout(percentages: number[]): PayoutStructure {
  const total = percentages.reduce((sum, p) => sum + p, 0);
  
  if (Math.abs(total - 100) > 0.01) {
    throw new Error('Percentages must add up to 100');
  }
  
  return {
    positions: percentages.length,
    percentages,
    name: 'Custom',
  };
}