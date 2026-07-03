import { useState, useEffect } from 'react';
import { Loader2, Save, Check, BarChart3 } from 'lucide-react';
import { api, adminApi, EstatisticaDashboard } from '../../../lib/api';

const STAT_LABELS: Record<string, { label: string; overline: string }> = {
  hectares_preservados: { label: 'Hectares Preservados', overline: 'Home — Destaque' },
  produtores_atendidos: { label: 'Produtores Atendidos', overline: 'Home — Destaque' },
  indice_regularidade:  { label: 'Índice de Regularidade', overline: 'Home — Destaque' },
  car_processados:      { label: 'CAR Processados', overline: 'Home — Destaque' },
  areas_mapeadas:       { label: 'Áreas Mapeadas', overline: 'Painel de Dados' },
  processos_ativos:     { label: 'Processos Ativos', overline: 'Painel de Dados' },
  municipios_atendidos: { label: 'Municípios Atendidos', overline: 'Painel de Dados' },
};

export default function GerenciadorEstatisticas() {
  const [stats, setStats]   = useState<EstatisticaDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved]   = useState<string | null>(null);
  const [edits, setEdits]   = useState<Record<string, { valor: string; unidade: string }>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
      const initial: Record<string, { valor: string; unidade: string }> = {};
      data.forEach((s) => { initial[s.nomeChave] = { valor: s.valor || '', unidade: s.unidade || '' }; });
      setEdits(initial);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (nomeChave: string) => {
    setSaving(nomeChave);
    try {
      await adminApi.updateStat(nomeChave, edits[nomeChave]);
      setSaved(nomeChave);
      setTimeout(() => setSaved(null), 2000);
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSaving(null); }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">Indicadores do Projeto</span>
        <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Métricas</h2>
        <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : stats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-preto-10">
          <BarChart3 className="w-10 h-10 text-black/10" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhuma métrica encontrada no banco</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {stats.map((stat) => {
            const meta = STAT_LABELS[stat.nomeChave];
            const isSaving = saving === stat.nomeChave;
            const isSaved  = saved === stat.nomeChave;
            return (
              <div key={stat.id} className="bg-white border border-preto-10 p-5 hover:border-destaque-1/30 transition-colors">
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-destaque-1 font-mono uppercase tracking-[0.2em] text-[8px] font-bold block mb-0.5">
                      {meta?.overline || 'Indicador'}
                    </span>
                    <div className="font-serif font-bold text-black text-sm">{meta?.label || stat.nomeChave}</div>
                    <div className="text-[8px] font-mono text-black/25 mt-1 uppercase tracking-wider">key: {stat.nomeChave}</div>
                  </div>
                  {/* Live preview */}
                  <div className="text-right">
                    <div className="font-serif font-bold text-2xl text-destaque-1 leading-none">
                      {edits[stat.nomeChave]?.valor || '—'}
                    </div>
                    <div className="text-[9px] font-mono text-black/30 uppercase tracking-wider mt-0.5">
                      {edits[stat.nomeChave]?.unidade || ''}
                    </div>
                  </div>
                </div>

                {/* Edit fields */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block font-mono uppercase tracking-[0.15em] text-[8px] text-black/35 font-bold mb-1.5">Valor</label>
                    <input
                      id={`stat-${stat.nomeChave}-value`}
                      className="w-full px-3 py-2 border border-preto-10 bg-preto-5 text-sm focus:outline-none focus:border-destaque-1 focus:ring-1 focus:ring-destaque-1/20 transition-all font-sans"
                      value={edits[stat.nomeChave]?.valor || ''}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [stat.nomeChave]: { ...prev[stat.nomeChave], valor: e.target.value } }))}
                    />
                  </div>
                  <div className="w-28">
                    <label className="block font-mono uppercase tracking-[0.15em] text-[8px] text-black/35 font-bold mb-1.5">Unidade</label>
                    <input
                      className="w-full px-3 py-2 border border-preto-10 bg-preto-5 text-sm focus:outline-none focus:border-destaque-1 focus:ring-1 focus:ring-destaque-1/20 transition-all font-sans"
                      value={edits[stat.nomeChave]?.unidade || ''}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [stat.nomeChave]: { ...prev[stat.nomeChave], unidade: e.target.value } }))}
                      placeholder="ha, %, ..."
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave(stat.nomeChave)}
                  disabled={isSaving}
                  className={`w-full flex items-center justify-center gap-2 py-2 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-all ${
                    isSaved
                      ? 'bg-destaque-1/10 text-destaque-1 border border-destaque-1/30'
                      : 'bg-destaque-1 hover:bg-destaque-1/90 text-white'
                  } disabled:opacity-60`}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isSaved ? <><Check className="w-3.5 h-3.5" /> Salvo!</> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
