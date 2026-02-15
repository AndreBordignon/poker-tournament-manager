'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/admin-store';
import { Users, TrendingUp, DollarSign, Layers, Plus, Trash2, X, Settings, Trophy, Award } from 'lucide-react';
import { PAYOUT_STRUCTURES, suggestPayoutStructure } from '@/lib/payouts';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [showPayouts, setShowPayouts] = useState(false);
  
  const {
    players,
    buyInValue,
    rebuyValue,
    addonValue,
    startingStack,
    rebuyStack,
    addonStack,
    selectedPayoutStructure,
    rakePercentage,
    addPlayer,
    removePlayer,
    addBuyIn,
    addRebuy,
    addAddon,
    eliminatePlayer,
    reactivatePlayer,
    setBuyInValue,
    setRebuyValue,
    setAddonValue,
    setStartingStack,
    setRebuyStack,
    setAddonStack,
    setPayoutStructure,
    setRakePercentage,
    getStats,
    getPayouts,
  } = useAdminStore();

  const stats = getStats();
  const payouts = getPayouts();
  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated).sort((a, b) => (a.position || 999) - (b.position || 999)); // Ordem crescente: 1º, 2º, 3º...

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-7xl w-full max-h-[95vh] flex flex-col overflow-hidden border-2 border-emerald-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-800 p-6 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl font-display font-bold text-white">Administração do Torneio</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowPayouts(!showPayouts);
                setShowConfig(false);
              }}
              className={`${
                showPayouts ? 'bg-yellow-700' : 'bg-slate-700'
              } hover:bg-yellow-600 text-white p-3 rounded-xl transition-all`}
              title="Premiações"
            >
              <Award className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setShowConfig(!showConfig);
                setShowPayouts(false);
              }}
              className={`${
                showConfig ? 'bg-emerald-700' : 'bg-slate-700'
              } hover:bg-slate-600 text-white p-3 rounded-xl transition-all`}
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showPayouts ? (
            /* Premiações */
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-8 h-8 text-yellow-400" />
                Estrutura de Premiações
              </h3>

              {/* Seletor de Estrutura */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <h4 className="text-yellow-400 font-bold mb-4">📋 Estrutura de Pagamento</h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">Estrutura</label>
                    <select
                      value={selectedPayoutStructure}
                      onChange={(e) => setPayoutStructure(e.target.value)}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-yellow-500 focus:outline-none"
                    >
                      {Object.entries(PAYOUT_STRUCTURES).map(([key, structure]) => (
                        <option key={key} value={key}>
                          {structure.name} - Top {structure.positions}
                        </option>
                      ))}
                    </select>
                    {stats.totalPlayers > 0 && (
                      <button
                        onClick={() => setPayoutStructure(suggestPayoutStructure(stats.totalPlayers))}
                        className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm font-bold"
                      >
                        💡 Sugerir estrutura ({stats.totalPlayers} jogadores)
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">Rake / Taxa da Casa (%)</label>
                    <input
                      type="number"
                      value={rakePercentage}
                      onChange={(e) => setRakePercentage(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-yellow-500 focus:outline-none"
                      min="0"
                      max="20"
                      step="0.5"
                    />
                  </div>
                </div>

                {/* Resumo do Prize Pool */}
                {payouts && (
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="text-slate-400 text-sm mb-1">Prize Pool Total</div>
                      <div className="text-2xl font-bold text-white">R$ {payouts.prizePool.toFixed(2)}</div>
                    </div>
                    {payouts.rake > 0 && (
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="text-slate-400 text-sm mb-1">Rake ({rakePercentage}%)</div>
                        <div className="text-2xl font-bold text-red-400">- R$ {payouts.rake.toFixed(2)}</div>
                      </div>
                    )}
                    <div className="bg-slate-800 rounded-lg p-4 border border-yellow-700">
                      <div className="text-yellow-400 text-sm mb-1">Prize Pool Líquido</div>
                      <div className="text-2xl font-bold text-yellow-400">R$ {payouts.netPrizePool.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabela de Premiações */}
              {payouts && (
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                  <h4 className="text-yellow-400 font-bold mb-4">🏆 Distribuição de Prêmios</h4>
                  
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-3 gap-4 text-sm font-bold text-yellow-400 border-b border-slate-700 pb-3">
                      <div>POSIÇÃO</div>
                      <div className="text-right">PERCENTUAL</div>
                      <div className="text-right">PRÊMIO</div>
                    </div>

                    {/* Rows */}
                    {payouts.payouts.map((payout) => {
                      const eliminatedPlayer = eliminatedPlayers.find(p => p.position === payout.position);
                      
                      return (
                        <div
                          key={payout.position}
                          className={`grid grid-cols-3 gap-4 py-4 rounded-lg transition-all ${
                            payout.position === 1
                              ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-2 border-yellow-600'
                              : payout.position === 2
                              ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-2 border-slate-500'
                              : payout.position === 3
                              ? 'bg-gradient-to-r from-amber-900 to-amber-800 border-2 border-amber-700'
                              : 'bg-slate-800 bg-opacity-50 border border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 px-4">
                            <div className={`text-3xl ${
                              payout.position === 1 ? 'text-yellow-400' :
                              payout.position === 2 ? 'text-slate-300' :
                              payout.position === 3 ? 'text-amber-600' :
                              'text-slate-500'
                            }`}>
                              {payout.position === 1 ? '🥇' :
                               payout.position === 2 ? '🥈' :
                               payout.position === 3 ? '🥉' :
                               `#${payout.position}`}
                            </div>
                            {eliminatedPlayer && (
                              <div className="text-white font-bold">{eliminatedPlayer.name}</div>
                            )}
                          </div>
                          <div className="text-right text-lg font-bold text-white px-4">
                            {payout.percentage}%
                          </div>
                          <div className={`text-right text-xl font-bold px-4 ${
                            payout.position === 1 ? 'text-yellow-400' : 'text-white'
                          }`}>
                            R$ {payout.amount.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!payouts && (
                <div className="text-center text-slate-500 py-12">
                  Adicione jogadores para calcular as premiações
                </div>
              )}

              <button
                onClick={() => setShowPayouts(false)}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                VOLTAR
              </button>
            </div>
          ) : showConfig ? (
            /* Configurações */
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">⚙️ Configurações</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Valores */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                  <h4 className="text-emerald-400 font-bold mb-4">💰 Valores (R$)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Buy-in</label>
                      <input
                        type="number"
                        value={buyInValue}
                        onChange={(e) => setBuyInValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Rebuy</label>
                      <input
                        type="number"
                        value={rebuyValue}
                        onChange={(e) => setRebuyValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Add-on</label>
                      <input
                        type="number"
                        value={addonValue}
                        onChange={(e) => setAddonValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Stacks */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                  <h4 className="text-emerald-400 font-bold mb-4">🎰 Fichas</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Stack Inicial</label>
                      <input
                        type="number"
                        value={startingStack}
                        onChange={(e) => setStartingStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Stack Rebuy</label>
                      <input
                        type="number"
                        value={rebuyStack}
                        onChange={(e) => setRebuyStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="1000"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-2">Stack Add-on</label>
                      <input
                        type="number"
                        value={addonStack}
                        onChange={(e) => setAddonStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowConfig(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                VOLTAR
              </button>
            </div>
          ) : (
            /* Dashboard Principal */
            <div className="space-y-6">
              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-blue-300" />
                    <span className="text-blue-300 text-sm font-bold">JOGADORES</span>
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.totalPlayers}</div>
                  <div className="text-blue-300 text-xs mt-1">{stats.activePlayers} ativos</div>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                    <span className="text-green-300 text-sm font-bold">ENTRADAS</span>
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.totalEntries}</div>
                  <div className="text-green-300 text-xs mt-1">{stats.totalRebuys} rebuys</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-xl p-6 border border-yellow-700">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-yellow-300" />
                    <span className="text-yellow-300 text-sm font-bold">PRIZE POOL</span>
                  </div>
                  <div className="text-4xl font-bold text-white">R$ {stats.prizePool}</div>
                  <div className="text-yellow-300 text-xs mt-1">{stats.totalAddons} add-ons</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-6 h-6 text-purple-300" />
                    <span className="text-purple-300 text-sm font-bold">STACK MÉDIO</span>
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.averageStack.toLocaleString()}</div>
                  <div className="text-purple-300 text-xs mt-1">{stats.totalChipsInPlay.toLocaleString()} total</div>
                </div>
              </div>

              {/* Adicionar Jogador */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Jogador
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                    placeholder="Nome do jogador..."
                    className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddPlayer}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
                  >
                    ADICIONAR
                  </button>
                </div>
              </div>

              {/* Configuração Rápida de Stacks e Valores */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Buy-in */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                  <h4 className="text-emerald-400 font-bold text-sm mb-3">💵 BUY-IN</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        value={buyInValue}
                        onChange={(e) => setBuyInValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none text-sm"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Stack Inicial</label>
                      <input
                        type="number"
                        value={startingStack}
                        onChange={(e) => setStartingStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none text-sm"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Rebuy */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                  <h4 className="text-blue-400 font-bold text-sm mb-3">🔄 REBUY</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        value={rebuyValue}
                        onChange={(e) => setRebuyValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none text-sm"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Stack Rebuy</label>
                      <input
                        type="number"
                        value={rebuyStack}
                        onChange={(e) => setRebuyStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none text-sm"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Add-on */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                  <h4 className="text-purple-400 font-bold text-sm mb-3">⭐ ADD-ON</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        value={addonValue}
                        onChange={(e) => setAddonValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none text-sm"
                        step="10"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs block mb-1">Stack Add-on</label>
                      <input
                        type="number"
                        value={addonStack}
                        onChange={(e) => setAddonStack(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none text-sm"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Jogadores Ativos */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Jogadores Ativos ({activePlayers.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {activePlayers.map((player) => (
                      <div key={player.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-white font-bold text-lg">{player.name}</div>
                            <div className="text-slate-400 text-sm">
                              R$ {player.totalInvested} • {player.buyIns + player.rebuys} entradas
                            </div>
                          </div>
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addRebuy(player.id)}
                            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-bold"
                          >
                            + REBUY
                          </button>
                          <button
                            onClick={() => addAddon(player.id)}
                            className="flex-1 bg-purple-900 hover:bg-purple-800 text-white px-3 py-2 rounded text-xs font-bold"
                          >
                            + ADD-ON
                          </button>
                          <button
                            onClick={() => eliminatePlayer(player.id)}
                            className="flex-1 bg-red-900 hover:bg-red-800 text-white px-3 py-2 rounded text-xs font-bold"
                          >
                            ELIMINAR
                          </button>
                        </div>
                        <div className="mt-2 flex gap-3 text-xs text-slate-500">
                          <span>Buy-ins: {player.buyIns}</span>
                          <span>Rebuys: {player.rebuys}</span>
                          <span>Add-ons: {player.addons}</span>
                        </div>
                      </div>
                    ))}
                    {activePlayers.length === 0 && (
                      <div className="text-center text-slate-500 py-8">
                        Nenhum jogador ativo
                      </div>
                    )}
                  </div>
                </div>

                {/* Jogadores Eliminados */}
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Eliminados ({eliminatedPlayers.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {eliminatedPlayers.map((player) => {
                      // Busca a premiação do jogador se houver
                      const playerPayout = payouts?.payouts.find(p => p.position === player.position);
                      
                      return (
                        <div key={player.id} className="bg-slate-800 bg-opacity-50 rounded-lg p-4 border border-slate-700">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-bold text-lg ${
                                  player.position === 1 ? 'text-yellow-400' :
                                  player.position === 2 ? 'text-slate-300' :
                                  player.position === 3 ? 'text-amber-500' :
                                  'text-slate-400'
                                }`}>
                                  {player.position === 1 ? '🥇' :
                                   player.position === 2 ? '🥈' :
                                   player.position === 3 ? '🥉' :
                                   `#${player.position}`}
                                </span>
                                <div className="text-slate-300 font-bold">{player.name}</div>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-500">
                                  Investiu: R$ {player.totalInvested}
                                </span>
                                {playerPayout && (
                                  <>
                                    <span className="text-slate-600">•</span>
                                    <span className={`font-bold ${
                                      player.position === 1 ? 'text-yellow-400' :
                                      player.position === 2 ? 'text-slate-300' :
                                      player.position === 3 ? 'text-amber-500' :
                                      'text-green-400'
                                    }`}>
                                      Premiou: R$ {playerPayout.amount.toFixed(2)}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className={`text-xs ${
                                      playerPayout.amount > player.totalInvested 
                                        ? 'text-green-400' 
                                        : 'text-red-400'
                                    }`}>
                                      {playerPayout.amount > player.totalInvested ? '↑' : '↓'} R$ {Math.abs(playerPayout.amount - player.totalInvested).toFixed(2)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => reactivatePlayer(player.id)}
                              className="text-green-400 hover:text-green-300 text-xs font-bold"
                            >
                              REATIVAR
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {eliminatedPlayers.length === 0 && (
                      <div className="text-center text-slate-500 py-8">
                        Nenhum jogador eliminado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 border-t border-slate-700 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500
                     text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
}