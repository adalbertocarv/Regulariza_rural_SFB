import { useState, useEffect } from 'react';
import { AreaChart, Download, FileText, Info, Plus, Minus, Leaf, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, EstatisticaDashboard, PerguntaFrequente } from '../lib/api';

export default function Resultados() {
  const [mapMode, setMapMode] = useState<'satelite' | 'calor'>('calor');
  const [activeDocSector, setActiveDocSector] = useState<'validado' | 'analise' | 'pendente' | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [stats, setStats] = useState<EstatisticaDashboard[]>([]);
  const [faqs, setFaqs] = useState<PerguntaFrequente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getFaqs()])
      .then(([statsData, faqsData]) => {
        setStats(statsData);
        setFaqs(faqsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const monthlyStats: Record<string, { label: string; height: string; value: string }> = {
    Jan: { label: 'Janeiro', height: 'h-[40%]', value: '540 ha' },
    Mar: { label: 'Março', height: 'h-[55%]', value: '780 ha' },
    Mai: { label: 'Maio', height: 'h-[75%]', value: '1.250 ha' },
    Jul: { label: 'Julho', height: 'h-[60%]', value: '1.020 ha' },
    Set: { label: 'Setembro', height: 'h-[85%]', value: '1.890 ha' },
    Nov: { label: 'Novembro', height: 'h-[95%]', value: '2.450 ha' },
  };

  const handleExportTrigger = (type: 'excel' | 'pdf') => {
    if (exporting) return;
    setExporting(true);
    setExportType(type);
    setProgress(0);
    setShowToast(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setExportType(null);
            setShowToast(true);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const getStatValue = (key: string, defaultVal: string) => {
    const found = stats.find((s) => s.nomeChave === key);
    if (!found || !found.valor) return defaultVal;
    return `${found.valor}${found.unidade || ''}`;
  };

  return (
    <div className="bg-preto-5 text-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-8 sm:mt-12">
        {/* Title */}
        <section className="text-center py-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-preto-10 text-destaque-1 rounded-sm text-[10px] font-mono font-bold mb-6 tracking-[0.16em] select-none uppercase bg-white">
            <AreaChart className="w-3.5 h-3.5 text-destaque-1" />
            Transparência e Dados Integrados
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-black tracking-tight mb-6">
            Painel de Dados <span className="font-serif italic text-destaque-1">Interativo</span>
          </h1>
          <p className="text-stone-700 font-sans text-sm max-w-2xl leading-relaxed mx-auto">
            Acompanhe em tempo real os eixos consolidados de conformidade florestal rústica em todo o Brasil.
          </p>
        </section>

        {/* Dynamic Metrics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 select-none">
          <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs hover:border-destaque-1/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-[0.2em] block mb-2">Áreas Mapeadas</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-destaque-1">{getStatValue('areas_mapeadas', '12.450 ha')}</div>
          </div>
          <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs hover:border-destaque-1/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-[0.2em] block mb-2">Processos Ativos</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-destaque-2">{getStatValue('processos_ativos', '842')}</div>
          </div>
          <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs hover:border-destaque-1/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-[0.2em] block mb-2">Índice de Regularidade</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-destaque-1">{getStatValue('indice_regularidade', '78%')}</div>
          </div>
          <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs hover:border-destaque-1/40 transition-all">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-[0.2em] block mb-2">Municípios Monitorados</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-destaque-2">{getStatValue('municipios_atendidos', '15')}</div>
          </div>
        </section>

        {/* Bento Grid: Panorama */}
        <section className="py-24 bg-white border-t border-b border-preto-10 mb-16 rounded-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
              <div className="max-w-2xl">
                <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Resultados Globais</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-tight">Panorama da Regularização</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
              <div className="md:col-span-2 bg-preto-5 p-8 rounded-sm flex flex-col justify-between border border-preto-10 shadow-xs">
                <div>
                  <div className="w-10 h-10 border border-destaque-1/20 text-destaque-1 bg-destaque-1/5 rounded-none flex items-center justify-center mb-6">
                    <Leaf className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-serif text-black mb-2 font-bold">APP - Áreas de Preservação</h3>
                  <p className="text-black/60 text-xs">Monitoramento temporal sistemático de matas de galeria e declividades protegidas.</p>
                </div>
                <div className="text-5xl font-serif font-bold text-destaque-1 mt-8">
                  42.5M <span className="text-xs font-mono font-bold tracking-wider text-black/40">HA</span>
                </div>
              </div>

              <div className="md:col-span-1 bg-fundo-escuro text-white p-8 rounded-sm flex flex-col justify-between shadow-xs relative overflow-hidden">
                <div>
                  <span className="text-[10px] font-mono font-bold text-destaque-1 uppercase tracking-widest mb-1.5 block">Nacional</span>
                  <h3 className="text-xl font-serif text-white mb-2 font-bold italic">Reserva Legal</h3>
                  <p className="text-white/70 text-xs leading-relaxed font-light">Percentuais de reserva legal consolidados em imóveis analisados.</p>
                </div>
                <div className="text-4xl font-serif font-bold text-destaque-1 mt-8">
                  128.3M <span className="text-xs font-mono font-bold tracking-wider text-white/40">HA</span>
                </div>
              </div>

              <div className="md:col-span-1 md:row-span-2 bg-fundo-escuro text-white rounded-sm overflow-hidden relative group shadow-xs flex flex-col justify-end min-h-[320px]">
                <img
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQlxYnIzPTil9XLAKHdu74bVfnIHayerYgU78ouSPcZNnZRyseKJIU5tse_HdDOTxzl1dQTx-VBOlZDPGW23utkzknuxKdWHhiXh4f14AQeE38KgqXzLT6YaB-BCvu2POiU9qN6RCb6fBUixjaAm8bMZF1CJTsjfH7TfgRJeJQRYIPYfsl6WDZRjJObGX9bjjaHfNDRh-NSi7eMbq_XxsVg8sdTIkzH1Ehufepvm8Hkxkq--POTJ1l9FIBMkvIZzzI0OCdyiJYv"
                  alt="Abrangência"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fundo-escuro/90 via-fundo-escuro/10 to-transparent z-20" />
                <div className="relative p-6 z-30 space-y-1">
                  <p className="text-white font-serif font-bold text-lg">Abrangência</p>
                  <p className="text-destaque-1 font-mono text-[9px] uppercase tracking-wider font-extrabold font-bold">26 Estados + DF monitorados</p>
                </div>
              </div>

              <div className="md:col-span-1 bg-preto-5 p-8 rounded-sm flex flex-col justify-between border border-preto-10 shadow-xs">
                <div>
                  <h3 className="text-xl font-serif text-black mb-2 font-bold">AUR</h3>
                  <p className="text-black/60 text-xs">Área de Uso Restrito delineadas em biomas sob proteção especial.</p>
                </div>
                <div className="text-4xl font-serif font-bold text-destaque-2 mt-6">
                  15.8M <span className="text-xs font-mono font-bold tracking-wider text-black/40">HA</span>
                </div>
              </div>

              <div className="md:col-span-2 bg-preto-5 p-8 rounded-sm border border-preto-10 shadow-xs justify-between flex flex-col">
                <h3 className="text-[10px] font-mono text-destaque-1 mb-4 uppercase tracking-[0.18em] font-bold">Principais Estados em Regularização</h3>
                <div className="flex flex-wrap gap-2">
                  {['Mato Grosso (MT)', 'Pará (PA)', 'Minas Gerais (MG)', 'Goiás (GO)', 'Mato Grosso do Sul (MS)', 'Tocantins (TO)', 'Bahia (BA)'].map((st) => (
                    <span key={st} className="bg-white text-black hover:text-destaque-1 px-4 py-2.5 rounded-sm font-mono text-[9px] uppercase font-bold tracking-wider border border-preto-10 transition-colors">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heatmap & Charts */}
        <section id="geoportal-mapa" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex flex-col justify-between min-h-[520px] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 z-10 gap-4">
              <div>
                <h3 className="text-lg font-serif text-black font-bold">Concentração de Atividades Geográficas</h3>
                <p className="text-stone-500 text-xs mt-1">Comparação de vistorias deferidas vs. pendentes com base de calor.</p>
              </div>
              <div className="flex gap-1 p-1 bg-preto-10 rounded-sm select-none shrink-0 border border-preto-10">
                <button
                  onClick={() => setMapMode('satelite')}
                  className={`px-3 py-1.5 rounded-sm text-[9px] font-mono uppercase tracking-widest font-extrabold cursor-pointer transition-all ${
                    mapMode === 'satelite' ? 'bg-destaque-1 text-white shadow-sm' : 'text-stone-600 hover:text-destaque-1'
                  }`}
                >
                  Satélite
                </button>
                <button
                  onClick={() => setMapMode('calor')}
                  className={`px-3 py-1.5 rounded-sm text-[9px] font-mono uppercase tracking-widest font-extrabold cursor-pointer transition-all ${
                    mapMode === 'calor' ? 'bg-destaque-1 text-white shadow-sm' : 'text-stone-600 hover:text-destaque-1'
                  }`}
                >
                  Calor
                </button>
              </div>
            </div>

            <div className="absolute inset-0 pt-24 pb-6 px-6 z-0 pointer-events-none select-none">
              <div className="w-full h-full rounded-sm overflow-hidden relative border border-preto-10">
                <img
                  className="w-full h-full object-cover grayscale brightness-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIG4-lR7-ZvASX6iDatOTugLipSU1IVVG4FRS3fNpAYPk1fLGmZj1lZouEgc6wZyjpuk6r_irrcCz8klHnkMT2um55pIPJ7fquPglZjDMtP9vitoFmwy-41aVL79Z3oUOkkoFKTgqfkM4PTg3rz2az-IF5EYadc8h7ixK_U9AA-in36u2BFBVgGUM5pBdYTS-z08Zs8UnlsFz15osms9mtRBibmUg7_TQG6Nm01uR-UKkPncvm0a-sm6SR_wohniVM74ASd4YOmhA"
                  alt="Georeferenciamento"
                />
                <AnimatePresence>
                  {mapMode === 'calor' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.45 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#038E5C] via-[#1A68FF] to-transparent mix-blend-overlay pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="z-10 mt-auto bg-white/95 backdrop-blur-xs p-4 rounded-sm border border-preto-10 flex justify-between items-center text-xs text-stone-600">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${mapMode === 'calor' ? 'bg-destaque-1 animate-ping' : 'bg-destaque-1 animate-pulse'}`} />
                <span className="font-bold">Mostrando: {mapMode === 'calor' ? 'Indicador de calor' : 'Satélite óptico SAR'}</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-destaque-1 uppercase tracking-[0.15em] hidden sm:inline">26 ESTADOS ATIVOS</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-mono font-bold text-stone-500 mb-4 uppercase tracking-[0.18em] block">Status da Documentação</h4>
                <div className="flex items-center justify-center py-6 select-none relative">
                  <svg className="w-36 h-36" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f3f1" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="transparent"
                      stroke="#038E5C"
                      strokeWidth={activeDocSector === 'validado' ? '10' : '8'}
                      strokeDasharray="163.2 251.2"
                      strokeDashoffset="0"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setActiveDocSector('validado')}
                      onMouseLeave={() => setActiveDocSector(null)}
                    />
                    <circle
                      cx="50" cy="50" r="40" fill="transparent"
                      stroke="#1A68FF"
                      strokeWidth={activeDocSector === 'analise' ? '10' : '8'}
                      strokeDasharray="50.2 251.2"
                      strokeDashoffset="-163.2"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setActiveDocSector('analise')}
                      onMouseLeave={() => setActiveDocSector(null)}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="block text-2xl font-serif text-black font-bold">
                      {activeDocSector === 'validado' ? '65%' : activeDocSector === 'analise' ? '20%' : '65%'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-destaque-1 uppercase tracking-[0.15em] block mt-1">
                      {activeDocSector === 'validado' ? 'VALIDADOS' : activeDocSector === 'analise' ? 'ANÁLISE' : 'MÉDIA'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-preto-10 pt-4 text-xs font-semibold font-mono">
                <div className="flex justify-between items-center p-1 cursor-pointer">
                  <span className="flex items-center gap-2 uppercase tracking-wide text-stone-700 font-bold"><span className="w-2.5 h-2.5 bg-destaque-1" /> Validado</span>
                  <span className="font-bold text-destaque-1">65%</span>
                </div>
                <div className="flex justify-between items-center p-1 cursor-pointer">
                  <span className="flex items-center gap-2 uppercase tracking-wide text-stone-700 font-bold"><span className="w-2.5 h-2.5 bg-destaque-2" /> Em Análise</span>
                  <span className="font-bold text-destaque-2">20%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-[0.18em] mb-4 block">Evolução Mensal</h4>
                <div className="h-32 flex items-end justify-between gap-3 relative select-none">
                  {Object.keys(monthlyStats).map((monthKey) => {
                    const monthObj = monthlyStats[monthKey];
                    const isHovered = hoveredMonth === monthKey;
                    return (
                      <div
                        key={monthKey}
                        className="relative w-full h-full flex flex-col justify-end items-center group cursor-pointer"
                        onMouseEnter={() => setHoveredMonth(monthKey)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      >
                        <div className={`w-full transition-all duration-200 ${isHovered ? 'bg-destaque-1' : 'bg-preto-10'} ${monthObj.height}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical export loading / downloads */}
        <section className="bg-preto-10/40 py-16 -mx-6 sm:-mx-8 px-6 sm:px-8 border-y border-preto-10 select-none relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-fundo-escuro text-white p-8 sm:p-12 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xs">
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">Exportação de Relatórios Técnicos</h2>
                <p className="text-white/80 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
                  Baixe estatísticas completas consolidadas em formatos eletrônicos padronizados.
                </p>

                <AnimatePresence>
                  {exporting && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-destaque-1">
                        <span>Gerando {exportType === 'excel' ? 'Planilha CSV' : 'Relatório PDF'}...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
                        <div className="h-full bg-destaque-1 transition-all duration-150" style={{ width: `${progress}%` }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleExportTrigger('excel')}
                  disabled={exporting}
                  className="bg-white text-black hover:bg-preto-5 font-mono uppercase tracking-[0.16em] text-[10px] font-bold px-6 py-4 rounded-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-destaque-1" />
                  Planilha (CSV)
                </button>
                <button
                  onClick={() => handleExportTrigger('pdf')}
                  disabled={exporting}
                  className="border-2 border-destaque-1/40 hover:bg-destaque-1/10 text-white font-mono uppercase tracking-[0.16em] text-[10px] font-bold px-6 py-4 rounded-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-destaque-1" />
                  Relatório PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white text-black p-4 rounded-sm shadow-2xl flex items-center gap-3.5 max-w-md border border-preto-10"
              >
                <div>
                  <h4 className="font-bold text-sm text-destaque-1 mb-0.5">Download Concluído!</h4>
                  <p className="text-stone-600 text-xs font-sans">Arquivo gerado com sucesso.</p>
                </div>
                <button onClick={() => setShowToast(false)} className="text-xs font-mono uppercase text-destaque-1 font-bold pl-4">[fechar]</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FAQs */}
        <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-white border-t border-preto-10 mt-12 rounded-sm shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase block font-bold">Metodologia</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black leading-tight">Dúvidas sobre os dados</h2>
              <p className="text-stone-700 font-sans text-sm leading-relaxed">
                Nossa validação técnica de poligonais segue de forma rigorosa as instruções normativas do INCRA e órgãos estaduais.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.id} className={`rounded-sm transition-all border ${isOpen ? 'bg-preto-5 border-destaque-1' : 'bg-white border-preto-10'}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left font-serif text-sm sm:text-base flex justify-between items-center cursor-pointer"
                    >
                      <span className={`font-bold ${isOpen ? 'text-destaque-1' : 'text-stone-800'}`}>{item.pergunta}</span>
                      {isOpen ? <Minus className="w-3.5 h-3.5 text-destaque-1" /> : <Plus className="w-3.5 h-3.5 text-stone-600" />}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-6 pb-6 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed border-t border-preto-10 pt-4">
                            {item.resposta}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
