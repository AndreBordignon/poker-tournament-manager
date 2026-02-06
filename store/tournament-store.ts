import { create } from 'zustand';
import { TournamentStore, BlindLevel } from '@/types/tournament';

// Estrutura de blinds com fichas reais (100, 500, 1000, 5000, 25000)
// Duração: 30 minutos (1800 segundos)
// Início: 100-200 sem ante nos primeiros 2 níveis
// A partir do nível 3: ante = big blind
const defaultStructure: BlindLevel[] = [
  { level: 1, smallBlind: 100, bigBlind: 200, ante: 200, duration: 1800 },    // 30 min - ante = BB
  { level: 2, smallBlind: 100, bigBlind: 300, ante: 300, duration: 1800 },    // 30 min - ante = BB
  { level: 3, smallBlind: 200, bigBlind: 400, ante: 400, duration: 1800 },    // 30 min - ante = BB
  { level: 4, smallBlind: 300, bigBlind: 600, ante: 600, duration: 1800 },    // 30 min - ante = BB
  { level: 5, smallBlind: 400, bigBlind: 800, ante: 800, duration: 1800 },    // 30 min - ante = BB
  { level: 6, smallBlind: 500, bigBlind: 1000, ante: 1000, duration: 1800 },  // 30 min - ante = BB
  { level: 7, smallBlind: 600, bigBlind: 1200, ante: 1200, duration: 1800 },  // 30 min - ante = BB
  { level: 8, smallBlind: 800, bigBlind: 1600, ante: 1600, duration: 1800 },  // 30 min - ante = BB
  { level: 9, smallBlind: 1000, bigBlind: 2000, ante: 2000, duration: 1800 }, // 30 min - ante = BB
  { level: 10, smallBlind: 1500, bigBlind: 3000, ante: 3000, duration: 1800 }, // 30 min - ante = BB
  { level: 11, smallBlind: 2000, bigBlind: 4000, ante: 4000, duration: 1800 }, // 30 min - ante = BB
  { level: 12, smallBlind: 3000, bigBlind: 6000, ante: 6000, duration: 1800 }, // 30 min - ante = BB
  { level: 13, smallBlind: 4000, bigBlind: 8000, ante: 8000, duration: 1800 }, // 30 min - ante = BB
  { level: 14, smallBlind: 5000, bigBlind: 10000, ante: 10000, duration: 1800 }, // 30 min - ante = BB
  { level: 15, smallBlind: 6000, bigBlind: 12000, ante: 12000, duration: 1800 }, // 30 min - ante = BB
  { level: 16, smallBlind: 8000, bigBlind: 16000, ante: 16000, duration: 1800 }, // 30 min - ante = BB
  { level: 17, smallBlind: 10000, bigBlind: 20000, ante: 20000, duration: 1800 }, // 30 min - ante = BB
  { level: 18, smallBlind: 15000, bigBlind: 30000, ante: 30000, duration: 1800 }, // 30 min - ante = BB
  { level: 19, smallBlind: 20000, bigBlind: 40000, ante: 40000, duration: 1800 }, // 30 min - ante = BB
  { level: 20, smallBlind: 25000, bigBlind: 50000, ante: 50000, duration: 1800 }, // 30 min - ante = BB
];

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  // State inicial
  gameMode: 'tournament',
  currentLevel: 0,
  timeRemaining: defaultStructure[0].duration,
  isRunning: false,
  isPaused: false,
  structure: defaultStructure,
  startTime: null,
  anteEnabled: false, // Ante desabilitado por padrão
  cashGameConfig: null,

  // Actions
  setGameMode: (mode) => {
    set({ gameMode: mode });
  },

  setCashGameConfig: (config) => {
    set({ 
      cashGameConfig: config,
      timeRemaining: 7200, // 2 horas inicial para cash game
      currentLevel: 0,
      isRunning: false,
      isPaused: false,
    });
  },

  startTimer: () => {
    const state = get();
    if (!state.isRunning) {
      set({
        isRunning: true,
        isPaused: false,
        startTime: Date.now(),
      });
    }
  },

  pauseTimer: () => {
    set({ isPaused: true });
  },

  resumeTimer: () => {
    set({ isPaused: false });
  },

  resetTimer: () => {
    const state = get();
    const initialTime = state.gameMode === 'cashgame' ? 7200 : state.structure[0].duration; // 2 horas para cash game
    set({
      currentLevel: 0,
      timeRemaining: initialTime,
      isRunning: false,
      isPaused: false,
      startTime: null,
    });
  },

  nextLevel: () => {
    const state = get();
    const nextLevel = Math.min(state.currentLevel + 1, state.structure.length - 1);
    
    set({
      currentLevel: nextLevel,
      timeRemaining: state.structure[nextLevel].duration,
    });
  },

  previousLevel: () => {
    const state = get();
    const prevLevel = Math.max(state.currentLevel - 1, 0);
    
    set({
      currentLevel: prevLevel,
      timeRemaining: state.structure[prevLevel].duration,
    });
  },

  addTime: (seconds: number) => {
    const state = get();
    set({
      timeRemaining: Math.max(0, state.timeRemaining + seconds),
    });
  },

  setStructure: (structure: BlindLevel[]) => {
    set({
      structure,
      currentLevel: 0,
      timeRemaining: structure[0].duration,
      isRunning: false,
      isPaused: false,
    });
  },

  toggleAnte: () => {
    const state = get();
    set({ anteEnabled: !state.anteEnabled });
  },

  tick: () => {
    const state = get();
    
    if (!state.isRunning || state.isPaused) return;

    const newTime = state.timeRemaining - 1;

    if (newTime <= 0) {
      // Avança para o próximo nível automaticamente
      const nextLevel = state.currentLevel + 1;
      
      if (nextLevel < state.structure.length) {
        set({
          currentLevel: nextLevel,
          timeRemaining: state.structure[nextLevel].duration,
        });
      } else {
        // Torneio finalizado
        set({
          timeRemaining: 0,
          isRunning: false,
        });
      }
    } else {
      set({ timeRemaining: newTime });
    }
  },
}));