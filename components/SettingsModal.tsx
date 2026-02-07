'use client';

import { useState } from 'react';
import { Download, Upload, History, Trash2, HardDrive, X } from 'lucide-react';
import { 
  exportAllData, 
  importData, 
  getTournamentHistory, 
  getSavedStructures,
  deleteTournamentHistory,
  deleteStructure,
  getStorageInfo,
  clearTournamentHistory 
} from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'history' | 'structures'>('export');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  if (!isOpen) return null;

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importData(content);
      
      setImportStatus({
        type: result.success ? 'success' : 'error',
        message: result.message
      });

      setTimeout(() => {
        setImportStatus({ type: null, message: '' });
        if (result.success) {
          window.location.reload(); // Recarrega para mostrar dados importados
        }
      }, 3000);
    };
    reader.readAsText(file);
  };

  const history = getTournamentHistory();
  const structures = getSavedStructures();
  const storageInfo = getStorageInfo();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border-2 border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-800 p-6 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
          <h2 className="text-3xl font-display font-bold text-white">Configurações & Dados</h2>
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-900">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-emerald-900 text-emerald-300 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Backup & Restore
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-900 text-emerald-300 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Histórico ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'structures'
                ? 'bg-emerald-900 text-emerald-300 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Estruturas ({structures.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Storage Info */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Armazenamento Local</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Usado</span>
                    <span className="text-white font-bold">{storageInfo.used} KB</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-full transition-all"
                      style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{storageInfo.percentage}% utilizado</span>
                    <span>{storageInfo.available} KB total</span>
                  </div>
                </div>
              </div>

              {/* Export */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Exportar Dados</h3>
                </div>
                <p className="text-slate-400 mb-4">
                  Faça backup de todos os seus torneios e estruturas em um arquivo JSON.
                </p>
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
                           text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl
                           flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar Backup
                </button>
              </div>

              {/* Import */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Upload className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Importar Dados</h3>
                </div>
                <p className="text-slate-400 mb-4">
                  Restaure um backup anterior. Os dados serão mesclados com os existentes.
                </p>
                <label className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                           text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl
                           flex items-center gap-2 cursor-pointer inline-flex">
                  <Upload className="w-5 h-5" />
                  Selecionar Arquivo
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>

                {importStatus.type && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    importStatus.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {importStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhum torneio no histórico</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-slate-400 text-sm">{history.length} torneios salvos</p>
                    <button
                      onClick={() => {
                        if (confirm('Deseja limpar todo o histórico?')) {
                          clearTournamentHistory();
                          window.location.reload();
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Tudo
                    </button>
                  </div>
                  {history.map((tournament) => (
                    <div key={tournament.id} className="bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold">{tournament?.name}</h4>
                          <p className="text-slate-400 text-sm mt-1">
                            {new Date(tournament?.startTime).toLocaleString('pt-BR')}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-slate-500">
                            <span>Nível final: {tournament?.finalLevel}</span>
                            <span>Duração: {Math.floor(tournament?.duration / 60)}min</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            deleteTournamentHistory(tournament?.id);
                            window.location.reload();
                          }}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'structures' && (
            <div className="space-y-4">
              {structures.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhuma estrutura salva</p>
                </div>
              ) : (
                structures.map((struct) => (
                  <div key={struct.id} className="bg-slate-900 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-bold">{struct.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">
                          {new Date(struct.createdAt).toLocaleString('pt-BR')}
                        </p>
                        <div className="text-xs text-slate-500 mt-2">
                          {struct.structure?.length} níveis
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteStructure(struct.id);
                          window.location.reload();
                        }}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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