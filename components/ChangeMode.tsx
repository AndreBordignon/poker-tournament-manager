'use client';

import { useState } from 'react';
import { Trophy, Coins, ArrowRight, Settings, Edit } from 'lucide-react';
import { useTournamentStore } from '@/store/tournament-store';
import { CashGameConfig } from '@/types/tournament';
import { saveStructure, saveTournamentHistory } from '@/lib/storage';
import SettingsModal from '@/components/SettingsModal';

interface ModeSelectionProps {
  onModeSelected: () => void;
  onTournamentSetup: () => void;
}

export default function ModeSelection({ onModeSelected, onTournamentSetup }: ModeSelectionProps) {
  const { setGameMode, setCashGameConfig } = useTournamentStore();
  const [selectedMode, setSelectedMode] = useState<'tournament' | 'cashgame' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Cash game settings
  const [minBuyIn, setMinBuyIn] = useState(20);
  const [maxBuyIn, setMaxBuyIn] = useState(30);

  const handleStartTournament = () => {
    setGameMode('tournament');
    onTournamentSetup();
  };

  const handleStartCashGame = () => {
    const config: CashGameConfig = {
      smallBlind: 25, // R$ 0,25
      bigBlind: 50,   // R$ 0,50
      minBuyIn: minBuyIn,
      maxBuyIn: maxBuyIn,
    };

    setGameMode('cashgame');
    setCashGameConfig(config);
    onModeSelected();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Botão Settings no canto superior direito */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-0 right-0 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold 
                     transition-all shadow-lg flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            CONFIG
          </button>

          <h1 className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 tracking-tight mb-4">
            POKER MANAGER
          </h1>
          <p className="text-slate-400 text-xl">Escolha o modo de jogo</p>
          <div className="h-1 w-64 mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        </div>

        {/* Mode Selection Cards */}
        {!selectedMode ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Tournament Mode */}
            <button
              onClick={() => setSelectedMode('tournament')}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-emerald-600 
                       shadow-2xl hover:scale-105 transition-all hover:border-emerald-400 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full 
                              flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">TORNEIO</h2>
                <p className="text-slate-400 text-lg mb-6">
                  Timer com blinds progressivos, estrutura de 20 níveis, 30 minutos cada
                </p>
                <div className="space-y-2 text-left w-full">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span>Blinds automáticos</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span>Ante opcional</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span>Estrutura completa</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Cash Game Mode */}
            <button
              onClick={() => setSelectedMode('cashgame')}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-yellow-600 
                       shadow-2xl hover:scale-105 transition-all hover:border-yellow-400 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-full 
                              flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Coins className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">CASH GAME</h2>
                <p className="text-slate-400 text-lg mb-6">
                  Blinds fixos, buy-in customizável, valores em reais
                </p>
                <div className="space-y-2 text-left w-full">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span>✓</span>
                    <span>Pingo: R$ 0,25 / R$ 0,50</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span>✓</span>
                    <span>Buy-in: R$ 20 - R$ 30</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span>✓</span>
                    <span>Timer de sessão</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ) : selectedMode === 'tournament' ? (
          /* Tournament Confirmation */
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 border-2 border-emerald-600 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full 
                            flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">Modo Torneio</h2>
              <p className="text-slate-400">Estrutura completa configurada</p>
            </div>

            <div className="space-y-4 mb-8 bg-slate-900 bg-opacity-50 rounded-xl p-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-400">Níveis:</span>
                <span className="text-white font-bold">20 níveis</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-400">Duração por nível:</span>
                <span className="text-white font-bold">30 minutos</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-slate-400">Blinds iniciais:</span>
                <span className="text-white font-bold">100 / 200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Duração total:</span>
                <span className="text-white font-bold">10 horas</span>
              </div>
            </div>
            <div onClick={() => onTournamentSetup()} className='mb-10'>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-bold transition-all"><Edit className="w-5 h-5 inline mr-2" />Editar Estrutura</button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMode(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl 
                         font-bold transition-all"
              >
                VOLTAR
              </button>
              <button
                onClick={handleStartTournament}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 
                         hover:to-green-500 text-white px-6 py-4 rounded-xl font-bold transition-all 
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                INICIAR TORNEIO
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Cash Game Configuration */
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 border-2 border-yellow-600 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-full 
                            flex items-center justify-center mx-auto mb-4">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">Modo Cash Game</h2>
              <p className="text-slate-400">Configure o buy-in da mesa</p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Blinds Info */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-4 text-center text-xl">PINGO FIXO</h3>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-1">Small Blind</div>
                    <div className="text-3xl font-bold text-white">R$ 0,25</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-1">Big Blind</div>
                    <div className="text-3xl font-bold text-white">R$ 0,50</div>
                  </div>
                </div>
              </div>

              {/* Buy-in Configuration */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-4">BUY-IN</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">Buy-in Mínimo</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={minBuyIn}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setMinBuyIn(val);
                          if (val > maxBuyIn) setMaxBuyIn(val);
                        }}
                        className="flex-1 accent-yellow-500"
                      />
                      <div className="w-24 bg-slate-800 px-4 py-2 rounded-lg text-white font-bold text-center">
                        R$ {minBuyIn}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm block mb-2">Buy-in Máximo</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={minBuyIn}
                        max="100"
                        step="5"
                        value={maxBuyIn}
                        onChange={(e) => setMaxBuyIn(parseInt(e.target.value))}
                        className="flex-1 accent-yellow-500"
                      />
                      <div className="w-24 bg-slate-800 px-4 py-2 rounded-lg text-white font-bold text-center">
                        R$ {maxBuyIn}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMode(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl 
                         font-bold transition-all"
              >
                VOLTAR
              </button>
              <button
                onClick={handleStartCashGame}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 
                         hover:to-amber-500 text-white px-6 py-4 rounded-xl font-bold transition-all 
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                INICIAR CASH GAME
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Configurações */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}