import { create } from 'zustand';
import { TournamentStore, BlindLevel } from '@/types/tournament';
import { saveCurrentTournament, getCurrentTournament } from '@/lib/storage';

// Estrutura de blinds padrão
const defaultStructure: BlindLevel[] = [
  { level: 1, smallBlind: 100, bigBlind: 200, ante: 200, duration: 1800 },
  { level: 2, smallBlind: 100, bigBlind: 300, ante: 300, duration: 1800 },
  { level: 3, smallBlind: 200, bigBlind: 400, ante: 400, duration: 1800 },
  { level: 4, smallBlind: 300, bigBlind: 600, ante: 600, duration: 1800 },
  { level: 5, smallBlind: 400, bigBlind: 800, ante: 800, duration: 1800 },
  { level: 6, smallBlind: 500, bigBlind: 1000, ante: 1000, duration: 1800 },
  { level: 7, smallBlind: 600, bigBlind: 1200, ante: 1200, duration: 1800 },
  { level: 8, smallBlind: 800, bigBlind: 1600, ante: 1600, duration: 1800 },
  { level: 9, smallBlind: 1000, bigBlind: 2000, ante: 2000, duration: 1800 },
  { level: 10, smallBlind: 1500, bigBlind: 3000, ante: 3000, duration: 1800 },
  { level: 11, smallBlind: 2000, bigBlind: 4000, ante: 4000, duration: 1800 },
  { level: 12, smallBlind: 3000, bigBlind: 6000, ante: 6000, duration: 1800 },
  { level: 13, smallBlind: 4000, bigBlind: 8000, ante: 8000, duration: 1800 },
  { level: 14, smallBlind: 5000, bigBlind: 10000, ante: 10000, duration: 1800 },
  { level: 15, smallBlind: 6000, bigBlind: 12000, ante: 12000, duration: 1800 },
  { level: 16, smallBlind: 8000, bigBlind: 16000, ante: 16000, duration: 1800 },
  { level: 17, smallBlind: 10000, bigBlind: 20000, ante: 20000, duration: 1800 },
  { level: 18, smallBlind: 15000, bigBlind: 30000, ante: 30000, duration: 1800 },
  { level: 19, smallBlind: 20000, bigBlind: 40000, ante: 40000, duration: 1800 },
  { level: 20, smallBlind: 25000, bigBlind: 50000, ante: 50000, duration: 1800 },
];

// Tenta carregar estado salvo
const loadInitialState = () => {
  if (typeof window === 'undefined') return null;
  
  const saved = getCurrentTournament();
  if (saved) {
    return {
      gameMode: saved.gameMode,
      currentLevel: saved.currentLevel,
      timeRemaining: saved.timeRemaining,
      isRunning: false, // Sempre começa pausado ao recarregar
      isPaused: true,
      structure: saved.structure,
      anteEnabled: saved.anteEnabled,
      startTime: saved.startTime,
      cashGameConfig: saved.cashGameConfig || null,
      name: saved.tournamentName || 'Torneio Atual',
    };
  }
  
  return null;
};

const initialState = loadInitialState();

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  // State inicial (tenta carregar do localStorage)
  gameMode: initialState?.gameMode || 'tournament',
  currentLevel: initialState?.currentLevel || 0,
  timeRemaining: initialState?.timeRemaining || defaultStructure[0].duration,
  isRunning: initialState?.isRunning || false,
  isPaused: initialState?.isPaused || false,
  structure: initialState?.structure || defaultStructure,
  anteEnabled: initialState?.anteEnabled || false,
  startTime: initialState?.startTime || null,
  cashGameConfig: initialState?.cashGameConfig || null,
  tournamentId: initialState?.tournamentId || Math.random().toString(36).substr(2, 9),
  tournamentName: initialState?.name || 'Torneio Atual',

  // Actions
  setGameMode: (mode) => {
    set({ gameMode: mode });
    persistState(get());
  },

  setTournamentName: (name) => {
    set({ tournamentName: name });
    persistState(get());
  },
  
  setCashGameConfig: (config) => {
    set({ 
      cashGameConfig: config,
      timeRemaining: 7200,
      currentLevel: 0,
      isRunning: false,
      isPaused: false,
    });
    persistState(get());
  },

  startTimer: () => {
    const state = get();
    if (!state.isRunning) {
      set({
        isRunning: true,
        isPaused: false,
        startTime: Date.now(),
      });
      persistState(get());
    }
  },

  pauseTimer: () => {
    set({ isPaused: true });
    persistState(get());
  },

  resumeTimer: () => {
    set({ isPaused: false });
    persistState(get());
  },

  resetTimer: () => {
    const state = get();
    const initialTime = state.gameMode === 'cashgame' ? 7200 : state.structure[0].duration;
    set({
      currentLevel: 0,
      timeRemaining: initialTime,
      isRunning: false,
      isPaused: false,
      startTime: null,
    });
    persistState(get());
  },

  nextLevel: () => {
    const state = get();
    const nextLevel = Math.min(state.currentLevel + 1, state.structure.length - 1);
    
    set({
      currentLevel: nextLevel,
      timeRemaining: state.structure[nextLevel].duration,
    });
    persistState(get());
  },

  previousLevel: () => {
    const state = get();
    const prevLevel = Math.max(state.currentLevel - 1, 0);
    
    set({
      currentLevel: prevLevel,
      timeRemaining: state.structure[prevLevel].duration,
    });
    persistState(get());
  },

  addTime: (seconds: number) => {
    const state = get();
    set({
      timeRemaining: Math.max(0, state.timeRemaining + seconds),
    });
    persistState(get());
  },

  setStructure: (structure: BlindLevel[]) => {
    set({
      structure,
      currentLevel: 0,
      timeRemaining: structure[0].duration,
      isRunning: false,
      isPaused: false,
    });
    persistState(get());
  },

  toggleAnte: () => {
    const state = get();
    set({ anteEnabled: !state.anteEnabled });
    persistState(get());
  },

  tick: () => {
    const state = get();
    
    if (!state.isRunning || state.isPaused) return;

    const newTime = state.timeRemaining - 1;

    if (newTime <= 0) {
      const nextLevel = state.currentLevel + 1;
      
      if (nextLevel < state.structure?.length) {
        set({
          currentLevel: nextLevel,
          timeRemaining: state.structure[nextLevel].duration,
        });
      } else {
        set({
          timeRemaining: 0,
          isRunning: false,
        });
      }
    } else {
      set({ timeRemaining: newTime });
    }
    
    // Persiste a cada 5 segundos
    if (newTime % 5 === 0) {
      persistState(get());
    }
  },
}));

// Função helper para persistir o estado
function persistState(state: TournamentStore) {
  if (typeof window === 'undefined') return;
  
  saveCurrentTournament({
    gameMode: state.gameMode,
    currentLevel: state.currentLevel,
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    structure: state.structure,
    anteEnabled: state.anteEnabled,
    startTime: state.startTime,
    tournamentName: state.tournamentName || 'Torneio Atual',
    cashGameConfig: state.cashGameConfig,
  });
}