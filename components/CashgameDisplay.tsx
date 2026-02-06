'use client';

import { useTournamentTimer } from '@/hooks/useTournamentTimer';
import { formatTime, formatMoney } from '@/lib/utils';
import { Play, Pause, RotateCcw, Plus, Home } from 'lucide-react';

interface CashGameDisplayProps {
  onBackToMenu: () => void;
}

export default function CashGameDisplay({ onBackToMenu }: CashGameDisplayProps) {
  const {
    timeRemaining,
    isRunning,
    isPaused,
    cashGameConfig,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
  } = useTournamentTimer();

  if (!cashGameConfig) return null;

  const isWarning = timeRemaining <= 300 && timeRemaining > 0; // 5 min
  const isCritical = timeRemaining <= 60 && timeRemaining > 0; // 1 min

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 relative overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl opacity-5 animate-pulse-slow">₢</div>
        <div className="absolute top-40 right-20 text-8xl opacity-5 animate-pulse-slow" style={{animationDelay: '1s'}}>♠</div>
        <div className="absolute bottom-20 left-40 text-9xl opacity-5 animate-pulse-slow" style={{animationDelay: '2s'}}>$</div>
        <div className="absolute bottom-40 right-10 text-8xl opacity-5 animate-pulse-slow" style={{animationDelay: '3s'}}>♥</div>
      </div>

      {/* Seção FIXA - Header + Info */}
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
            
            <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 tracking-tight">
              CASH GAME
            </h1>

            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Session Timer */}
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 px-8 py-3 rounded-full shadow-2xl">
                <span className="text-xl font-bold text-black tracking-wider">
                  TEMPO DE SESSÃO
                </span>
              </div>
            </div>

            {/* Timer Circle */}
            <div className="relative mb-12">
              <div className={`
                mx-auto w-80 h-80 rounded-full flex items-center justify-center
                bg-gradient-to-br from-slate-800 to-slate-900
                border-8 ${isCritical ? 'border-red-500 animate-glow' : isWarning ? 'border-yellow-500' : 'border-amber-500'}
                shadow-2xl transition-all duration-300
              `}>
                <div className="text-center">
                  <div className={`
                    text-8xl font-mono font-bold tracking-tight
                    ${isCritical ? 'text-red-400 animate-pulse' : isWarning ? 'text-yellow-400' : 'text-amber-400'}
                  `}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-slate-400 text-xl mt-2 font-mono">
                    {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
                  </div>
                </div>
              </div>
            </div>

            {/* Blinds Info - FIXO */}
            <div className="grid grid-cols-2 gap-6 mb-6 max-w-3xl mx-auto">
              {/* Small Blind */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-green-600 shadow-2xl">
                <div className="text-green-400 text-sm font-bold tracking-wider mb-2">SMALL BLIND</div>
                <div className="text-5xl font-display font-bold text-white">
                  {formatMoney(cashGameConfig.smallBlind)}
                </div>
              </div>

              {/* Big Blind */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-yellow-500 shadow-2xl">
                <div className="text-yellow-400 text-sm font-bold tracking-wider mb-2">BIG BLIND</div>
                <div className="text-5xl font-display font-bold text-white">
                  {formatMoney(cashGameConfig.bigBlind)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção SCROLLABLE */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Buy-in Info */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700 max-w-2xl mx-auto">
              <div className="text-amber-400 text-sm font-bold mb-3 tracking-wider text-center">BUY-IN DA MESA</div>
              <div className="flex items-center justify-center gap-8 text-slate-300">
                <div className="text-center">
                  <span className="text-xs text-slate-500 block mb-1">MÍNIMO</span>
                  <span className="text-3xl font-bold text-green-400">R$ {cashGameConfig.minBuyIn}</span>
                </div>
                <div className="text-slate-600 text-3xl">—</div>
                <div className="text-center">
                  <span className="text-xs text-slate-500 block mb-1">MÁXIMO</span>
                  <span className="text-3xl font-bold text-yellow-400">R$ {cashGameConfig.maxBuyIn}</span>
                </div>
              </div>
            </div>

            {/* Blind Equivalents */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700 max-w-2xl mx-auto">
              <div className="text-slate-400 text-sm font-bold mb-4 tracking-wider text-center">EQUIVALÊNCIAS</div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-slate-500 text-sm mb-1">Buy-in Mínimo</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(cashGameConfig.minBuyIn * 100 / cashGameConfig.bigBlind)} BB
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm mb-1">Buy-in Máximo</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(cashGameConfig.maxBuyIn * 100 / cashGameConfig.bigBlind)} BB
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                           text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg
                           hover:shadow-xl flex items-center gap-2 text-lg"
                >
                  <Play className="w-6 h-6" />
                  START SESSION
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
            </div>

            {/* Quick Time Adjustments */}
            <div className="flex justify-center gap-3 mt-6 mb-12">
              <button
                onClick={() => addTime(-300)}
                className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                -5 MIN
              </button>
              <button
                onClick={() => addTime(-60)}
                className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                -1 MIN
              </button>
              <button
                onClick={() => addTime(300)}
                className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                5 MIN
              </button>
              <button
                onClick={() => addTime(600)}
                className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                10 MIN
              </button>
              <button
                onClick={() => addTime(1800)}
                className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                30 MIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}