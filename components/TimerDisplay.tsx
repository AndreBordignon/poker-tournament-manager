'use client';

import { useState } from 'react';
import { useTournamentTimer } from '@/hooks/useTournamentTimer';
import { useAdminStore } from '@/store/admin-store';
import { formatTime } from '@/lib/utils';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, List, X, Home, Settings, Users, Award, ServerCrash, ChartColumnStacked } from 'lucide-react';
import SettingsModal from '@/components/SettingsModal';
import AdminPanel from '@/components/AdminPanel';

interface TimerDisplayProps {
  onBackToMenu: () => void;
}

export default function TimerDisplay({ onBackToMenu }: TimerDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const {
    currentLevel,
    timeRemaining,
    isRunning,
    isPaused,
    structure,
    anteEnabled,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    nextLevel,
    previousLevel,
    addTime,
    toggleAnte,
  } = useTournamentTimer();

  // Pega estatísticas do admin
  const { getStats, getPayouts } = useAdminStore();
  const stats = getStats();
  const payouts = getPayouts();
  
  // Verifica se está no ITM (In The Money)
  const isInTheMoney = payouts && stats.activePlayers <= payouts.structure.positions;

  const currentBlind = structure[currentLevel];
  const nextBlind = currentLevel < structure.length - 1 ? structure[currentLevel + 1] : null;

  const isWarning = timeRemaining <= 60 && timeRemaining > 0;
  const isCritical = timeRemaining <= 10 && timeRemaining > 0;

  // Calcula o ante a ser exibido (sempre = BB se ativo, 0 se desativado)
  const displayAnte = anteEnabled ? currentBlind.ante : 0;
  const displayNextAnte = anteEnabled && nextBlind ? nextBlind.ante : 0;

  // Verifica se é break
  const isBreak = currentBlind.smallBlind === 0;
  const nextIsBreak = nextBlind && nextBlind.smallBlind === 0;

  // Calcula denominações de fichas baseado no small blind atual
  // Fichas disponíveis: 100, 500, 1000, 5000, 25000
  const getChipDenominations = (smallBlind: number): string => {
    if (smallBlind === 0) return '—'; // Break não tem fichas
    
    // Quando SB >= 1000, remove fichas de 100 (race-off)
    // A partir de 1K só precisamos de: 500, 1K, 5K, 25K
    if (smallBlind >= 1000) {
      return '500, 1K, 5K, 25K';
    }
    
    // SB < 1000, usa todas as fichas incluindo 100
    return '100, 500, 1K, 5K, 25K';
  };

  const currentDenominations = getChipDenominations(currentBlind.smallBlind);
  
  // Alerta de RACE-OFF quando SB chega a 1000 pela primeira vez
  // Mostra aviso para remover fichas de 100
  const showChipRemovalAlert = currentBlind.smallBlind >= 1000 && 
                                 currentLevel > 0 && 
                                 structure[currentLevel - 1]?.smallBlind < 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 relative overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated card suits background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl opacity-5 animate-pulse-slow">♠</div>
        <div className="absolute top-40 right-20 text-8xl opacity-5 animate-pulse-slow" style={{animationDelay: '1s'}}>♥</div>
        <div className="absolute bottom-20 left-40 text-9xl opacity-5 animate-pulse-slow" style={{animationDelay: '2s'}}>♦</div>
        <div className="absolute bottom-40 right-10 text-8xl opacity-5 animate-pulse-slow" style={{animationDelay: '3s'}}>♣</div>
      </div>

      {/* Seção FIXA - Header + Timer + Blinds Atuais */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToMenu}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold 
                       transition-all shadow-lg flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              MENU
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 tracking-tight">
                Torneio Firmin Poker Club
              </h1>
              <div className="h-1 w-64 mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold 
                         transition-all shadow-lg flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold 
                         transition-all shadow-lg flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Level Info */}
            <div className="text-center mb-6">
              <div className={`inline-block px-8 py-3 rounded-full shadow-2xl ${
                isBreak 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-600'
              }`}>
                <span className="text-2xl font-bold text-black tracking-wider flex items-center gap-2 justify-center">
                  {isBreak ? (
                    <>
                      <span>☕</span>
                      BREAK
                    </>
                  ) : (
                    `LEVEL ${currentBlind.level}`
                  )}
                </span>
              </div>
            </div>

            {/* Timer Circle */}
            <div className="relative mb-12">
              <div className="text-center">
                <div className={`
                  text-9xl font-mono font-bold tracking-tight
                  ${isCritical ? 'text-red-400 animate-pulse' : isWarning ? 'text-yellow-400' : 'text-emerald-400'}
                `}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-slate-400 text-xl mt-2 font-mono">
                  {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
                </div>
              </div>
            </div>

            {/* Current Blinds - Premium card-style - FIXO */}
            {isBreak ? (
              /* Break Display */
              <div className="mb-6 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-amber-800 to-orange-900 rounded-2xl p-12 border-2 border-amber-500 shadow-2xl text-center">
                  <div className="text-8xl mb-4">☕</div>
                  <div className="text-4xl font-display font-bold text-white mb-2">BREAK TIME</div>
                  <div className="text-amber-200 text-lg">Aproveite o intervalo!</div>
                </div>
              </div>
            ) : (
              /* Normal Blinds Display */
              <>
                <div className="grid grid-cols-3 gap-6 mb-6 max-w-4xl mx-auto">
                  {/* Small Blind */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-emerald-600 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="text-emerald-400 text-md font-bold tracking-wider mb-2">SMALL BLIND</div>
                    <div className="text-6xl font-display font-bold text-white">
                      {currentBlind.smallBlind.toLocaleString()}
                    </div>
                  </div>

                  {/* Big Blind */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-yellow-500 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="text-yellow-400 text-md font-bold tracking-wider mb-2">BIG BLIND</div>
                    <div className="text-6xl font-display font-bold text-white">
                      {currentBlind.bigBlind.toLocaleString()}
                    </div>
                  </div>

                  {/* Ante */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-purple-500 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="text-purple-400 text-md font-bold tracking-wider mb-2">ANTE</div>
                    <div className="text-6xl font-display font-bold text-white">
                      {displayAnte > 0 ? displayAnte.toLocaleString() : '—'}
                    </div>
                  </div>
                </div>
            {/* Next Level Preview */}
            {nextBlind && (
              <div className={`bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border max-w-2xl mx-auto ${
                nextIsBreak ? 'border-amber-700' : 'border-slate-700'
              }`}>
                <div className="text-slate-400 text-sm font-bold mb-3 tracking-wider">
                  {nextIsBreak ? '☕ PRÓXIMO: BREAK' : 'NEXT LEVEL'}
                </div>
                {nextIsBreak ? (
                  <div className="flex items-center justify-between text-amber-300">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">☕</span>
                      <span className="text-xl font-bold">Intervalo</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                      {formatTime(nextBlind.duration)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex gap-8">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">SB</span>
                        <span className="text-2xl font-bold">{nextBlind.smallBlind.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">BB</span>
                        <span className="text-2xl font-bold">{nextBlind.bigBlind.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">ANTE</span>
                        <span className="text-2xl font-bold">
                          {displayNextAnte > 0 ? displayNextAnte.toLocaleString() : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-500 text-sm">
                      {formatTime(nextBlind.duration)}
                    </div>
                  </div>
                )}
              </div>
            )}
                {/* Informações do Torneio */}
                {stats.totalPlayers > 0 && (
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    {/* Jogadores */}
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border-2 border-blue-700 shadow-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-blue-300" />
                        <span className="text-blue-300 text-sm font-bold">JOGADORES</span>
                      </div>
                      <div className="text-5xl font-bold text-white mb-1">{stats.activePlayers}</div>
                      <div className="text-blue-300 text-sm">
                        {stats.totalPlayers} registrados • {stats.totalEntries} entradas
                      </div>
                    </div>

                    {/* Stack Médio */}
                    <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border-2 border-purple-700 shadow-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ChartColumnStacked className="w-6 h-6 text-purple-300" />
                        <span className="text-purple-300 text-sm font-bold">STACK MÉDIO</span>
                      </div>
                      <div className="text-5xl font-bold text-white mb-1">
                        {stats.averageStack > 0 ? (stats.averageStack / 1000).toFixed(1) + 'K' : '—'}
                      </div>
                      <div className="text-purple-300 text-sm">
                        {stats.totalChipsInPlay > 0 
                          ? `${(stats.totalChipsInPlay / 1000000).toFixed(1)}M fichas` 
                          : 'Sem fichas'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Premiações - Só aparece no ITM */}
                {isInTheMoney && payouts && (
                  <div className="max-w-4xl mx-auto mb-6">
                    <div className="bg-gradient-to-br from-yellow-900 to-amber-900 rounded-2xl p-6 border-2 border-yellow-600 shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-yellow-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-400">CHEGAMO NOS PILA! (CNP) 🎉</h3>
                          <p className="text-yellow-200 text-sm">
                            {stats.activePlayers} jogadores restantes • Prize Pool: R$ {payouts.netPrizePool.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Tabela de Premiações Compacta */}
                      <div className="bg-slate-900 bg-opacity-50 rounded-xl p-4">
                        <div className="grid gap-2 max-h-64 overflow-y-auto">
                          {payouts.payouts.slice(0, 6).map((payout) => (
                            <div
                              key={payout.position}
                              className={`grid grid-cols-3 gap-4 px-4 py-3 rounded-lg ${
                                payout.position === 1
                                  ? 'bg-gradient-to-r from-yellow-800 to-yellow-700 border border-yellow-600'
                                  : payout.position === 2
                                  ? 'bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500'
                                  : payout.position === 3
                                  ? 'bg-gradient-to-r from-amber-800 to-amber-700 border border-amber-600'
                                  : 'bg-slate-800 border border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {payout.position === 1 ? '🥇' :
                                   payout.position === 2 ? '🥈' :
                                   payout.position === 3 ? '🥉' :
                                   ''}
                                </span>
                                <span className={`font-bold ${
                                  payout.position <= 3 ? 'text-white' : 'text-slate-300'
                                }`}>
                                  {payout.position}º Lugar
                                </span>
                              </div>
                              <div className="text-center text-slate-300 font-bold">
                                {payout.percentage}%
                              </div>
                              <div className={`text-right font-bold ${
                                payout.position === 1 ? 'text-yellow-400' : 'text-white'
                              }`}>
                                R$ {payout.amount.toFixed(2)}
                              </div>
                            </div>
                          ))}
                          
                          {payouts.payouts.length > 6 && (
                            <div className="text-center text-slate-500 text-sm py-2">
                              + {payouts.payouts.length - 6} posições premiadas
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Seção SCROLLABLE - Resto do conteúdo */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            

            {/* Toggle Ante */}
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleAnte}
                className={`
                  px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl
                  flex items-center gap-3 border-2
                  ${anteEnabled 
                    ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 border-slate-500 text-slate-300'
                  }
                `}
              >
                <div className={`w-12 h-6 rounded-full transition-all relative ${
                  anteEnabled ? 'bg-purple-400' : 'bg-slate-500'
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-lg ${
                    anteEnabled ? 'left-6' : 'left-0.5'
                  }`}></div>
                </div>
                <span className="text-lg">
                  ANTE {anteEnabled ? 'ATIVO' : 'DESATIVADO'}
                </span>
              </button>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={previousLevel}
                disabled={currentLevel === 0}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 
                         text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg
                         hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
              >
                <SkipBack className="w-5 h-5" />
                PREV
              </button>

              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                           text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg
                           hover:shadow-xl flex items-center gap-2 text-lg"
                >
                  <Play className="w-6 h-6" />
                  START
                </button>
              ) : isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
                           text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg
                           hover:shadow-xl flex items-center gap-2 text-lg"
                >
                  <Play className="w-6 h-6" />
                  RESUME
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500
                           text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg
                           hover:shadow-xl flex items-center gap-2 text-lg"
                >
                  <Pause className="w-6 h-6" />
                  PAUSE
                </button>
              )}

              <button
                onClick={resetTimer}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-bold 
                         transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                RESET
              </button>

              <button
                onClick={nextLevel}
                disabled={currentLevel >= structure.length - 1}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50
                         text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg
                         hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
              >
                NEXT
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Time Adjustments */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => addTime(-60)}
                className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                -1 MIN
              </button>
              <button
                onClick={() => addTime(60)}
                className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                1 MIN
              </button>
              <button
                onClick={() => addTime(300)}
                className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                5 MIN
              </button>
            </div>

            {/* Botão para abrir modal da estrutura completa */}
            <div className="flex justify-center mt-8 mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500
                         text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg
                         hover:shadow-xl flex items-center gap-3 text-lg"
              >
                <List className="w-6 h-6" />
                VER ESTRUTURA COMPLETA
                <span className="text-sm opacity-75">({structure.length} níveis)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal da Estrutura Completa */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border-2 border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-800 p-6 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
              <div>
                <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                  <List className="w-8 h-8 text-emerald-400" />
                  Estrutura Completa do Torneio
                </h2>
                <p className="text-slate-300 mt-2">
                  {structure.length} níveis
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Modal - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              {/* Resumo da estrutura */}
              <div className="mb-8 bg-slate-800 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">📊 Resumo da Estrutura</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {structure.filter(l => l.smallBlind > 0).length}
                    </div>
                    <div className="text-sm text-slate-400">Níveis de Jogo</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {structure.filter(l => l.smallBlind === 0).length}
                    </div>
                    <div className="text-sm text-slate-400">Breaks</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {Math.floor(structure.reduce((acc, l) => acc + l.duration, 0) / 3600)}h{' '}
                      {Math.floor((structure.reduce((acc, l) => acc + l.duration, 0) % 3600) / 60)}min
                    </div>
                    <div className="text-sm text-slate-400">Duração Total</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {structure.filter(l => l.smallBlind > 0)[0]?.smallBlind}-{structure.filter(l => l.smallBlind > 0)[0]?.bigBlind}
                    </div>
                    <div className="text-sm text-slate-400">Blinds Iniciais</div>
                  </div>
                </div>
              </div>

              {/* Header da Tabela */}
              <div className="grid grid-cols-5 gap-4 text-sm font-bold text-emerald-400 border-b border-slate-700 pb-4 mb-4 sticky top-0 bg-slate-900 bg-opacity-95 backdrop-blur-sm z-10">
                <div>LEVEL</div>
                <div>SMALL BLIND</div>
                <div>BIG BLIND</div>
                <div>ANTE</div>
                <div>DURATION</div>
              </div>

              {/* Linhas da Tabela */}
              <div className="space-y-2">
                {structure.map((blind, idx) => {
                  const isBreakLevel = blind.smallBlind === 0;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-5 gap-4 text-sm py-4 rounded-xl transition-all ${
                        idx === currentLevel
                          ? 'bg-emerald-900 bg-opacity-50 font-bold text-emerald-300 border-2 border-emerald-500 shadow-lg scale-105'
                          : isBreakLevel
                          ? 'bg-amber-900 bg-opacity-30 border-2 border-amber-700 text-amber-300'
                          : 'text-slate-300 hover:bg-slate-700 hover:bg-opacity-30 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {idx === currentLevel && (
                          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                        )}
                        <span className={idx === currentLevel ? 'text-xl' : ''}>
                          {isBreakLevel ? '☕ BREAK' : blind.level}
                        </span>
                      </div>
                      <div className={idx === currentLevel ? 'text-xl' : ''}>
                        {isBreakLevel ? '—' : blind.smallBlind.toLocaleString()}
                      </div>
                      <div className={idx === currentLevel ? 'text-xl font-bold' : ''}>
                        {isBreakLevel ? '—' : blind.bigBlind.toLocaleString()}
                      </div>
                      <div className={idx === currentLevel ? 'text-xl' : ''}>
                        {isBreakLevel ? '—' : anteEnabled && blind.ante > 0 ? blind.ante.toLocaleString() : '—'}
                      </div>
                      <div className="text-slate-400">
                        {formatTime(blind.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer do Modal - FIXO */}
            <div className="bg-slate-900 p-4 border-t border-slate-700 flex justify-end flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500
                         text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurações */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Modal de Administração */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}