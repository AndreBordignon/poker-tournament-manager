import { BlindLevel } from '@/types/tournament';

export interface TournamentConfig {
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
  // Arredonda para números "bonitos" baseado na magnitude
  if (value < 100) {
    return Math.round(value / 25) * 25;
  } else if (value < 500) {
    return Math.round(value / 50) * 50;
  } else if (value < 1000) {
    return Math.round(value / 100) * 100;
  } else if (value < 5000) {
    return Math.round(value / 200) * 200;
  } else if (value < 10000) {
    return Math.round(value / 500) * 500;
  } else if (value < 50000) {
    return Math.round(value / 1000) * 1000;
  } else {
    return Math.round(value / 5000) * 5000;
  }
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
};