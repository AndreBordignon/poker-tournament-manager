'use client';

import { useTournamentTimer } from '@/hooks/useTournamentTimer';
import { formatTime } from '@/lib/utils';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Plus } from 'lucide-react';

export default function TimerDisplay() {
  const {
    currentLevel,
    timeRemaining,
    isRunning,
    isPaused,
    structure,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    nextLevel,
    previousLevel,
    addTime,
  } = useTournamentTimer();

  const currentBlind = structure[currentLevel];
  const nextBlind = currentLevel < structure.length - 1 ? structure[currentLevel + 1] : null;

  const isWarning = timeRemaining <= 60 && timeRemaining > 0;
  const isCritical = timeRemaining <= 10 && timeRemaining > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 relative overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 tracking-tight">
            POKER TOURNAMENT
          </h1>
          <div className="h-1 w-64 mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        </div>

        {/* Main Timer Display */}
        <div className="max-w-6xl mx-auto">
          {/* Level Info */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 px-8 py-3 rounded-full shadow-2xl">
              <span className="text-2xl font-bold text-black tracking-wider">
                LEVEL {currentBlind.level}
              </span>
            </div>
          </div>

          {/* Timer Circle */}
          <div className="relative mb-12">
            <div className={`
              mx-auto w-80 h-80 rounded-full flex items-center justify-center
              bg-gradient-to-br from-slate-800 to-slate-900
              border-8 ${isCritical ? 'border-red-500 animate-glow' : isWarning ? 'border-yellow-500' : 'border-emerald-500'}
              shadow-2xl transition-all duration-300
            `}>
              <div className="text-center">
                <div className={`
                  text-8xl font-mono font-bold tracking-tight
                  ${isCritical ? 'text-red-400 animate-pulse' : isWarning ? 'text-yellow-400' : 'text-emerald-400'}
                `}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-slate-400 text-xl mt-2 font-mono">
                  {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Blinds - Premium card-style */}
          <div className="grid grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            {/* Small Blind */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-emerald-600 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-emerald-400 text-sm font-bold tracking-wider mb-2">SMALL BLIND</div>
              <div className="text-5xl font-display font-bold text-white">
                {currentBlind.smallBlind.toLocaleString()}
              </div>
            </div>

            {/* Big Blind */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-yellow-500 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-yellow-400 text-sm font-bold tracking-wider mb-2">BIG BLIND</div>
              <div className="text-5xl font-display font-bold text-white">
                {currentBlind.bigBlind.toLocaleString()}
              </div>
            </div>

            {/* Ante */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-purple-500 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-purple-400 text-sm font-bold tracking-wider mb-2">ANTE</div>
              <div className="text-5xl font-display font-bold text-white">
                {currentBlind.ante > 0 ? currentBlind.ante.toLocaleString() : '—'}
              </div>
            </div>
          </div>

          {/* Next Level Preview */}
          {nextBlind && (
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700 max-w-2xl mx-auto">
              <div className="text-slate-400 text-sm font-bold mb-3 tracking-wider">NEXT LEVEL</div>
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
                      {nextBlind.ante > 0 ? nextBlind.ante.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
                <div className="text-slate-500 text-sm">
                  {formatTime(nextBlind.duration)}
                </div>
              </div>
            </div>
          )}

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
        </div>

        {/* Full Structure Table - Collapsible */}
        <details className="mt-12 max-w-4xl mx-auto">
          <summary className="cursor-pointer text-center text-slate-400 hover:text-slate-300 font-bold py-4 transition-colors">
            VIEW FULL STRUCTURE ({structure.length} levels)
          </summary>
          
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mt-4 border border-slate-700">
            <div className="grid grid-cols-5 gap-4 text-sm font-bold text-slate-400 border-b border-slate-700 pb-3 mb-3">
              <div>LEVEL</div>
              <div>SMALL BLIND</div>
              <div>BIG BLIND</div>
              <div>ANTE</div>
              <div>DURATION</div>
            </div>
            
            <div className="space-y-2">
              {structure.map((blind, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-5 gap-4 text-sm py-3 rounded-lg transition-all ${
                    idx === currentLevel
                      ? 'bg-emerald-900 bg-opacity-50 font-bold text-emerald-300 border-l-4 border-emerald-500 pl-4'
                      : 'text-slate-300 hover:bg-slate-700 hover:bg-opacity-30'
                  }`}
                >
                  <div>{blind.level}</div>
                  <div>{blind.smallBlind.toLocaleString()}</div>
                  <div>{blind.bigBlind.toLocaleString()}</div>
                  <div>{blind.ante > 0 ? blind.ante.toLocaleString() : '—'}</div>
                  <div>{formatTime(blind.duration)}</div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}