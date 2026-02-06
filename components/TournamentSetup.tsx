'use client';

import { useState } from 'react';
import { ArrowRight, Settings, Clock, Coffee } from 'lucide-react';
import { generateBlindStructure, presetStructures, TournamentConfig } from '@/lib/blindStructureGenerator';
import { useTournamentStore } from '@/store/tournament-store';

interface TournamentSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function TournamentSetup({ onComplete, onBack }: TournamentSetupProps) {
  const { setStructure } = useTournamentStore();
  
  const [config, setConfig] = useState<TournamentConfig>({
    startingSmallBlind: 100,
    startingBigBlind: 200,
    levelDuration: 30,
    includeBreaks: true,
    breakDuration: 10,
    breakInterval: 4,
  });

  const [showPreview, setShowPreview] = useState(false);

  const handlePresetSelect = (presetKey: keyof typeof presetStructures) => {
    const preset = presetStructures[presetKey];
    setConfig({
      startingSmallBlind: preset.startingSmallBlind,
      startingBigBlind: preset.startingBigBlind,
      levelDuration: preset.levelDuration,
      includeBreaks: preset.includeBreaks,
      breakDuration: preset.breakDuration,
      breakInterval: preset.breakInterval,
    });
  };

  const handleGenerateAndStart = () => {
    const structure = generateBlindStructure(config);
    setStructure(structure);
    onComplete();
  };

  const previewStructure = showPreview ? generateBlindStructure(config) : [];

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
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 tracking-tight mb-2">
            Configurar Torneio
          </h1>
          <p className="text-slate-400 text-lg">Personalize a estrutura de blinds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Configuração */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-emerald-600 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl font-bold text-white">Configuração</h2>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <label className="text-slate-400 text-sm font-bold block mb-3">ESTRUTURAS PRÉ-DEFINIDAS</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handlePresetSelect('standard')}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all text-sm"
                >
                  Standard
                </button>
                <button
                  onClick={() => handlePresetSelect('turbo')}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all text-sm"
                >
                  Turbo
                </button>
                <button
                  onClick={() => handlePresetSelect('deepStack')}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold transition-all text-sm"
                >
                  Deep Stack
                </button>
              </div>
            </div>

            {/* Blinds Iniciais */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-400 text-sm font-bold block mb-2">SMALL BLIND INICIAL</label>
                <input
                  type="number"
                  value={config.startingSmallBlind}
                  onChange={(e) => setConfig({ ...config, startingSmallBlind: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border-2 border-slate-700 
                           focus:border-emerald-500 focus:outline-none font-bold text-xl"
                  min="10"
                  step="10"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm font-bold block mb-2">BIG BLIND INICIAL</label>
                <input
                  type="number"
                  value={config.startingBigBlind}
                  onChange={(e) => setConfig({ ...config, startingBigBlind: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border-2 border-slate-700 
                           focus:border-emerald-500 focus:outline-none font-bold text-xl"
                  min="20"
                  step="10"
                />
              </div>
            </div>

            {/* Duração */}
            <div className="mb-6">
              <label className="text-slate-400 text-sm font-bold block mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                DURAÇÃO DE CADA NÍVEL (minutos)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={config.levelDuration}
                  onChange={(e) => setConfig({ ...config, levelDuration: parseInt(e.target.value) })}
                  className="flex-1 accent-emerald-500"
                />
                <div className="w-20 bg-slate-900 px-4 py-2 rounded-lg text-white font-bold text-center">
                  {config.levelDuration}min
                </div>
              </div>
            </div>

            {/* Breaks */}
            <div className="mb-6 bg-slate-900 bg-opacity-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-slate-400 text-sm font-bold flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  INCLUIR BREAKS
                </label>
                <button
                  onClick={() => setConfig({ ...config, includeBreaks: !config.includeBreaks })}
                  className={`w-14 h-7 rounded-full transition-all relative ${
                    config.includeBreaks ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all shadow-lg ${
                    config.includeBreaks ? 'left-7' : 'left-0.5'
                  }`}></div>
                </button>
              </div>

              {config.includeBreaks && (
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-500 text-xs block mb-1">Duração do break (min)</label>
                    <input
                      type="number"
                      value={config.breakDuration}
                      onChange={(e) => setConfig({ ...config, breakDuration: parseInt(e.target.value) || 5 })}
                      className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 
                               focus:border-emerald-500 focus:outline-none"
                      min="5"
                      max="30"
                      step="5"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs block mb-1">Break a cada X níveis</label>
                    <input
                      type="number"
                      value={config.breakInterval}
                      onChange={(e) => setConfig({ ...config, breakInterval: parseInt(e.target.value) || 4 })}
                      className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 
                               focus:border-emerald-500 focus:outline-none"
                      min="2"
                      max="8"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Botão Preview */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl 
                       font-bold transition-all mb-4"
            >
              {showPreview ? 'OCULTAR' : 'VISUALIZAR'} ESTRUTURA
            </button>

            {/* Botões de ação */}
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl 
                         font-bold transition-all"
              >
                VOLTAR
              </button>
              <button
                onClick={handleGenerateAndStart}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 
                         hover:to-green-500 text-white px-6 py-4 rounded-xl font-bold transition-all 
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                CRIAR TORNEIO
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview da Estrutura */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Preview da Estrutura</h2>
            
            {showPreview ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {/* Header */}
                <div className="grid grid-cols-4 gap-2 text-xs font-bold text-emerald-400 border-b border-slate-700 pb-2 sticky top-0 bg-slate-900">
                  <div>LEVEL</div>
                  <div>SB</div>
                  <div>BB</div>
                  <div>TEMPO</div>
                </div>

                {/* Níveis */}
                {previewStructure.map((level, idx) => {
                  const isBreak = level.smallBlind === 0;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-4 gap-2 text-sm py-2 rounded-lg ${
                        isBreak
                          ? 'bg-amber-900 bg-opacity-30 border border-amber-700 text-amber-300'
                          : 'bg-slate-900 bg-opacity-50 text-slate-300'
                      }`}
                    >
                      <div className="font-bold">
                        {isBreak ? '☕ BREAK' : `${level.level}`}
                      </div>
                      <div>{isBreak ? '—' : level.smallBlind.toLocaleString()}</div>
                      <div>{isBreak ? '—' : level.bigBlind.toLocaleString()}</div>
                      <div className="text-slate-500">{Math.floor(level.duration / 60)}min</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Settings className="w-20 h-20 text-slate-600 mb-4" />
                <p className="text-slate-500">
                  Clique em "VISUALIZAR ESTRUTURA" para ver os níveis que serão gerados
                </p>
              </div>
            )}

            {/* Estatísticas */}
            {showPreview && (
              <div className="mt-6 bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-emerald-400 font-bold mb-3 text-sm">ESTATÍSTICAS</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs">Níveis de jogo</div>
                    <div className="text-white font-bold">
                      {previewStructure.filter(l => l.smallBlind > 0).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Breaks</div>
                    <div className="text-white font-bold">
                      {previewStructure.filter(l => l.smallBlind === 0).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Duração total</div>
                    <div className="text-white font-bold">
                      {Math.floor(previewStructure.reduce((acc, l) => acc + l.duration, 0) / 3600)}h{' '}
                      {Math.floor((previewStructure.reduce((acc, l) => acc + l.duration, 0) % 3600) / 60)}min
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Blinds finais</div>
                    <div className="text-white font-bold">
                      {previewStructure.filter(l => l.smallBlind > 0).slice(-1)[0]?.bigBlind.toLocaleString() || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}