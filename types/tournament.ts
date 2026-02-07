export type GameMode = 'tournament' | 'cashgame';

export interface BlindLevel {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // em segundos
}

export interface CashGameConfig {
  smallBlind: number; // em centavos (ex: 25 = R$ 0,25)
  bigBlind: number; // em centavos (ex: 50 = R$ 0,50)
  minBuyIn: number; // em reais (ex: 20 = R$ 20,00)
  maxBuyIn: number; // em reais (ex: 30 = R$ 30,00)
}

export interface TournamentState {
  gameMode: GameMode;
  currentLevel: number;
  timeRemaining: number; // em segundos
  isRunning: boolean;
  isPaused: boolean;
  structure: BlindLevel[];
  startTime: number | null;
  anteEnabled: boolean; // Controla se ante está ativo
  cashGameConfig: CashGameConfig | null; // Configuração do cash game
  tournamentId: string | null; // ID do torneio atual no histórico
  tournamentName: string; // Nome do torneio
}

export interface TournamentStore extends TournamentState {
  // Actions
  setGameMode: (mode: GameMode) => void;
  setCashGameConfig: (config: CashGameConfig) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  nextLevel: () => void;
  previousLevel: () => void;
  addTime: (seconds: number) => void;
  setStructure: (structure: BlindLevel[]) => void;
  setTournamentName: (name: string) => void;
  toggleAnte: () => void; // Nova action para ativar/desativar ante
  tick: () => void;
}