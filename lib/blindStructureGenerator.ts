import { BlindLevel } from '@/types/tournament';

export interface TournamentConfig {
  name: string;
  startingSmallBlind: number;
  startingBigBlind: number;
  levelDuration: number; // em minutos
  includeBreaks: boolean;
  breakDuration: number; // em minutos
  breakInterval: number; // a cada quantos níveis
}

export function generateBlindStructure(config: TournamentConfig): BlindLevel[] {
  const {
    startingSmallBlind,
    startingBigBlind,
    levelDuration,
    includeBreaks,
    breakDuration,
    breakInterval,
  } = config;

  const structure: BlindLevel[] = [];
  let currentSB = startingSmallBlind;
  let currentBB = startingBigBlind;
  let levelNumber = 1;
  let actualLevelCount = 0; // Conta apenas níveis de jogo (não breaks)

  // Gera 20 níveis de jogo
  for (let i = 0; i < 20; i++) {
    actualLevelCount++;

    // Adiciona nível de jogo
    structure.push({
      level: levelNumber++,
      smallBlind: currentSB,
      bigBlind: currentBB,
      ante: currentBB, // Ante = BB
      duration: levelDuration * 60, // converte minutos para segundos
    });

    // Adiciona break se configurado
    if (includeBreaks && actualLevelCount % breakInterval === 0 && actualLevelCount < 20) {
      structure.push({
        level: levelNumber++,
        smallBlind: 0, // 0 indica break
        bigBlind: 0,
        ante: 0,
        duration: breakDuration * 60,
      });
    }

    // Calcula próximos blinds usando progressão inteligente
    const nextBlinds = calculateNextBlinds(currentSB, currentBB);
    currentSB = nextBlinds.smallBlind;
    currentBB = nextBlinds.bigBlind;
  }

  return structure;
}

function calculateNextBlinds(currentSB: number, currentBB: number): { smallBlind: number; bigBlind: number } {
  // Progressão baseada em múltiplos comuns de poker
  // Usa incrementos de aproximadamente 25-50% mantendo valores "redondos"
  
  const possibleMultipliers = [1.25, 1.5, 2];
  
  // Escolhe multiplicador baseado no valor atual
  let multiplier: number;
  if (currentBB < 500) {
    multiplier = 1.5; // Progressão mais rápida no início
  } else if (currentBB < 2000) {
    multiplier = 1.33;
  } else {
    multiplier = 1.25; // Progressão mais lenta no final
  }

  let newBB = Math.round(currentBB * multiplier);
  
  // Arredonda para valores "bonitos"
  newBB = roundToNiceNumber(newBB);
  
  // SB é geralmente metade do BB, mas arredondado
  let newSB = Math.round(newBB / 2);
  newSB = roundToNiceNumber(newSB);

  // Garante proporção mínima
  if (newSB < newBB / 3) {
    newSB = Math.round(newBB / 2);
  }

  return {
    smallBlind: newSB,
    bigBlind: newBB,
  };
}

function roundToNiceNumber(value: number): number {
  // Arredonda para números compatíveis com as fichas: 100, 500, 1000, 5000, 25000
  
  // Fase 1: Valores pequenos (até 500) - usa fichas de 100
  if (value <= 500) {
    return Math.round(value / 100) * 100; // 100, 200, 300, 400, 500
  }
  
  // Fase 2: 500 a 1000 - transição (usa 100 e 500)
  if (value < 1000) {
    // Arredonda para 500, 600, 700, 800, 900, 1000
    return Math.round(value / 100) * 100;
  }
  
  // Fase 3: 1K a 5K - usa fichas de 500 e 1K
  if (value < 5000) {
    // Múltiplos de 500: 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000
    return Math.round(value / 500) * 500;
  }
  
  // Fase 4: 5K a 25K - usa fichas de 1K e 5K
  if (value < 25000) {
    // Múltiplos de 1000: 5K, 6K, 7K, 8K, 9K, 10K, 12K, 15K, 20K, 25K
    // Prioriza valores "bonitos" (5K, 10K, 15K, 20K, 25K)
    const rounded = Math.round(value / 1000) * 1000;
    
    // Se for entre 10K-25K, tenta arredondar para múltiplos de 5K
    if (rounded >= 10000) {
      const roundedTo5K = Math.round(value / 5000) * 5000;
      // Usa múltiplo de 5K se a diferença não for muito grande
      if (Math.abs(roundedTo5K - value) / value < 0.3) {
        return roundedTo5K;
      }
    }
    
    return rounded;
  }
  
  // Fase 5: >= 25K - usa fichas de 5K e 25K
  if (value < 100000) {
    // Múltiplos de 5000: 25K, 30K, 35K, 40K, 45K, 50K, 60K, 75K, 100K
    return Math.round(value / 5000) * 5000;
  }
  
  // Fase 6: Valores muito altos (>100K) - múltiplos de 25K
  return Math.round(value / 25000) * 25000; // 100K, 125K, 150K, 175K, 200K
}

// Estruturas pré-definidas para facilitar
export const presetStructures = {
  standard: {
    name: 'Standard',
    startingSmallBlind: 100,
    startingBigBlind: 200,
    levelDuration: 30,
    includeBreaks: true,
    breakDuration: 10,
    breakInterval: 4,
  },
  turbo: {
    name: 'Turbo',
    startingSmallBlind: 100,
    startingBigBlind: 200,
    levelDuration: 15,
    includeBreaks: true,
    breakDuration: 5,
    breakInterval: 6,
  },
  deepStack: {
    name: 'Deep Stack',
    startingSmallBlind: 25,
    startingBigBlind: 50,
    levelDuration: 40,
    includeBreaks: true,
    breakDuration: 15,
    breakInterval: 4,
  },
  hyper: {
    name: 'Hyper Turbo',
    startingSmallBlind: 500,
    startingBigBlind: 1000,
    levelDuration: 10,
    includeBreaks: false,
    breakDuration: 5,
    breakInterval: 6,
  },
};