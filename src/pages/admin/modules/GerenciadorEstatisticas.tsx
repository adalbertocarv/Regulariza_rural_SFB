import { useState, useEffect } from 'react';
import { Loader2, Save, Check } from 'lucide-react';
import { api, adminApi, DashboardStat } from '../../../lib/api';

const STAT_LABELS: Record<string, string> = {
  hectares_preservados: 'Hectares Preservados (Home)',
  produtores_atendidos: 'Produtores Atendidos (Home)',
  indice_regularidade: 'Índice de Regularidade (Home)',
  car_processados: 'CAR Processados (Home)',
  areas_mapeadas: 'Áreas Mapeadas (Painel)',
  processos_ativos: 'Processos Ativos (Painel)',
  municipios_atendidos: 'Municípios Atendidos (Painel)',
};

export default function GerenciadorEstatisticas() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { value: string; unit: string }>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
      const initial: Record<string, { value: string; unit: string }> = {};
      data.forEach((s) => { initial[s.keyName] = { value: s.value || '', unit: s.unit || '' }; });
      setEdits(initial);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (keyName: string) => {
    setSaving(keyName);
    try {
      await adminApi.updateStat(keyName, edits[keyName]);
      setSaved(keyName);
      setTimeout(() => setSaved(null), 2000);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Métricas do Painel</h2>
        <p className="text-sm text-gray-500">Edite os valores exibidos na Home e no Painel de Dados</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {STAT_LABELS[stat.keyName] || stat.keyName}
                  </label>
                  <div className="text-xs text-gray-400 font-mono mb-3">key: {stat.keyName}</div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Valor</label>
                      <input
                        id={`stat-${stat.keyName}-value`}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={edits[stat.keyName]?.value || ''}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [stat.keyName]: { ...prev[stat.keyName], value: e.target.value } }))}
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-xs text-gray-500 mb-1 block">Unidade</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={edits[stat.keyName]?.unit || ''}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [stat.keyName]: { ...prev[stat.keyName], unit: e.target.value } }))}
                        placeholder="ha, %, ..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSave(stat.keyName)}
                  disabled={saving === stat.keyName}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    saved === stat.keyName
                      ? 'bg-green-100 text-green-700'
                      : 'bg-green-700 hover:bg-green-800 text-white'
                  } disabled:opacity-60`}
                >
                  {saving === stat.keyName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved === stat.keyName ? (
                    <><Check className="w-4 h-4" /> Salvo!</>
                  ) : (
                    <><Save className="w-4 h-4" /> Salvar</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
