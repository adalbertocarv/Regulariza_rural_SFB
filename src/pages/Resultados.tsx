import { useState, useEffect } from 'react';
import { Download, FileText, ChevronDown, ChevronUp, User, BookOpen, Loader2 } from 'lucide-react';
import { api, DashboardStat, Faq } from '../lib/api';

const PANEL_STAT_KEYS = ['areas_mapeadas', 'processos_ativos', 'indice_regularidade', 'municipios_atendidos'];

const monthlyData = [
  { month: 'Jan', value: 35 }, { month: 'Mar', value: 45 }, { month: 'Mai', value: 55 },
  { month: 'Jul', value: 75 }, { month: 'Set', value: 95 }, { month: 'Nov', value: 105 },
];

const STAT_LABELS: Record<string, string> = {
  areas_mapeadas: 'Áreas Mapeadas',
  processos_ativos: 'Processos Ativos',
  indice_regularidade: 'Índice de Regularidade',
  municipios_atendidos: 'Municípios Atendidos',
};

export default function Resultados() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    Promise.all([api.getStats(), api.getFaqs()]).then(([statsData, faqsData]) => {
      setStats(statsData);
      setFaqs(faqsData);
    }).finally(() => setLoading(false));
  }, []);

  const panelStats = stats.filter((s) => PANEL_STAT_KEYS.includes(s.keyName));
  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  return (
    <main className="pt-16 bg-white">
      {/* Header Section */}
      <section className="text-center py-16">
        <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">TRANSPARÊNCIA E DADOS</div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Painel de Dados <span className="text-green-700">Interativo</span></h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Acompanhe em tempo real o progresso da regularização ambiental e fundiária. Nossa plataforma utiliza geotecnologia de ponta para fornecer métricas precisas sobre o território rural.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {panelStats.map((stat) => (
              <div key={stat.keyName} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="text-sm text-gray-600 mb-2">{STAT_LABELS[stat.keyName] || stat.keyName}</div>
                <div className={`text-3xl font-bold ${stat.colorClass || 'text-green-700'}`}>
                  {stat.value}
                  {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Map and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Heatmap */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mapa de Calor: Concentração de Atividades</h3>
                  <p className="text-sm text-gray-500 mt-1">Distribuição geográfica das regularizações pendentes vs. concluídas</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold px-3 py-1 rounded border border-gray-200 text-gray-700">Satélite</button>
                  <button className="text-xs font-semibold px-3 py-1 rounded bg-green-700 text-white">Calor</button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg h-72 overflow-hidden">
                <img src="https://images.pexels.com/photos/2393220/pexels-photo-2393220.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Mapa" className="w-full h-full object-cover opacity-70" />
              </div>
            </div>

            {/* Monthly Evolution Chart */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Evolução Mensal</h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {monthlyData.map((item) => (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-t-lg relative group" style={{ height: '100%' }}>
                      <div className="w-full bg-green-700 rounded-t-lg transition-all hover:bg-green-800 absolute bottom-0" style={{ height: `${(item.value / maxValue) * 100}%` }}>
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">{item.value}</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 mt-3">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Status and Export */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Status da Documentação</h3>
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#15803d" strokeWidth="12" strokeDasharray={`${(65 / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-900">65%</div>
                    <div className="text-xs text-gray-500 mt-1">VALIDADO</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[{ status: 'Validado', pct: 65, color: 'bg-green-700' }, { status: 'Em Análise', pct: 20, color: 'bg-blue-600' }, { status: 'Pendente', pct: 15, color: 'bg-gray-400' }].map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.status}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Exportação de Relatórios Técnicos</h3>
              <p className="text-sm text-green-100 mb-6">Baixe o conjunto completo de dados em formatos estruturados para auditoria externa.</p>
              <div className="space-y-3">
                <button className="w-full bg-white text-green-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"><Download className="w-4 h-4" /> Planilha (CSV/XLSX)</button>
                <button className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-colors border border-green-500"><FileText className="w-4 h-4" /> Relatório PDF</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dúvidas sobre os dados</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Nossa metodologia de coleta de dados segue os padrões do INCRA e órgãos estaduais. Se você encontrar inconsistências ou precisar de auxílio técnico, nossa equipe está disponível.</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0"><div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100"><User className="w-5 h-5 text-blue-600" /></div></div>
                <div><h4 className="font-bold text-gray-900 mb-1">Suporte Especializado</h4><p className="text-sm text-gray-600">Atendimento por engenheiros agrimensores de Seg-Sex, 9h às 18h.</p></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0"><div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100"><BookOpen className="w-5 h-5 text-green-600" /></div></div>
                <div><h4 className="font-bold text-gray-900 mb-1">Guia Metodológico</h4><p className="text-sm text-gray-600">Acesse o documento completo de como processamos os dados de satélite.</p></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
            ) : (
              faqs.map((faq, index) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors font-medium text-gray-900">
                    {faq.question}
                    {expandedFaq === index ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 leading-relaxed border-t border-gray-200">{faq.answer}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
