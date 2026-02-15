import { create } from 'zustand';
import { Player, TournamentAdmin, TournamentStats } from '@/types/players';
import { calculatePayouts, PayoutCalculation, suggestPayoutStructure } from '@/lib/payouts';

interface AdminStore extends TournamentAdmin {
  // Payout
  selectedPayoutStructure: string;
  rakePercentage: number;
  
  // Actions - Players
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  addBuyIn: (playerId: string) => void;
  addRebuy: (playerId: string) => void;
  addAddon: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  reactivatePlayer: (playerId: string) => void;
  
  // Actions - Config
  setBuyInValue: (value: number) => void;
  setRebuyValue: (value: number) => void;
  setAddonValue: (value: number) => void;
  setStartingStack: (value: number) => void;
  setRebuyStack: (value: number) => void;
  setAddonStack: (value: number) => void;
  
  // Actions - Payout
  setPayoutStructure: (structure: string) => void;
  setRakePercentage: (percentage: number) => void;
  
  // Computed
  getStats: () => TournamentStats;
  getPayouts: () => PayoutCalculation | null;
  resetAdmin: () => void;
}

const DEFAULT_CONFIG = {
  buyInValue: 50,      // R$ 50
  rebuyValue: 50,      // R$ 50
  addonValue: 50,      // R$ 50
  startingStack: 10000, // 10K fichas
  rebuyStack: 10000,    // 10K fichas
  addonStack: 20000,    // 20K fichas (add-on geralmente é o dobro)
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  // State inicial
  players: [],
  selectedPayoutStructure: 'top3_50_30_20', // Estrutura padrão
  rakePercentage: 0, // Sem rake por padrão
  ...DEFAULT_CONFIG,

  // Actions - Players
  addPlayer: (name: string) => {
    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random()}`,
      name,
      buyIns: 1, // Sempre começa com 1 buy-in
      rebuys: 0,
      addons: 0,
      totalInvested: get().buyInValue,
      isEliminated: false,
      eliminatedAt: null,
      position: null,
    };
    
    set((state) => ({
      players: [...state.players, newPlayer],
    }));
  },

  removePlayer: (id: string) => {
    set((state) => ({
      players: state.players.filter(p => p.id !== id),
    }));
  },

  addBuyIn: (playerId: string) => {
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              buyIns: p.buyIns + 1,
              totalInvested: p.totalInvested + state.buyInValue,
            }
          : p
      ),
    }));
  },

  addRebuy: (playerId: string) => {
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              rebuys: p.rebuys + 1,
              totalInvested: p.totalInvested + state.rebuyValue,
            }
          : p
      ),
    }));
  },

  addAddon: (playerId: string) => {
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              addons: p.addons + 1,
              totalInvested: p.totalInvested + state.addonValue,
            }
          : p
      ),
    }));
  },

  eliminatePlayer: (playerId: string) => {
    const state = get();
    const activePlayers = state.players.filter(p => !p.isEliminated);
    const position = activePlayers.length; // Posição é a quantidade de jogadores ainda ativos
    
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              isEliminated: true,
              eliminatedAt: Date.now(),
              position: position,
            }
          : p
      ),
    }));
  },

  reactivatePlayer: (playerId: string) => {
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              isEliminated: false,
              eliminatedAt: null,
              position: null,
            }
          : p
      ),
    }));
  },

  // Actions - Config
  setBuyInValue: (value: number) => set({ buyInValue: value }),
  setRebuyValue: (value: number) => set({ rebuyValue: value }),
  setAddonValue: (value: number) => set({ addonValue: value }),
  setStartingStack: (value: number) => set({ startingStack: value }),
  setRebuyStack: (value: number) => set({ rebuyStack: value }),
  setAddonStack: (value: number) => set({ addonStack: value }),

  // Actions - Payout
  setPayoutStructure: (structure: string) => set({ selectedPayoutStructure: structure }),
  setRakePercentage: (percentage: number) => set({ rakePercentage: percentage }),

  // Computed
  getStats: (): TournamentStats => {
    const state = get();
    const activePlayers = state.players.filter(p => !p.isEliminated);
    const eliminatedPlayers = state.players.filter(p => p.isEliminated);
    
    const totalBuyIns = state.players.reduce((sum, p) => sum + p.buyIns, 0);
    const totalRebuys = state.players.reduce((sum, p) => sum + p.rebuys, 0);
    const totalAddons = state.players.reduce((sum, p) => sum + p.addons, 0);
    
    const prizePool = state.players.reduce((sum, p) => sum + p.totalInvested, 0);
    
    // Calcula fichas em jogo
    const totalChipsInPlay = 
      (totalBuyIns * state.startingStack) +
      (totalRebuys * state.rebuyStack) +
      (totalAddons * state.addonStack);
    
    const averageStack = activePlayers.length > 0 
      ? Math.floor(totalChipsInPlay / activePlayers.length)
      : 0;

    return {
      totalPlayers: state.players.length,
      activePlayers: activePlayers.length,
      eliminatedPlayers: eliminatedPlayers.length,
      totalBuyIns,
      totalRebuys,
      totalAddons,
      totalEntries: totalBuyIns + totalRebuys,
      prizePool,
      totalChipsInPlay,
      averageStack,
    };
  },

  getPayouts: (): PayoutCalculation | null => {
    const state = get();
    const stats = get().getStats();
    
    if (stats.prizePool === 0) {
      return null;
    }
    
    try {
      return calculatePayouts(
        stats.prizePool,
        state.selectedPayoutStructure,
        state.rakePercentage
      );
    } catch (error) {
      return null;
    }
  },

  resetAdmin: () => {
    set({
      players: [],
      selectedPayoutStructure: 'top3_50_30_20',
      rakePercentage: 0,
      ...DEFAULT_CONFIG,
    });
  },
}));