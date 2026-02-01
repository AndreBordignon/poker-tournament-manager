export interface BlindLevel {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // em segundos
}

export interface TournamentState {
  currentLevel: number;
  timeRemaining: number; // em segundos
  isRunning: boolean;
  isPaused: boolean;
  structure: BlindLevel[];
  startTime: number | null;
  anteEnabled: boolean; // Controla se ante está ativo
}

export interface TournamentStore extends TournamentState {
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  nextLevel: () => void;
  previousLevel: () => void;
  addTime: (seconds: number) => void;
  setStructure: (structure: BlindLevel[]) => void;
  toggleAnte: () => void; // Nova action para ativar/desativar ante
  tick: () => void;
}