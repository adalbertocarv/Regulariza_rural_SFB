import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, Users, Eye, Sliders, Loader2 } from 'lucide-react';
import { api, Atividade } from '../lib/api';

const badgeColors: Record<string, string> = {
  RECUPERAÇÃO: 'bg-yellow-100 text-yellow-700',
  'MATA ATLÂNTICA': 'bg-green-100 text-green-700',
  CERCAMENTO: 'bg-blue-100 text-blue-700',
  CERRADO: 'bg-blue-600 text-white',
  SEMIARID: 'bg-orange-100 text-orange-700',
  AMAZÔNIA: 'bg-emerald-100 text-emerald-700',
  CAATINGA: 'bg-red-100 text-red-700',
};

export default function Atividades() {
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ state: 'Todos os Estados', actionType: [] as string[] });

  const itemsPerPage = 2;

  useEffect(() => {
    setLoading(true);
    api.getActivities({ page: currentPage, limit: itemsPerPage }).then((data) => {
      setActivities(data.items);
      setTotalPages(data.totalPages);
    }).finally(() => setLoading(false));
  }, [currentPage]);

  const toggleActionType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      actionType: prev.actionType.includes(type) ? prev.actionType.filter((t) => t !== type) : [...prev.actionType, type],
    }));
  };

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative h-80 flex items-center overflow-hidden">
        <img src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Atividades" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">ECOSSISTEMA</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">Nossas<br /><span className="text-green-400">Atividades</span></h1>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, label: 'TOTAL DE ÁREAS MAPEADAS', value: '14.280', unit: 'hectares', highlight: false },
            { icon: Users, label: 'MUTIRÕES REALIZADOS', value: '156', unit: '', highlight: true },
            { icon: Eye, label: 'AÇÕES POR ESTADO', value: '08', unit: 'UF', highlight: false },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-6 shadow-md ${stat.highlight ? 'bg-green-700 text-white' : 'bg-white text-gray-900'}`}>
              <stat.icon className={`w-8 h-8 mb-4 ${stat.highlight ? 'text-white' : 'text-green-700'}`} />
              <div className={`text-xs font-bold tracking-widest mb-1 ${stat.highlight ? 'text-white/75' : 'text-gray-500'}`}>{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.highlight ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              {stat.unit && <div className={`text-sm mt-1 ${stat.highlight ? 'text-white/75' : 'text-gray-500'}`}>{stat.unit}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Sliders className="w-5 h-5 text-green-700" />
            <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
            <div className="flex-1 h-px bg-green-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="text-sm font-bold text-gray-700 uppercase mb-2 block">Estado (UF)</label>
              <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700">
                <option>Todos os Estados</option>
                <option>São Paulo</option><option>Minas Gerais</option><option>Rio de Janeiro</option><option>Bahia</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 uppercase mb-3 block">Tipo de Ação</label>
              <div className="space-y-2">
                {['Mutirões', 'Cercamento', 'Recuperação'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.actionType.includes(type)} onChange={() => toggleActionType(type)} className="w-4 h-4 accent-green-700 cursor-pointer" />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="relative h-64 overflow-hidden">
                      {activity.urlImagem && <img src={activity.urlImagem} alt={activity.titulo} className="w-full h-full object-cover" />}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {activity.insignias.map((badge) => (
                          <span key={badge} className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColors[badge] || 'bg-gray-200 text-gray-700'}`}>{badge}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.titulo}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">{activity.descricao}</p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{activity.rotuloAlvo || 'PÚBLICO'}</div>
                          <div className="text-lg font-bold text-green-700">{activity.valorAlvo}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">OBJETIVO</div>
                          <div className="text-lg font-bold text-gray-900">{activity.objetivo}</div>
                        </div>
                      </div>
                      <button className="mt-6 inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm hover:gap-2.5 transition-all">
                        Ver Detalhes da Ação <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors disabled:opacity-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === page ? 'bg-green-700 text-white' : 'border border-gray-300 text-gray-700 hover:border-green-600'}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors disabled:opacity-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
