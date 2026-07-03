import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Leaf, Users, Filter, Loader2, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { api, Atividade } from '../lib/api';

export default function Atividades() {
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState<'Todos' | 1 | 2 | 3 | 4>('Todos');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedDemandantes, setSelectedDemandantes] = useState<string[]>([]);
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [isComponentExpanded, setIsComponentExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [detailedActivity, setDetailedActivity] = useState<Atividade | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getActivities({ limit: 100 })
      .then((res) => setActivities(res.items))
      .finally(() => setLoading(false));
  }, []);

  const handleStateToggle = (stateName: string) => {
    if (stateName === 'Todos') {
      setSelectedStates([]);
    } else {
      setSelectedStates((prev) =>
        prev.includes(stateName) ? prev.filter((s) => s !== stateName) : [...prev, stateName]
      );
    }
  };

  const handleDemandanteToggle = (dem: string) => {
    setSelectedDemandantes((prev) =>
      prev.includes(dem) ? prev.filter((x) => x !== dem) : [...prev, dem]
    );
  };

  const handleActionTypeToggle = (type: string) => {
    setSelectedActionTypes((prev) =>
      prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type]
    );
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (activeComponent !== 'Todos') {
        if ((act.componenteId || 1) !== Number(activeComponent)) return false;
      }

      if (selectedStates.length > 0) {
        const actStates = act.estados || [];
        const hasState = actStates.some((s) => {
          if (selectedStates.includes('Mato Grosso') && s === 'MT') return true;
          if (selectedStates.includes('Pará') && s === 'PA') return true;
          if (selectedStates.includes('Rondônia') && s === 'RO') return true;
          if (selectedStates.includes('Distrito Federal') && s === 'DF') return true;
          return false;
        });
        if (!hasState && actStates.length > 0) return false;
      }

      if (selectedDemandantes.length > 0) {
        if (!act.demandante || !selectedDemandantes.includes(act.demandante)) return false;
      }

      if (selectedActionTypes.length > 0) {
        if (!act.tipoAcao || !selectedActionTypes.includes(act.tipoAcao)) return false;
      }

      return true;
    });
  }, [activities, activeComponent, selectedStates, selectedDemandantes, selectedActionTypes]);

  const slicedActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  const getStatesLabel = (states: string[] | undefined) => {
    if (!states || states.length === 0) return 'Todas as UFs';
    return states.map((s) => {
      if (s === 'MT') return 'Mato Grosso';
      if (s === 'PA') return 'Pará';
      if (s === 'RO') return 'Rondônia';
      if (s === 'DF') return 'Distrito Federal';
      return s;
    }).join(', ');
  };

  return (
    <div className="bg-preto-5 text-black min-h-screen pt-16">
      <AnimatePresence mode="wait">
        {detailedActivity ? (
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="pb-24"
          >
            {/* Nav Back */}
            <div className="py-5 px-6 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={() => { setDetailedActivity(null); setActiveImageIdx(0); }}
                className="flex items-center gap-2 text-destaque-1 font-mono uppercase tracking-[0.16em] text-[10px] font-bold hover:text-destaque-2 transition-colors cursor-pointer bg-transparent border-none"
              >
                <ArrowLeft className="w-4 h-4 text-destaque-1" />
                Voltar para Atividades
              </button>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a] font-bold select-none">
                Cod: ATIV-{detailedActivity.id}
              </span>
            </div>

            {/* Immersive Photo Hero with gallery switcher */}
            <header className="relative w-full h-[360px] sm:h-[420px] flex items-end pb-12 pt-24 px-6 sm:px-8 max-w-7xl mx-auto rounded-sm overflow-hidden mt-4 shadow-xs">
              {(() => {
                const imgs = detailedActivity.imagens?.length > 0
                  ? detailedActivity.imagens
                  : [];
                const currentUrl = imgs[activeImageIdx]?.url;
                return (
                  <>
                    <div className="absolute inset-0 z-0 select-none">
                      {currentUrl && (
                        <img
                          key={currentUrl}
                          alt=""
                          className="w-full h-full object-cover brightness-[0.5] grayscale transition-opacity duration-500"
                          src={currentUrl}
                        />
                      )}
                      <div className="absolute inset-0 bg-[#038E5C]/10 mix-blend-overlay" />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 bg-gradient-to-t from-fundo-escuro/90 via-transparent to-transparent" />
                    </div>

                    {/* Gallery nav arrows */}
                    {imgs.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveImageIdx((i) => (i + 1) % imgs.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                          {imgs.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIdx(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                i === activeImageIdx ? 'bg-white' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}

              <div className="relative z-10 w-full flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap mb-1 select-none">
                  {detailedActivity.tipoAcao && (
                    <span className="px-3 py-1 bg-destaque-1 text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                      {detailedActivity.tipoAcao}
                    </span>
                  )}
                  {detailedActivity.demandante && (
                    <span className="px-3 py-1 bg-white text-black border border-preto-10 text-[9px] font-mono uppercase tracking-wider font-bold">
                      {detailedActivity.demandante}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-stone-800 text-stone-200 border border-stone-700 text-[9px] font-mono uppercase tracking-wider font-bold">
                    Comp: {detailedActivity.componenteId || 1}
                  </span>
                </div>
                <h1 className="text-white font-serif font-bold text-3xl sm:text-5xl tracking-tight leading-tight max-w-4xl">
                  {detailedActivity.titulo}
                </h1>
              </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-7 space-y-16">
                <section className="space-y-6">
                  <h2 className="text-2xl font-serif text-black font-bold">Resumo da Atividade</h2>
                  <div className="text-stone-700 font-sans text-sm leading-relaxed space-y-4 font-light">
                    <p>{detailedActivity.descricao}</p>
                    {detailedActivity.objetivo && <p><strong>Objetivo:</strong> {detailedActivity.objetivo}</p>}
                  </div>
                </section>

                {/* Highlight Stats (Bento style) */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-serif text-black font-bold">Números em Destaque</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-sm border border-preto-10 flex flex-col gap-2 shadow-xs">
                      <div className="w-8 h-8 border border-preto-10 text-destaque-1 flex items-center justify-center bg-destaque-1/5">
                        <Leaf className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span className="text-4xl font-serif text-destaque-1 mt-2 font-bold">
                        {detailedActivity.metrica1Valor || '2.500'}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.2em] leading-none font-bold">
                        {detailedActivity.metrica1Rotulo || 'Mudas Adquiridas'}
                      </span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-sm border border-preto-10 flex flex-col gap-2 shadow-xs">
                      <div className="w-8 h-8 border border-preto-10 text-destaque-2 flex items-center justify-center bg-destaque-2/5">
                        <Users className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span className="text-4xl font-serif text-destaque-2 mt-2 font-bold">
                        {detailedActivity.valorImpacto || detailedActivity.valorAlvo || '45 Unidades'}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.2em] leading-none font-bold">
                        {detailedActivity.rotuloImpacto || 'Mecanismo de Impacto'}
                      </span>
                    </div>

                    {/* Card 3 - Green Bento Delineamento Espacial */}
                    <div className="bg-fundo-escuro text-white p-6 rounded-sm sm:col-span-2 flex flex-col gap-2 relative overflow-hidden shadow-xs">
                      <div className="relative z-10 space-y-2">
                        <span className="text-[10px] font-mono text-destaque-1 uppercase tracking-[0.2em] leading-none block font-bold">Delineamento Espacial</span>
                        <span className="text-3xl font-serif italic text-destaque-1 block font-bold">
                          {detailedActivity.hectares || '0 Hectares'}
                        </span>
                        <span className="text-xs text-white/85 leading-relaxed block font-sans font-light">
                          {detailedActivity.delineamentoDescricao || 'Gleba delimitada e monitorada ativamente através de sensores orbitais diários para verificação do progresso da vegetação nativa integrada.'}
                        </span>
                      </div>
                    </div>

                  </div>
                </section>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white rounded-sm p-8 border border-preto-10 space-y-8 sticky top-28 shadow-xs">
                  <div>
                    <span className="text-stone-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em] block mb-3">Estados Envolvidos</span>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-destaque-1 shrink-0" />
                      <p className="font-serif text-black text-lg font-bold">{getStatesLabel(detailedActivity.estados)}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em] block mb-3">Data / Período</span>
                    <div className="flex items-center gap-3 text-destaque-1 font-bold">
                      <Calendar className="w-4 h-4 text-destaque-1 shrink-0" />
                      <p className="font-mono text-xs font-bold">{detailedActivity.data || new Date(detailedActivity.criadoEm).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Pontos geográficos */}
                  {detailedActivity.pontos && detailedActivity.pontos.length > 0 && (
                    <div>
                      <span className="text-stone-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em] block mb-3">
                        Pontos Geográficos ({detailedActivity.pontos.length})
                      </span>
                      <div className="space-y-2">
                        {detailedActivity.pontos.map((p, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-destaque-1 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-mono text-xs font-bold text-black">{p.rotulo || `Ponto ${i + 1}`}</p>
                              <p className="font-mono text-[10px] text-stone-500">{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instituições Parceiras */}
                  {detailedActivity.parceiros && detailedActivity.parceiros.length > 0 && (
                    <div className="border-t border-preto-10 pt-6">
                      <span className="text-stone-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em] block mb-4">Instituições Parceiras</span>
                      <ul className="space-y-3 font-sans">
                        {detailedActivity.parceiros.map((parc, idx) => (
                          <li key={idx} className="flex items-center gap-3 p-3 bg-preto-5 rounded-sm border border-preto-10">
                            <div className="w-7 h-7 bg-destaque-1 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {parc[0]?.toUpperCase() || 'P'}
                            </div>
                            <span className="text-[11px] font-bold text-stone-700 font-mono tracking-wide uppercase">{parc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-24"
          >
            {/* Header */}
            <header className="relative h-[280px] sm:h-[350px] flex items-center overflow-hidden max-w-7xl mx-auto rounded-none mt-1 shadow-xs border-b border-preto-10">
              <div className="absolute inset-0 z-0 select-none">
                <img
                  className="w-full h-full object-cover brightness-[0.55] select-none scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrcxSQ3jjU4wotR2lOTCrCmFEda0xtsWn-sqC9vMoR1Eg4_Ixia4j2h0bQ0GdPgDx_SlXAUk_fDLb6CfOtpaBz-vlRCPknx9B-PCgtXrewuHn3zyAzkyyjdAow-IfgU75HcNIxEowOBl7oCAcl_vbCKKFdezs1LZGstjXUzwQ0yvGBA3vZosjgZKSezMZGy3dZ9Un5TnG2p-U42YnNtDb-0JsduLZZSI635B8Vst5C24SjGo_TmBrqQb3f-rQmbEpUlUxqUvyOWxQ"
                  alt="Atividades"
                />
                <div className="absolute inset-0 bg-[#038E5C]/15 mix-blend-overlay" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-fundo-escuro/70 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 px-8 sm:px-12 w-full">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-none max-w-2xl">
                  Nossas Atividades
                </h1>
              </div>
            </header>

            {/* STICKY TOP FILTER PANEL ("Filtro Superior - Componentes") */}
            <div className="sticky top-[64px] z-40 bg-white border-b border-preto-10 shadow-sm w-full transition-all duration-300">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left explanation block */}
                  <div className="lg:col-span-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-preto-10 pb-3 lg:pb-0 lg:pr-6">
                    <span className="text-destaque-1 font-mono tracking-[0.2em] text-[10px] uppercase font-bold mb-1">Componentes</span>
                    <p className="text-stone-500 font-sans text-[11px] leading-snug font-normal">
                      O Projeto está estruturado em <strong>quatro componentes</strong> complementares que se articulam para promover a regularização e restauração.
                    </p>
                  </div>

                  {/* Right tabs block */}
                  <div className="lg:col-span-9">
                    <div className="flex flex-wrap items-center gap-2 select-none overflow-x-auto pb-1">
                      
                      {/* Button: Todos */}
                      <button
                        onClick={() => {
                          setActiveComponent('Todos');
                          setIsComponentExpanded(true);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold transition-all rounded-sm cursor-pointer border ${
                          activeComponent === 'Todos'
                            ? 'bg-destaque-1 text-white border-destaque-1 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        id="top-filter-todos"
                      >
                        Todos
                      </button>

                      {/* Button: Component 1 */}
                      <button
                        onClick={() => {
                          setActiveComponent(1);
                          setIsComponentExpanded(true);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold transition-all rounded-sm cursor-pointer border text-left flex items-center gap-1.5 ${
                          activeComponent === 1
                            ? 'bg-destaque-1 text-white border-destaque-1 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        id="top-filter-c1"
                      >
                        <span className="opacity-60">1</span> Fortalecimento institucional
                      </button>

                      {/* Button: Component 2 */}
                      <button
                        onClick={() => {
                          setActiveComponent(2);
                          setIsComponentExpanded(true);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold transition-all rounded-sm cursor-pointer border text-left flex items-center gap-1.5 ${
                          activeComponent === 2
                            ? 'bg-destaque-1 text-white border-destaque-1 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        id="top-filter-c2"
                      >
                        <span className="opacity-60">2</span> Apoio à regularização ambiental
                      </button>

                      {/* Button: Component 3 */}
                      <button
                        onClick={() => {
                          setActiveComponent(3);
                          setIsComponentExpanded(true);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold transition-all rounded-sm cursor-pointer border text-left flex items-center gap-1.5 ${
                          activeComponent === 3
                            ? 'bg-destaque-1 text-white border-destaque-1 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        id="top-filter-c3"
                      >
                        <span className="opacity-60">3</span> Recomposição e restauração ecológica
                      </button>

                      {/* Button: Component 4 */}
                      <button
                        onClick={() => {
                          setActiveComponent(4);
                          setIsComponentExpanded(true);
                        }}
                        className={`px-4 py-2 text-xs font-mono font-bold transition-all rounded-sm cursor-pointer border text-left flex items-center gap-1.5 ${
                          activeComponent === 4
                            ? 'bg-destaque-1 text-white border-destaque-1 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        id="top-filter-c4"
                      >
                        <span className="opacity-60">4</span> Gestão do Projeto
                      </button>
                    </div>
                  </div>

                </div>

                {/* Sub-menu expands dynamically below the tabs */}
                <AnimatePresence>
                  {isComponentExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-preto-10 mt-3 pt-3"
                    >
                      <div className="bg-[#faf9f6] p-4 rounded-sm border border-stone-100 relative">
                        
                        {/* Close button */}
                        <div className="absolute top-2 right-2 flex items-center gap-2">
                          <button
                            onClick={() => setIsComponentExpanded(false)}
                            className="p-1 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-600 transition-colors cursor-pointer border-none bg-transparent"
                            title="Ocultar detalhes"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Conditionals based on active component */}
                        {activeComponent === 'Todos' && (
                          <div className="py-2 text-center">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-bold block">
                              Selecione um dos componentes para visualizar detalhes ecológicos e subcomponentes
                            </span>
                          </div>
                        )}

                        {activeComponent === 1 && (
                          <div className="space-y-2 max-w-4xl">
                            <h4 className="text-destaque-1 font-serif text-sm font-bold leading-tight">
                              Fortalecimento dos órgãos competentes para implementação da regularização ambiental de imóveis rurais
                            </h4>
                            <p className="text-stone-600 text-xs leading-relaxed font-normal">
                              Permite o aprimoramento das estruturas das instituições atuantes no projeto para atendimento à jornada do Cadastro Ambiental Rural (CAR) e aos processos de restauração e recuperação da vegetação nativa.
                            </p>
                          </div>
                        )}

                        {activeComponent === 2 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h4 className="text-destaque-1 font-serif text-sm font-bold leading-tight">
                                Apoio a processos de regularização ambiental de imóveis rurais
                              </h4>
                              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                                Permite o aceleramento da implementação da regularização ambiental, apoiando desde a mobilização e capacitação de produtores rurais até a jornada do Cadastro Ambiental Rural (CAR).
                              </p>
                            </div>
                            <div className="border-t md:border-t-0 md:border-l border-stone-200/60 md:pl-6 space-y-2">
                              <h5 className="font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">Subcomponentes</h5>
                              <ul className="space-y-1 text-[11px] text-stone-600 list-none font-normal leading-tight pl-0">
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 2.1 Articulação, comunicação e capacitação</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 2.2 Inscrição, atualização, complementação e retificação de CAR</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 2.3 Análise e diagnóstico da regularidade ambiental de imóveis</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 2.4 Elaboração de propostas de regularização ambiental</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {activeComponent === 3 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h4 className="text-destaque-1 font-serif text-sm font-bold leading-tight">
                                Recomposição de Áreas de Preservação Permanente, de Reserva Legal e de Uso Restrito
                              </h4>
                              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                                Fomenta ações diretas de recuperação de Áreas de Preservação Permanente (APPs), Reservas Legais (RLs) e Áreas de Uso Restrito (AURs) em propriedades rurais de até quatro módulos fiscais.
                              </p>
                            </div>
                            <div className="border-t md:border-t-0 md:border-l border-stone-200/60 md:pl-6 space-y-2">
                              <h5 className="font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">Subcomponentes</h5>
                              <ul className="space-y-1 text-[11px] text-stone-600 list-none font-normal leading-tight pl-0">
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 3.1 Capacitação de multiplicadores (Mobilização)</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 3.2 Implantação de Centros de Referência adaptados</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 3.3 Implantação de Unidades Demonstrativas - Rede Sementes</li>
                                <li className="flex items-start gap-1.5"><span className="text-destaque-1 font-bold">•</span> 3.4 Apoio a projetos de recomposição por chamadas públicas</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {activeComponent === 4 && (
                          <div className="space-y-2 max-w-4xl">
                            <h4 className="text-destaque-1 font-serif text-sm font-bold leading-tight">
                              Gestão do Projeto
                            </h4>
                            <p className="text-stone-600 text-xs leading-relaxed font-normal">
                              Assegura a coordenação técnica, administrativa e financeira das ações, promovendo a integração entre as instâncias e o alinhamento com as políticas públicas nacionais.
                            </p>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reopen indicator if closed */}
                {!isComponentExpanded && (
                  <div className="text-right mt-1.5">
                    <button
                      onClick={() => setIsComponentExpanded(true)}
                      className="text-[9px] font-mono tracking-wider uppercase text-destaque-1 hover:text-destaque-2 font-bold cursor-pointer inline-flex items-center gap-1 bg-stone-50 py-1 px-2.5 rounded border border-stone-200"
                    >
                      Mostrar ajuda dos componentes <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* MAIN CORE */}
            <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 relative z-20">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-[160px] z-30 bg-white p-6 rounded-sm border border-preto-10 shadow-xs space-y-6">
                  <div>
                    <h4 className="font-mono font-bold text-xs uppercase tracking-[0.18em] text-[#1a1a1a] flex items-center gap-2">
                      <Filter className="w-4 h-4 text-destaque-1" />
                      <span>Filtros Laterais</span>
                    </h4>
                    <div className="h-[2px] w-12 bg-destaque-1 mt-3" />
                  </div>

                  {/* UF */}
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3 font-mono">Unidades Federativas</span>
                    <div className="space-y-2.5">
                      {['Mato Grosso', 'Pará', 'Rondônia', 'Distrito Federal'].map((ufDisplay) => {
                        const isChecked = selectedStates.includes(ufDisplay);
                        return (
                          <label key={ufDisplay} className="flex items-center gap-2.5 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleStateToggle(ufDisplay)}
                              className="w-4 h-4 rounded-none border-stone-350 text-destaque-1 focus:ring-destaque-1 cursor-pointer bg-white"
                            />
                            <span className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                              isChecked ? 'text-destaque-1' : 'text-stone-600 group-hover:text-stone-900'
                            }`}>
                              {ufDisplay}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Demandante */}
                  <div className="border-t border-preto-10 pt-4">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3 font-mono">Demandante</span>
                    <div className="space-y-2.5">
                      {['SFB', 'Embrapa', 'SEDAM-RO', 'SEMAS-PA', 'SEMA/MT'].map((dem) => {
                        const isChecked = selectedDemandantes.includes(dem);
                        return (
                          <label key={dem} className="flex items-center gap-2.5 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleDemandanteToggle(dem)}
                              className="w-4 h-4 rounded-none border-stone-350 text-destaque-1 focus:ring-destaque-1 cursor-pointer bg-white"
                            />
                            <span className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                              isChecked ? 'text-destaque-1' : 'text-stone-600 group-hover:text-stone-900'
                            }`}>
                              {dem}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tipo de Ação */}
                  <div className="border-t border-preto-10 pt-4">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 mb-3 font-mono">Tipo de Ação</span>
                    <div className="space-y-2.5">
                      {['Mutirão', 'Jornada do CAR', 'Consultoria', 'Eventos', 'Aquisição de bens', 'Digital', 'Restauração/Recuperação'].map((type) => {
                        const isChecked = selectedActionTypes.includes(type);
                        return (
                          <label key={type} className="flex items-center gap-2.5 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleActionTypeToggle(type)}
                              className="w-4 h-4 rounded-none border-stone-350 text-destaque-1 focus:ring-destaque-1 cursor-pointer bg-white"
                            />
                            <span className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                              isChecked ? 'text-destaque-1' : 'text-stone-600 group-hover:text-stone-900'
                            }`}>
                              {type}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear button */}
                  {(activeComponent !== 'Todos' || selectedStates.length > 0 || selectedDemandantes.length > 0 || selectedActionTypes.length > 0) && (
                    <button
                      onClick={() => {
                        setActiveComponent('Todos');
                        setSelectedStates([]);
                        setSelectedDemandantes([]);
                        setSelectedActionTypes([]);
                      }}
                      className="w-full mt-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[9px] uppercase tracking-wider font-bold py-2 rounded transition-colors border-none cursor-pointer"
                    >
                      Limpar Todos Filtros
                    </button>
                  )}
                </aside>

                {/* Grid */}
                <div className="flex-1 w-full space-y-8">
                  {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-destaque-1 animate-spin" /></div>
                  ) : filteredActivities.length === 0 ? (
                    <div className="bg-white p-16 rounded-sm border border-preto-10 text-center space-y-4 shadow-xs">
                      <p className="text-stone-500 font-sans text-sm font-light">Nenhuma atividade enquadra-se nos filtros ativos.</p>
                      <button
                        onClick={() => { setActiveComponent('Todos'); setSelectedStates([]); }}
                        className="border border-destaque-1 text-destaque-1 hover:bg-destaque-1 hover:text-white px-5 py-2.5 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold transition-all"
                      >
                        Resetar Filtros
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {slicedActivities.map((act) => (
                        <article
                          key={act.id}
                          className="bg-white rounded-sm overflow-hidden border border-preto-10 shadow-xs hover:border-destaque-1/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                          onClick={() => { setDetailedActivity(act); setActiveImageIdx(0); }}
                        >
                          <div>
                            {(() => {
                              const cover = act.imagens?.[0]?.url;
                              return cover ? (
                                <div className="relative h-48 bg-gray-100 overflow-hidden select-none border-b border-preto-10">
                                  <img src={cover} className="w-full h-full object-cover grayscale brightness-95" alt={act.titulo} />
                                  {act.imagens?.length > 1 && (
                                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] font-mono px-1.5 py-0.5">
                                      +{act.imagens.length - 1}
                                    </span>
                                  )}
                                </div>
                              ) : null;
                            })()}

                            <div className="p-6">
                              <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider text-stone-500 uppercase mb-3 border-b border-preto-5 pb-2">
                                <span>Componente: {act.componenteId || 1}</span>
                                <span className="text-destaque-2">{getStatesLabel(act.estados)}</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                {act.tipoAcao && (
                                  <span className="bg-destaque-1 text-white font-mono uppercase text-[8px] font-bold px-2 py-0.5 tracking-wider">
                                    {act.tipoAcao}
                                  </span>
                                )}
                                {act.demandante && (
                                  <span className="bg-stone-150 text-stone-700 font-mono uppercase text-[8px] font-bold px-2 py-0.5 tracking-wider border border-stone-200">
                                    {act.demandante}
                                  </span>
                                )}
                                {act.insignias && act.insignias.map((badge) => (
                                  <span key={badge} className="bg-destaque-1/10 text-destaque-1 font-mono uppercase text-[8px] font-bold px-2 py-0.5 tracking-wider">
                                    {badge}
                                  </span>
                                ))}
                              </div>

                              <h3 className="text-base font-serif font-bold text-stone-900 leading-snug mb-2 hover:text-destaque-1 transition-colors">
                                {act.titulo}
                              </h3>

                              <p className="text-stone-600 text-xs leading-relaxed font-light font-sans line-clamp-3">
                                {act.descricao}
                              </p>
                            </div>
                          </div>

                          <div className="p-6 pt-0 flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-wider text-destaque-1 border-t border-preto-5 pt-3">
                            <span>Ver Detalhes</span>
                            <span>→</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
