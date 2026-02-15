export interface Player {
  id: string;
  name: string;
  buyIns: number;        // Quantidade de buy-ins
  rebuys: number;        // Quantidade de rebuys
  addons: number;        // Quantidade de add-ons
  totalInvested: number; // Total investido em R$
  isEliminated: boolean;
  eliminatedAt: number | null;
  position: number | null; // Posição final (1 = campeão)
}

export interface TournamentAdmin {
  players: Player[];
  buyInValue: number;      // Valor do buy-in em R$
  rebuyValue: number;      // Valor do rebuy em R$
  addonValue: number;      // Valor do add-on em R$
  startingStack: number;   // Stack inicial
  rebuyStack: number;      // Stack do rebuy
  addonStack: number;      // Stack do add-on
}

export interface TournamentStats {
  totalPlayers: number;
  activePlayers: number;
  eliminatedPlayers: number;
  totalBuyIns: number;
  totalRebuys: number;
  totalAddons: number;
  totalEntries: number;    // Total de entradas (buy-ins + rebuys)
  prizePool: number;        // Total arrecadado em R$
  totalChipsInPlay: number; // Total de fichas em jogo
  averageStack: number;     // Stack médio
}