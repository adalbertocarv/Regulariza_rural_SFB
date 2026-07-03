import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronRight, MapPin, Calendar, Quote, Loader2, Sprout, Home, FileText, Map, Globe } from 'lucide-react';
import { api, Noticia, Atividade, Depoimento, EstatisticaDashboard } from '../lib/api';

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

const STATE_DATA_SET = {
  MT: { name: 'Mato Grosso', carAnalysers: '2.840', areaRestored: '48.200', activeUnits: '42' },
  PA: { name: 'Pará', carAnalysers: '1.920', areaRestored: '36.500', activeUnits: '38' },
  RO: { name: 'Rondônia', carAnalysers: '1.240', areaRestored: '21.100', activeUnits: '24' },
};

export default function Inicio() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<'MT' | 'PA' | 'RO'>('MT');
  const [news, setNews] = useState<Noticia[]>([]);
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [testimonials, setTestimonials] = useState<Depoimento[]>([]);
  const [stats, setStats] = useState<EstatisticaDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getNews({ limit: 3 }),
      api.getActivities({ limit: 4 }),
      api.getTestimonials(),
      api.getStats(),
    ])
      .then(([newsData, actData, testData, statsData]) => {
        setNews(newsData.items);
        setActivities(actData.items);
        setTestimonials(testData);
        setStats(statsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeStateData = STATE_DATA_SET[selectedState];

  return (
    <div className="bg-preto-5 text-black min-h-screen pt-20">
      {/* Editorial Hero */}
      <section className="relative h-[620px] md:h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover brightness-[0.5] transition-transform duration-[4000ms] ease-out hover:scale-[1.03]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4zaTQS7M1I10m7397sXaeTrSd_hZ_8R6LFNY9fZJfLBRg7Su7kcyQ9LQuCT_BYP0Dhes9lm9mKUbIou7L1XkbQVWMNTSOBl_5LeLCMKsJj7kXkEUQ8uv_1S3oYtrbGSKQgdiw5bFIqqpfoGJvm4mPyEF6qmkpkHUTRW4UYkVvCmM9jiH231H1H3RwKxQZG7lb0hgyS3LoajWTo3c8ipEtH7w_Vk2BlCZoaCQin2QXug6MKq1eH2Zv6FFEn9XdGO-xiREuiJJ4cHQ"
            alt="Natureza brasileira"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/85 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white tracking-tight leading-[1.05] mb-8"
            >
              Regularizar seu imóvel é promover a<br />
              <span className="font-serif italic font-bold text-destaque-1">sustentabilidade ambiental</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/atividades"
                className="bg-destaque-1 hover:bg-destaque-1/80 text-white font-bold px-8 py-4 rounded-sm text-xs font-mono uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer border-none shadow-md hover:shadow-lg inline-block"
              >
                Nossas Atividades
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Sobre o Projeto</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight text-black leading-tight">
              O Projeto Regulariza Rural <br />
              <span className="font-serif italic text-destaque-1">nasceu da necessidade de apoio à regularização ambiental, mas está indo além.</span>
            </h2>
            <div className="h-[2px] w-20 bg-destaque-1 mb-8" />
          </div>
          <div className="text-stone-700 space-y-4 leading-relaxed font-sans text-base">
            <p>
              Contando com a adesão de proprietários(as) e possuidores(as) rurais voluntários, o Projeto promove ações educativas e técnicas em pequenas propriedades rurais de três estados brasileiros da Amazônia Legal, ajudando na recuperação e conservação da vegetação nativa.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="space-y-4 bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex flex-col justify-between hover:border-destaque-1/40 hover:-translate-y-1 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-none bg-preto-5 border border-preto-10 select-none shrink-0">
                <Sprout className="w-4.5 h-4.5 text-destaque-1" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-destaque-1 font-bold">Restauração</span>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-black">
                <CounterAnimation end={100} suffix="k ha" />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-black/80 font-bold leading-tight mt-0.5">Área em processo de restauração</div>
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex flex-col justify-between hover:border-destaque-2/40 hover:-translate-y-1 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-none bg-preto-5 border border-preto-10 select-none shrink-0">
                <Home className="w-4.5 h-4.5 text-destaque-2" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-destaque-2 font-bold">Propriedades</span>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-black">
                <CounterAnimation end={500} prefix="+" />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-black/80 font-bold leading-tight mt-0.5">Propriedades com CAR analisados</div>
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex flex-col justify-between hover:border-destaque-1/40 hover:-translate-y-1 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-none bg-preto-5 border border-preto-10 select-none shrink-0">
                <FileText className="w-4.5 h-4.5 text-destaque-1" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-destaque-1 font-bold">Análise CAR</span>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-black">
                <CounterAnimation end={5} prefix="+" suffix="mil" />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-black/80 font-bold leading-tight mt-0.5">Número de CARs analisados</div>
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-sm border border-preto-10 shadow-xs flex flex-col justify-between hover:border-destaque-2/40 hover:-translate-y-1 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-none bg-preto-5 border border-preto-10 select-none shrink-0">
                <Map className="w-4.5 h-4.5 text-destaque-2" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-destaque-2 font-bold">Área Analisada</span>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-black">
                <CounterAnimation end={14.2} decimals={1} suffix=" k ha" />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.08em] text-black/80 font-bold leading-tight mt-0.5">Área dos CARs analisados</div>
            </div>
          </div>

          <div className="space-y-4 bg-fundo-escuro text-white p-6 rounded-sm shadow-xs flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-destaque-1" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-destaque-1 font-bold block">Impacto Global</span>
              </div>
              <div className="text-2xl font-serif font-bold text-white mt-1">Amazônia & Cerrado</div>
              <p className="text-[10px] font-sans text-white/70 mt-2 leading-relaxed font-light">Atuação contínua nos estados prioritários da Amazônia Legal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* State Data Section */}
      <section className="py-20 bg-white border-t border-b border-preto-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-2 block font-bold">Atuação Regional</span>
              <h2 className="text-3xl font-serif font-bold text-black">Dados por Estado</h2>
            </div>
            <div className="flex gap-2 bg-preto-5 p-1 border border-preto-10">
              {(['MT', 'PA', 'RO'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedState === st ? 'bg-destaque-1 text-white' : 'text-black/60 hover:text-black'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-preto-5 p-6 border border-preto-10">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-1 font-bold">CARs Analisados</span>
              <div className="text-3xl font-serif font-bold text-destaque-1">{activeStateData.carAnalysers}</div>
              <span className="text-xs text-black/50 font-sans mt-1 block">no estado de {activeStateData.name}</span>
            </div>
            <div className="bg-preto-5 p-6 border border-preto-10">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-1 font-bold">Área em Restauração</span>
              <div className="text-3xl font-serif font-bold text-destaque-2">{activeStateData.areaRestored} ha</div>
              <span className="text-xs text-black/50 font-sans mt-1 block">monitorados ativamente</span>
            </div>
            <div className="bg-preto-5 p-6 border border-preto-10">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-1 font-bold">Unidades Demonstrativas</span>
              <div className="text-3xl font-serif font-bold text-black">{activeStateData.activeUnits}</div>
              <span className="text-xs text-black/50 font-sans mt-1 block">núcleos implantados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Preview */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-2 block font-bold">Ações de Campo</span>
            <h2 className="text-3xl font-serif font-bold text-black">Atividades em Destaque</h2>
          </div>
          <Link to="/atividades" className="text-destaque-1 font-mono uppercase text-[10px] font-bold tracking-widest flex items-center gap-1 hover:underline">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-destaque-1 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((act) => (
              <div key={act.id} className="bg-white border border-preto-10 overflow-hidden hover:border-destaque-1/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {act.imagens?.[0]?.url && (
                    <div className="h-40 overflow-hidden border-b border-preto-10 relative">
                      <img src={act.imagens[0].url} alt={act.titulo} className="w-full h-full object-cover grayscale brightness-95" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {act.insignias.map((b) => (
                        <span key={b} className="text-[8px] font-mono font-bold px-2 py-0.5 bg-destaque-1/10 text-destaque-1 uppercase tracking-wider">{b}</span>
                      ))}
                    </div>
                    <h3 className="font-serif font-bold text-black text-base mb-2 leading-snug">{act.titulo}</h3>
                    <p className="text-stone-600 text-xs line-clamp-3 font-light leading-relaxed">{act.descricao}</p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link to="/atividades" className="text-destaque-1 font-mono text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1 hover:underline">
                    Saiba mais <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* News Preview */}
      <section className="py-24 bg-white border-t border-preto-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-2 block font-bold">Informativos</span>
              <h2 className="text-3xl font-serif font-bold text-black">Últimas Notícias</h2>
            </div>
            <Link to="/noticias" className="text-destaque-1 font-mono uppercase text-[10px] font-bold tracking-widest flex items-center gap-1 hover:underline">
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-destaque-1 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <article key={item.id} className="bg-preto-5 border border-preto-10 overflow-hidden hover:border-destaque-1/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {item.urlImagem && (
                      <div className="h-44 overflow-hidden border-b border-preto-10 relative">
                        <img src={item.urlImagem} alt={item.titulo} className="w-full h-full object-cover grayscale brightness-95" />
                      </div>
                    )}
                    <div className="p-6">
                      {item.categoria && (
                        <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-destaque-1 text-white uppercase tracking-wider mb-3 inline-block">{item.categoria}</span>
                      )}
                      <h3 className="font-serif font-bold text-black text-lg mb-2 leading-snug">{item.titulo}</h3>
                      <p className="text-stone-600 text-xs line-clamp-3 font-light leading-relaxed">{item.resumo}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex items-center justify-between text-[9px] font-mono text-stone-400">
                    <span>{new Date(item.criadoEm).toLocaleDateString('pt-BR')}</span>
                    <Link to="/noticias" className="text-destaque-1 font-bold uppercase tracking-wider hover:underline">Ler mais →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-fundo-escuro text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase block font-bold mb-2">Vozes do Campo</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Depoimentos dos Produtores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white/5 border border-white/10 p-6 rounded-sm flex flex-col justify-between">
                <Quote className="w-6 h-6 text-destaque-1 mb-4" />
                <p className="text-white/80 text-sm italic font-sans leading-relaxed mb-6">{t.citacao}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {t.urlAvatar ? (
                    <img src={t.urlAvatar} alt={t.nome || ''} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-10 h-10 bg-destaque-1 text-white font-mono font-bold text-sm flex items-center justify-center rounded-full">
                      {(t.nome || '?')[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-serif font-bold text-white text-sm">{t.nome}</div>
                    <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">{t.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
