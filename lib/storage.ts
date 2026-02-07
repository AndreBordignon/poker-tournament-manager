import { BlindLevel } from '@/types/tournament';

// Types para histórico
export interface TournamentHistory {
  id: string;
  name: string;
  startTime: number;
  endTime: number | null;
  structure: BlindLevel[];
  anteEnabled: boolean;
  finalLevel: number;
  duration: number; // tempo total em segundos
}

export interface SavedStructure {
  id: string;
  name: string;
  structure: BlindLevel[];
  config: {
    startingSmallBlind: number;
    startingBigBlind: number;
    levelDuration: number;
    includeBreaks: boolean;
    breakDuration: number;
    breakInterval: number;
  };
  createdAt: number;
}

// Keys do localStorage
const KEYS = {
  TOURNAMENT_HISTORY: 'poker_tournament_history',
  SAVED_STRUCTURES: 'poker_saved_structures',
  CURRENT_TOURNAMENT: 'poker_current_tournament',
  CASH_GAME_HISTORY: 'poker_cashgame_history',
};

// ==================== TOURNAMENT HISTORY ====================

export function saveTournamentHistory(tournament: TournamentHistory): void {
  try {
    const history = getTournamentHistory();
    history.unshift(tournament); // Adiciona no início
    
    // Limita a 50 torneios
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem(KEYS.TOURNAMENT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
}

export function getTournamentHistory(): TournamentHistory[] {
  try {
    const data = localStorage.getItem(KEYS.TOURNAMENT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

export function deleteTournamentHistory(id: string): void {
  try {
    const history = getTournamentHistory().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TOURNAMENT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao deletar histórico:', error);
  }
}

export function updateTournamentHistory(id: string, updates: Partial<TournamentHistory>): void {
  try {
    const history = getTournamentHistory();
    const index = history.findIndex(t => t.id === id);
    
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      localStorage.setItem(KEYS.TOURNAMENT_HISTORY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Erro ao atualizar histórico:', error);
  }
}

export function clearTournamentHistory(): void {
  try {
    localStorage.removeItem(KEYS.TOURNAMENT_HISTORY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

// ==================== SAVED STRUCTURES ====================

export function saveStructure(
  name: string, 
  structure: BlindLevel[],
  config: {
    startingSmallBlind: number;
    startingBigBlind: number;
    levelDuration: number;
    includeBreaks: boolean;
    breakDuration: number;
    breakInterval: number;
  }
): void {
  try {
    const structures = getSavedStructures();
    const newStructure: SavedStructure = {
      id: `struct_${Date.now()}`,
      name,
      structure,
      config,
      createdAt: Date.now(),
    };
    
    structures.unshift(newStructure);
    
    // Limita a 20 estruturas salvas
    if (structures.length > 20) {
      structures.splice(20);
    }
    
    localStorage.setItem(KEYS.SAVED_STRUCTURES, JSON.stringify(structures));
  } catch (error) {
    console.error('Erro ao salvar estrutura:', error);
  }
}

export function getSavedStructures(): SavedStructure[] {
  try {
    const data = localStorage.getItem(KEYS.SAVED_STRUCTURES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar estruturas:', error);
    return [];
  }
}

export function deleteStructure(id: string): void {
  try {
    const structures = getSavedStructures().filter(s => s.id !== id);
    localStorage.setItem(KEYS.SAVED_STRUCTURES, JSON.stringify(structures));
  } catch (error) {
    console.error('Erro ao deletar estrutura:', error);
  }
}

// ==================== CURRENT TOURNAMENT STATE ====================

export interface CurrentTournamentState {
  gameMode: 'tournament' | 'cashgame';
  currentLevel: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  structure: BlindLevel[];
  anteEnabled: boolean;
  startTime: number | null;
  tournamentName: string;
  cashGameConfig?: any;
}

export function saveCurrentTournament(state: CurrentTournamentState): void {
  try {
    localStorage.setItem(KEYS.CURRENT_TOURNAMENT, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar torneio atual:', error);
  }
}

export function getCurrentTournament(): CurrentTournamentState | null {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_TOURNAMENT);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao carregar torneio atual:', error);
    return null;
  }
}

export function clearCurrentTournament(): void {
  try {
    localStorage.removeItem(KEYS.CURRENT_TOURNAMENT);
  } catch (error) {
    console.error('Erro ao limpar torneio atual:', error);
  }
}

// ==================== EXPORT / IMPORT ====================

export interface ExportData {
  version: string;
  exportDate: number;
  tournamentHistory: TournamentHistory[];
  savedStructures: SavedStructure[];
}

export function exportAllData(): string {
  const data: ExportData = {
    version: '1.0',
    exportDate: Date.now(),
    tournamentHistory: getTournamentHistory(),
    savedStructures: getSavedStructures(),
  };
  
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): { success: boolean; message: string } {
  try {
    const data: ExportData = JSON.parse(jsonString);
    
    // Validação básica
    if (!data.version || !data.exportDate) {
      return { success: false, message: 'Arquivo inválido' };
    }
    
    // Import histórico
    if (data.tournamentHistory && Array.isArray(data.tournamentHistory)) {
      const existing = getTournamentHistory();
      const merged = [...data.tournamentHistory, ...existing];
      
      // Remove duplicados por ID
      const unique = merged.filter((t, idx, arr) => 
        arr.findIndex(x => x.id === t.id) === idx
      );
      
      localStorage.setItem(KEYS.TOURNAMENT_HISTORY, JSON.stringify(unique.slice(0, 50)));
    }
    
    // Import estruturas
    if (data.savedStructures && Array.isArray(data.savedStructures)) {
      const existing = getSavedStructures();
      const merged = [...data.savedStructures, ...existing];
      
      // Remove duplicados por ID
      const unique = merged.filter((s, idx, arr) => 
        arr.findIndex(x => x.id === s.id) === idx
      );
      
      localStorage.setItem(KEYS.SAVED_STRUCTURES, JSON.stringify(unique.slice(0, 20)));
    }
    
    return { 
      success: true, 
      message: `Importados ${data.tournamentHistory?.length || 0} torneios e ${data.savedStructures?.length || 0} estruturas` 
    };
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return { success: false, message: 'Erro ao processar arquivo' };
  }
}

// ==================== STORAGE INFO ====================

export function getStorageInfo(): { used: number; available: number; percentage: number } {
  try {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // localStorage típico: 5-10MB (5120KB)
    const available = 5120 * 1024; // 5MB em bytes
    const percentage = (used / available) * 100;
    
    return {
      used: Math.round(used / 1024), // KB
      available: Math.round(available / 1024), // KB
      percentage: Math.round(percentage),
    };
  } catch (error) {
    return { used: 0, available: 5120, percentage: 0 };
  }
}