import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ArrowRight, Mountain, Users, CheckCircle, FileText,
  Quote, Satellite, Sprout, Scale, Loader2,
} from 'lucide-react';
import { api, News, Activity, Testimonial, DashboardStat } from '../lib/api';

const STAT_ICON_MAP: Record<string, React.ElementType> = {
  hectares_preservados: Mountain,
  produtores_atendidos: Users,
  indice_regularidade: CheckCircle,
  car_processados: FileText,
};

const STAT_LABELS_HOME = ['hectares_preservados', 'produtores_atendidos', 'indice_regularidade', 'car_processados'];

const BADGE_COLOR: Record<string, string> = {
  RECUPERAÇÃO: 'bg-sky-100 text-sky-700',
  CERCAMENTO: 'bg-blue-600 text-white',
  DEFAULT: 'bg-lime-100 text-lime-700',
};

function BrazilMap() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 420" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M120,40 L180,30 L240,35 L290,50 L320,80 L340,120 L345,160 L330,200 L310,230 L320,260 L310,290 L280,310 L260,340 L240,370 L220,390 L200,395 L180,385 L160,360 L140,330 L120,310 L100,280 L80,250 L70,210 L75,170 L65,130 L75,90 L95,60 Z" fill="#15803d" fillOpacity="0.15" stroke="#15803d" strokeWidth="2" />
        <path d="M195,80 L230,85 L255,100 L260,130 L250,155 L230,165 L210,155 L195,130 L190,105 Z" fill="#15803d" fillOpacity="0.5" />
        <path d="M160,180 L210,175 L235,195 L240,225 L220,245 L195,250 L170,240 L155,220 L150,200 Z" fill="#15803d" fillOpacity="0.65" />
        <circle cx="222" cy="120" r="4" fill="#22c55e" /><circle cx="222" cy="120" r="8" fill="#22c55e" fillOpacity="0.3" />
        <circle cx="155" cy="200" r="4" fill="#22c55e" /><circle cx="155" cy="200" r="8" fill="#22c55e" fillOpacity="0.3" />
        <circle cx="248" cy="265" r="4" fill="#22c55e" /><circle cx="248" cy="265" r="8" fill="#22c55e" fillOpacity="0.3" />
      </svg>
      <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>Projetos Ativos</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-700 opacity-40 inline-block"></span>Áreas Monitoradas</div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getNews({ limit: 6 }),
      api.getTestimonials(),
      api.getActivities({ limit: 3 }),
    ]).then(([statsData, newsData, testimonialsData, activitiesData]) => {
      setStats(statsData);
      setNews(newsData.items);
      setTestimonials(testimonialsData);
      setActivities(activitiesData.items);
    }).finally(() => setLoading(false));
  }, []);

  const homeStats = stats.filter((s) => STAT_LABELS_HOME.includes(s.keyName));
  const newsCards = news.slice(0, 3);
  const newsText = news.slice(3, 6);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen min-h-[580px] flex items-center justify-center overflow-hidden">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFnHqfgfftjENfLZ77BM791TK2fyzTGgrayydwjC5M5I0vhntXAVHs_8-SQoQqniklj2TQ97K2tyL3z8ks_UY5ES0kt1ScbCTmwSab8UDkzu4KcSZZf9YiWKVfDZdtA2IDgEVbkJ3X9ziALeriTlqa6cBMLcqlQFMF75dc5ilJ338RlNEzdUgpS0xnfprDLvDwHzz1B-9QVoYP6QFn6B7lvf40VXpidcnz1lMlTBuX0FIEsge5anCMrw9WGxMoZphBsFE7b8s2HKg" alt="Campos verdes brasileiros" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Recuperando as <span className="text-green-400">matas</span><br />
            <span className="text-green-400">Nativas brasileiras</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Unindo precisão técnica e compromisso ambiental para regularizar o futuro do campo.
          </p>
          <Link to="/atividades" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/50 px-8 py-3.5 rounded-md font-medium hover:bg-white hover:text-gray-900 transition-all duration-200">
            Conheça Nossas Ações
          </Link>
        </div>
        <a href="#sobre" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-7 h-7" />
        </a>
      </section>

      {/* About */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest text-green-600 uppercase">Sobre o Projeto</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 leading-snug">Preservação através da <span className="text-green-600">Conformidade Legal.</span></h2>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Em uma sociedade cada vez mais consciente de que o meio ambiente deve ser preservado, o <strong className="text-gray-900">Projeto Regulariza Rural</strong> veio para apoiar a regularização ambiental de imóveis rurais e aprimorar o monitoramento da vegetação, garantindo segurança jurídica e sustentabilidade produtiva.
              </p>
              <Link to="/projeto" className="inline-flex items-center gap-2 mt-6 text-green-700 font-medium hover:gap-3 transition-all">
                Saiba mais sobre o projeto <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nossos impactos</h2>
          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {homeStats.map((stat) => {
                const Icon = STAT_ICON_MAP[stat.keyName] || FileText;
                return (
                  <div key={stat.keyName} className="bg-gray-50 rounded-xl p-7 hover:shadow-md transition-shadow border border-gray-100">
                    <Icon className="w-7 h-7 text-green-600 mb-4" />
                    <div className="text-3xl font-bold text-gray-900">{stat.value}{stat.unit}</div>
                    <div className="text-xs font-semibold tracking-widest text-gray-500 mt-1 uppercase">{stat.keyName.replace(/_/g, ' ')}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/resultados" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-md font-medium transition-colors">
              Ver Painel Completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
              <p className="text-gray-500 mt-2">Fique por dentro das novidades e marcos do projeto.</p>
            </div>
            <Link to="/noticias" className="hidden sm:flex items-center gap-1.5 text-green-700 font-medium hover:gap-2.5 transition-all text-sm">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? <LoadingSpinner /> : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {newsCards.map((item) => (
                  <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                    <div className="p-5">
                      {item.category && (
                        <span className={`text-xs font-bold tracking-wider px-2 py-0.5 rounded ${item.categoryColor || 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                      )}
                      <h3 className="font-bold text-gray-900 mt-3 mb-2 leading-snug">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.excerpt}</p>
                      <p className="text-xs text-gray-400 mt-4">{new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </article>
                ))}
              </div>
              {newsText.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6">
                  {newsText.map((item) => (
                    <article key={item.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.excerpt}</p>
                      <p className="text-xs text-gray-400 mt-4">{new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Vozes do Campo</h2>
          {loading ? <LoadingSpinner /> : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="border-l-4 border-green-500 pl-5 py-2 bg-gray-50 rounded-r-xl pr-5">
                  <Quote className="w-5 h-5 text-green-500 mb-3" />
                  <p className="text-gray-700 leading-relaxed text-sm italic mb-5">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    {t.avatarUrl && <img src={t.avatarUrl} alt={t.name || ''} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <div className="text-sm font-bold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-green-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug max-w-2xl mx-auto">Quer saber como estamos transformando a realidade rural?</h2>
            <p className="text-green-100 mt-4 max-w-lg mx-auto">Conheça nossas principais frentes de trabalho para promover a sustentabilidade no campo.</p>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {activities.map((act) => {
                const Icon = act.badges[0] === 'RECUPERAÇÃO' ? Sprout : act.badges[0] === 'CERCAMENTO' ? Satellite : Scale;
                return (
                  <div key={act.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {act.imageUrl && <img src={act.imageUrl} alt={act.title} className="w-full h-44 object-cover" />}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {act.badges.map((b) => (
                          <span key={b} className={`text-xs font-bold px-2 py-0.5 rounded ${BADGE_COLOR[b] || BADGE_COLOR.DEFAULT}`}>{b}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-gray-900 mt-2 mb-2">{act.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{act.description}</p>
                      <Link to="/atividades" className="inline-flex items-center gap-1.5 mt-4 text-green-700 font-medium text-sm hover:gap-2.5 transition-all">
                        Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center">
            <Link to="/atividades" className="inline-flex items-center gap-2 bg-white/10 border border-white/50 text-white px-7 py-3 rounded-md font-medium hover:bg-white hover:text-green-700 transition-all">
              Ver Todas Atividades
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Mapa de Atuação</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Acompanhe nossas ações e projetos de regularização espalhados pelo território nacional.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
            <BrazilMap />
            <div className="grid grid-cols-3 gap-4 mt-8 text-center border-t border-gray-100 pt-6">
              <div><div className="text-2xl font-bold text-green-700">5</div><div className="text-xs text-gray-500 mt-0.5">Regiões</div></div>
              <div><div className="text-2xl font-bold text-green-700">23</div><div className="text-xs text-gray-500 mt-0.5">Estados</div></div>
              <div><div className="text-2xl font-bold text-green-700">140+</div><div className="text-xs text-gray-500 mt-0.5">Municípios</div></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
