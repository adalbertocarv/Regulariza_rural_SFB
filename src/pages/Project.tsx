import { ArrowRight, Leaf, Users, Building2, Map, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const panoramaCards = [
  {
    icon: Leaf,
    title: 'APP - Áreas de Preservação',
    description: 'Monitoramento de matas ciliares e encostas críticas.',
    value: '42.5M',
    unit: 'ha',
    highlight: true,
  },
  {
    icon: Users,
    title: 'Reserva Legal',
    description: 'CONSOLIDADO',
    value: '128.3M',
    unit: 'ha',
    highlight: false,
  },
  {
    icon: Map,
    title: 'AUR',
    description: 'Área de Uso Restrito em biomas frágeis.',
    value: '15.8M',
    unit: 'ha',
    highlight: false,
  },
];

const topStates = ['MT', 'PA', 'MG', 'GO', 'MS', 'TO', 'BA'];

const timeline = [
  {
    year: '2019',
    title: 'O Marco Inicial',
    description: 'Identificação do gargalo na análise dos cadastros e formação da coalizão técnica original.',
  },
  {
    year: '2021',
    title: 'Digitalização',
    description: 'Implementação da análise dinamizada via satélite em parceria com centros de tecnologia florestal',
  },
  {
    year: '2023',
    title: 'Expansão Regional',
    description: 'Ampliação para todas as regiões brasileiras com novos parceiros estratégicos e integração de dados',
  },
  {
    year: '2024',
    title: 'Consolidação',
    description: 'Alcance de 42.5M hectares monitorados e integração com sistemas federais de gestão ambiental',
  },
];

const fundamentosCards = [
  {
    value: '42.5M ha',
    label: 'ÁREAS DE PRESERVAÇÃO',
  },
  {
    value: '500',
    label: 'FAMÍLIAS ATENDIDAS',
  },
  {
    value: '156',
    label: 'MUTIRÕES REALIZADOS',
  },
];

export default function Project() {
  return (
    <main className="pt-16">
      {/* Page Header */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Paisagem rural brasileira"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative z-10 text-left px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Conheça o Projeto<br />
            Regulariza Rural
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
            Compromisso com a legalidade ambiental e a sustentabilidade no campo através da inteligência e tecnologia.
          </p>
        </div>
      </section>

      {/* Fundamentos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest text-green-600 uppercase">Fundamentos</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 leading-snug">
                Gestão Inteligente para<br />
                <span className="text-green-600">Territórios Sustentáveis</span>
              </h2>
              <p className="text-gray-600 mt-5 leading-relaxed text-lg">
                O Regulariza Rural é uma iniciativa estratégica voltada para a aceleração da análise do Cadastro Ambiental
                Rural (CAR) e a promoção da regularização de imóveis rurais em todo o território nacional.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Nossa abordagem une rigor técnico, ferramentas de geoprocessamento avançadas e uma visão holística sobre a
                conservação das Áreas de Preservação Permanente (APP) e Reserva Legal (RL).
              </p>
            </div>

            <div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Agricultura inteligente"
                className="w-full rounded-2xl shadow-lg"
              />
              <div className="grid grid-cols-3 gap-3 mt-6">
                {fundamentosCards.map((card) => (
                  <div key={card.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-green-700">{card.value}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-1.5 leading-snug">{card.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panorama */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Panorama da Regularização</h2>
              <p className="text-gray-500 mt-2 max-w-lg">
                Monitoramento em tempo real das áreas cadastradas e seus status ambientais conforme o Serviço Florestal
                Brasileiro (SFB).
              </p>
            </div>
            <a
              href="#"
              className="hidden sm:flex items-center gap-1.5 text-green-700 font-medium text-sm hover:gap-2.5 transition-all"
            >
              Acessar SFB <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {panoramaCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl p-7 flex flex-col justify-between min-h-64 ${
                  card.highlight
                    ? 'bg-white border-2 border-green-600 shadow-lg'
                    : card.title === 'Reserva Legal'
                    ? 'bg-green-700 text-white'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <div>
                  <card.icon className={`w-6 h-6 mb-3 ${card.highlight ? 'text-green-600' : card.title === 'Reserva Legal' ? 'text-white' : 'text-gray-600'}`} />
                  <h3 className={`font-bold text-lg mb-1 ${card.title === 'Reserva Legal' ? 'text-white' : 'text-gray-900'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm ${card.title === 'Reserva Legal' ? 'text-green-100' : 'text-gray-500'}`}>
                    {card.description}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${card.highlight ? 'text-green-700' : card.title === 'Reserva Legal' ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                  <span className="text-lg ml-1">{card.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Top Estados em Regularização</h3>
              <div className="flex flex-wrap gap-2">
                {topStates.map((state) => (
                  <div
                    key={state}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {state}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
              <span>Abrangência Nacional</span>
              <span className="font-semibold text-gray-900">26 Estados + DF monitorados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Linha do tempo</h2>
            <p className="text-gray-500 max-w-lg">
              O projeto nasceu da necessidade urgente de conciliar o desenvolvimento agropecuário brasileiro com a
              preservação de nossos biomas fundamentais.
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-green-600 mt-2" />
                  {i < timeline.length - 1 && <div className="w-0.5 h-24 bg-gray-200 mt-2" />}
                </div>
                <div className="pb-6">
                  <div className="text-lg font-bold text-green-700 mb-1">{item.year}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Quer conhecer mais sobre nossas ações?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Explore as principais frentes de trabalho e veja como o Regulariza Rural está transformando a gestão ambiental
            nas propriedades rurais.
          </p>
          <Link
            to="/atividades"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Explorar Atividades <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
