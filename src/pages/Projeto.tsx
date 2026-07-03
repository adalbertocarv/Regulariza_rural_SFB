import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CounterAnimationProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function CounterAnimation({ end, duration = 1500, decimals = 0, prefix = '', suffix = '' }: CounterAnimationProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    const start = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentCount = start + easeProgress * (end - start);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, end, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {count.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const ALL_TESTIMONIALS = [
  {
    id: '1',
    quote: 'O apoio do projeto na retificação do nosso CAR foi fundamental. Agora produzimos com tranquilidade jurídica e respeito ambiental.',
    name: 'José Carlos Souza',
    role: 'Produtor Rural',
    location: 'Sinop - MT',
    category: 'proprietario_possuidor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    mediaType: 'photo' as const,
  },
  {
    id: '2',
    quote: 'A metodologia de restauração assistida reduziu os custos de recomposição em mais de 50% na nossa cooperativa local.',
    name: 'Ana Maria Mendes',
    role: 'Engenheira Agrônoma',
    location: 'Santarém - PA',
    category: 'tecnico',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    mediaType: 'photo' as const,
  },
  {
    id: '3',
    quote: 'A integração dos órgãos estaduais ao Geoportal acelerou as vistorias técnicas e a validação ambiental.',
    name: 'Dr. Roberto Lima',
    role: 'Analista Ambiental SEMAS',
    location: 'Belém - PA',
    category: 'oemas',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    mediaType: 'photo' as const,
  },
];

export default function Projeto() {
  const navigate = useNavigate();
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const beforeAfterContainerRef = useRef<HTMLDivElement>(null);
  const [beforeAfterWidth, setBeforeAfterWidth] = useState<number>(0);
  const [testimonialFilter, setTestimonialFilter] = useState<'proprietario_possuidor' | 'tecnico' | 'oemas' | 'todos'>('todos');
  const [simulatedArea, setSimulatedArea] = useState<number>(500);
  const [restorationType, setRestorationType] = useState<'ativa' | 'assistida' | 'passiva'>('ativa');

  useEffect(() => {
    if (!beforeAfterContainerRef.current) return;
    const updateWidth = () => {
      setBeforeAfterWidth(beforeAfterContainerRef.current?.getBoundingClientRect().width || 0);
    };
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(beforeAfterContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const filteredTestimonials = useMemo(() => {
    if (testimonialFilter === 'todos') {
      return ALL_TESTIMONIALS;
    }
    return ALL_TESTIMONIALS.filter((t) => t.category === testimonialFilter);
  }, [testimonialFilter]);

  const toggleAccordion = (componentId: number) => {
    setExpandedComponent((prev) => (prev === componentId ? null : componentId));
  };

  const getRestorationData = () => {
    let m2Cost = 15.0;
    let mudasPerHa = 1660;
    let label = 'Restauração Ativa (Plantio Total)';
    let desc = 'Envolve o preparo do solo e o plantio planejado de mudas de espécies nativas, ideal para áreas sem regeneração natural.';

    if (restorationType === 'assistida') {
      m2Cost = 6.0;
      mudasPerHa = 400;
      label = 'Restauração Assistida (Condução)';
      desc = 'Apoio à regeneração natural por meio de coroamento, eliminação de plantas competidoras e enriquecimento com espécies-chave.';
    } else if (restorationType === 'passiva') {
      m2Cost = 2.5;
      mudasPerHa = 0;
      label = 'Restauração Passiva (Isolamento)';
      desc = 'Cercamento e isolamento da área de fatores de degradação, permitindo que a floresta se regenere de forma totalmente natural.';
    }

    const totalM2 = simulatedArea * 10000;
    const totalCost = totalM2 * m2Cost;
    const totalMudas = simulatedArea * mudasPerHa;
    const familiasImpactadas = Math.max(1, Math.round(simulatedArea * 0.12));

    const dfArea = 576000;
    const alemanhaArea = 35758800;

    const dfPercentage = (simulatedArea / dfArea) * 100;
    const alemanhaPercentage = (simulatedArea / alemanhaArea) * 100;
    const projDfPercentage = (100000 / dfArea) * 100;
    const projAlemanhaPercentage = (100000 / alemanhaArea) * 100;

    return {
      m2Cost,
      mudasPerHa,
      label,
      desc,
      totalM2,
      totalCost,
      totalMudas,
      familiasImpactadas,
      dfPercentage,
      alemanhaPercentage,
      projDfPercentage,
      projAlemanhaPercentage,
    };
  };

  const simData = getRestorationData();

  return (
    <div className="bg-preto-5 text-black min-h-screen pt-20">
      {/* Immersive Hero */}
      <section className="relative h-[440px] sm:h-[480px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 select-none">
          <img
            className="w-full h-full object-cover brightness-[0.5]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4zaTQS7M1I10m7397sXaeTrSd_hZ_8R6LFNY9fZJfLBRg7Su7kcyQ9LQuCT_BYP0Dhes9lm9mKUbIou7L1XkbQVWMNTSOBl_5LeLCMKsJj7kXkEUQ8uv_1S3oYtrbGSKQgdiw5bFIqqpfoGJvm4mPyEF6qmkpkHUTRW4UYkVvCmM9jiH231H1H3RwKxQZG7lb0hgyS3LoajWTo3c8ipEtH7w_Vk2BlCZoaCQin2QXug6MKq1eH2Zv6FFEn9XdGO-xiREuiJJ4cHQ"
            alt="Paisagem rural"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-serif font-light text-white leading-tight mb-6 tracking-tight">
              Conheça o Projeto <br />
              <span className="font-serif italic font-bold text-destaque-1">Regulariza Rural</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Apresentação Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
            <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Fundamentos</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight mb-6">
              Sustentabilidade e Regularização <br />
              <span className="font-serif italic text-destaque-1">no Campo Brasileiro</span>
            </h2>
            <div className="h-[2px] w-20 bg-destaque-1 mb-8" />

            <div className="space-y-6 text-stone-700 leading-relaxed font-sans text-sm">
              <p>
                O Projeto “Regularização Ambiental de Imóveis Rurais na Amazônia e em Áreas de Transição para o Cerrado”, também conhecido como <strong>Projeto Regulariza Rural</strong>, é um instrumento voltado para a implementação do Código Florestal brasileiro (Lei nº 12.651/2012), dotado de atividades para aprimorar o monitoramento da vegetação nativa e para impulsionar a regularização ambiental de imóveis rurais nos estados de Mato Grosso (MT), Pará (PA) e Rondônia (RO) através da implementação do Cadastro Ambiental Rural (CAR).
              </p>
              <p>
                O Projeto tem como objetivo superior a conservação e restauração das florestas e demais formações de vegetação nativa na Amazônia e no Cerrado, especialmente no que diz respeito à redução do desmatamento, à manutenção da biodiversidade e à redução de emissões de gases de efeito estufa.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="rounded-sm overflow-hidden border border-preto-10 bg-white p-3 block shadow-xs">
              <img
                className="w-full h-[380px] sm:h-[460px] object-cover pointer-events-none select-none grayscale hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMiAxzkXS6FgdDu2fO6nGs7lbIEymPtXQX_Oz5VjC1vEb-Vt6rorco-8fPyCGlJ5G68mxxygXHuUQotUBkcIf5UWLRGnOE2jhVbcsbIKjauy90c7sUkUeQlXEWJ0zAhYLrJvZhimJqlnFwyx6WkDxknw0WkakLr-3PBro4DYq2F1ht8pqZUJF4XnYp9OnVoDoIM5GmzIOtNjxJ3c_RauzQRmv_fu3cb_h5CDHeOmMNIbDD8YVwUA6kT_ncV50UsXv13zT4tQv72Ig"
                alt="Tecnologia no campo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard de Simulação de Impacto */}
      <section className="py-24 bg-preto-5 border-t border-b border-preto-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-12 text-center lg:text-left">
            <span className="text-destaque-2 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Simulador Interativo</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-black tracking-tight leading-tight">
              Painel de Projeções e Impacto Socioambiental
            </h3>
            <p className="text-stone-600 text-sm font-light mt-3 max-w-2xl leading-relaxed">
              Ajuste a escala da área em hectares e a técnica desejada para projetar o investimento total, valor por m², mudas necessárias, impacto social e a comparação territorial direta com o Distrito Federal e com a Alemanha.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls */}
            <div className="lg:col-span-5 bg-white border border-preto-10 p-6 sm:p-8 rounded-sm space-y-8 shadow-xs text-left">
              <div>
                <h4 className="font-serif text-lg font-bold text-black mb-1">Configurações da Área</h4>
                <p className="text-xs text-stone-500 leading-relaxed">Defina o tamanho do território e o método de recomposição.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase tracking-wider font-bold text-black/80">Área Projetada</label>
                  <span className="text-sm font-mono font-bold text-destaque-1 bg-preto-5 px-3 py-1 border border-preto-10 rounded-sm">
                    {simulatedArea.toLocaleString('pt-BR')} ha
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={simulatedArea}
                  onChange={(e) => setSimulatedArea(Number(e.target.value))}
                  className="w-full h-2 bg-preto-5 rounded-lg appearance-none cursor-pointer accent-[#038E5C] border border-preto-10"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>10 ha</span>
                  <span>5.000 ha</span>
                  <span>10.000 ha</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-black/80 block">Técnica de Restauração</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { type: 'ativa' as const, title: 'Ativa (Plantio Total)', price: 'R$ 15,00/m²', text: 'Preparo integral do solo e plantio planejado de 1.660 mudas nativas por hectare.' },
                    { type: 'assistida' as const, title: 'Assistida (Condução)', price: 'R$ 6,00/m²', text: 'Apoio à regeneração natural por meio de coroamento e enriquecimento com 400 mudas/ha.' },
                    { type: 'passiva' as const, title: 'Passiva (Isolamento)', price: 'R$ 2,50/m²', text: 'Cercamento e proteção da área. Regeneração totalmente natural.' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setRestorationType(item.type)}
                      className={`p-4 border text-left rounded-sm transition-all duration-300 cursor-pointer focus:outline-none ${
                        restorationType === item.type ? 'border-destaque-1 bg-destaque-1/5 shadow-xs' : 'border-preto-10 hover:border-black/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono uppercase tracking-wider font-bold text-black">{item.title}</span>
                        <span className="text-xs font-mono font-bold text-destaque-1">{item.price}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans">{item.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-preto-10 p-5 rounded-sm shadow-xs text-left flex flex-col justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-stone-400 mb-3 block">Investimento Estimado</span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-black truncate">
                    R$ {simData.totalCost >= 1000000 ? `${(simData.totalCost / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} M` : simData.totalCost.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wide mt-1">ou R$ {simData.m2Cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / m²</div>
                </div>

                <div className="bg-white border border-preto-10 p-5 rounded-sm shadow-xs text-left flex flex-col justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-stone-400 mb-3 block">Mudas Necessárias</span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-black">
                    {simData.totalMudas >= 1000000 ? `${(simData.totalMudas / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} M` : simData.totalMudas.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wide mt-1">{simData.mudasPerHa} mudas / ha</div>
                </div>

                <div className="bg-white border border-preto-10 p-5 rounded-sm shadow-xs text-left flex flex-col justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-stone-400 mb-3 block">Famílias Beneficiadas</span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-black">{simData.familiasImpactadas.toLocaleString('pt-BR')}</div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wide mt-1">famílias apoiadas</div>
                </div>
              </div>

              <div className="bg-white border border-preto-10 p-6 sm:p-8 rounded-sm shadow-xs text-left space-y-6">
                <div>
                  <h4 className="font-serif text-lg font-bold text-black mb-1">Proporção e Comparação de Área</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">Área simulada de <strong className="text-black">{simulatedArea.toLocaleString('pt-BR')} ha</strong> vs. <strong className="text-black">100.000 ha</strong> totais do projeto:</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-xs font-mono">
                      <span className="font-bold text-black uppercase tracking-wider">Distrito Federal (DF)</span>
                      <span className="font-bold text-destaque-1">{simData.dfPercentage.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% do DF</span>
                    </div>
                    <div className="relative w-full h-3 bg-preto-5 rounded-full overflow-hidden border border-preto-10">
                      <div className="absolute top-0 left-0 h-full bg-[#038E5C] transition-all duration-500" style={{ width: `${Math.min(100, simData.dfPercentage)}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-xs font-mono">
                      <span className="font-bold text-black uppercase tracking-wider">Alemanha</span>
                      <span className="font-bold text-destaque-1">{simData.alemanhaPercentage.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}% da Alemanha</span>
                    </div>
                    <div className="relative w-full h-3 bg-preto-5 rounded-full overflow-hidden border border-preto-10">
                      <div className="absolute top-0 left-0 h-full bg-[#038E5C] transition-all duration-500" style={{ width: `${Math.min(100, simData.alemanhaPercentage)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1F3A30] text-white p-4 rounded-sm border border-white/10 mt-4">
                  <h5 className="text-[11px] font-mono uppercase tracking-wider font-bold mb-1">Sequestro de Carbono Estimado</h5>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    Sua área simulada sequestrará aproximadamente <strong className="text-white">{(simulatedArea * 12).toLocaleString('pt-BR')} toneladas de CO2/ano</strong> (12 ton CO2/ha/ano).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Antes e Depois Slider */}
      <section className="py-24 bg-white border-b border-preto-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Evolução Visual</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-black">Restauração na Prática</h3>
          </div>

          <div className="max-w-5xl mx-auto">
            <div
              ref={beforeAfterContainerRef}
              className="relative w-full h-[360px] sm:h-[480px] overflow-hidden rounded-sm border border-preto-10 bg-stone-100 select-none shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80"
                alt="Depois"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 text-[10px] font-mono uppercase tracking-wider font-bold z-10">
                Depois (Recuperado)
              </div>

              <div className="absolute inset-y-0 left-0 overflow-hidden z-15" style={{ width: `${sliderPosition}%` }}>
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
                  alt="Antes"
                  className="absolute inset-y-0 left-0 h-full object-cover"
                  style={{ width: beforeAfterWidth ? `${beforeAfterWidth}px` : '100%', maxWidth: 'none' }}
                />
                <div className="absolute bottom-6 left-6 bg-black/60 text-white px-4 py-2 text-[10px] font-mono uppercase tracking-wider font-bold whitespace-nowrap z-10">
                  Antes (Degradado)
                </div>
              </div>

              <div className="absolute inset-y-0 w-1 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPosition}%` }} />
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Componentes do Projeto */}
      <section className="py-24 bg-[#1F3A30] text-white border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-16 text-left">
            <h2 className="text-3xl md:text-4xl font-sans font-light tracking-[0.05em] uppercase text-white mb-4">
              COMPONENTES DO PROJETO
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { num: 1, title: 'Fortalecimento Institucional', desc: 'Fortalecimento dos órgãos competentes para implementação da regularização ambiental.' },
              { num: 2, title: 'Apoio à Regularização', desc: 'Apoio a processos de regularização ambiental de imóveis rurais (CAR).' },
              { num: 3, title: 'Recomposição Ecológica', desc: 'Recomposição de Áreas de Preservação Permanente (APPs), Reserva Legal e Uso Restrito.' },
              { num: 4, title: 'Gestão do Projeto', desc: 'Coordenação técnica, administrativa e financeira das ações integradas.' },
            ].map((comp) => (
              <div key={comp.num} className="py-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-2 font-serif text-5xl text-white/30 font-bold">0{comp.num}</div>
                <div className="lg:col-span-5">
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{comp.title}</h3>
                  <button onClick={() => navigate('/atividades')} className="text-[10px] font-mono uppercase font-bold text-destaque-1 hover:underline flex items-center gap-1">
                    Ver atividades <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="lg:col-span-5 text-white/70 text-sm font-sans font-light">{comp.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
