import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api, News } from '../lib/api';

const CATEGORIES = [
  'CAR & Regularização',
  'Preservação Florestal',
  'Crédito de Carbono',
  'Tecnologia no Campo',
];

const CAT_MAP: Record<string, string[]> = {
  'CAR & Regularização': ['LEGISLAÇÃO', 'AMBIENTAL'],
  'Preservação Florestal': ['AMBIENTAL', 'BIODIVERSIDADE', 'SUSTENTABILIDADE'],
  'Crédito de Carbono': ['MERCADO'],
  'Tecnologia no Campo': ['TECNOLOGIA', 'CAMPO'],
};

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    api.getNews({ page: currentPage, limit: itemsPerPage }).then((data) => {
      setItems(data.items);
      setTotalPages(data.totalPages);
    }).finally(() => setLoading(false));
  }, [currentPage]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
    setCurrentPage(1);
  };

  const filtered = selectedCategories.length === 0
    ? items
    : items.filter((item) =>
        selectedCategories.some((cat) =>
          (CAT_MAP[cat] || []).some((apiCat) => item.category?.toUpperCase().includes(apiCat))
        )
      );

  return (
    <main className="pt-16 bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Categorias</h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 cursor-pointer accent-green-600"
                    />
                    <span className="text-gray-700 group-hover:text-green-700 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <button onClick={() => { setSelectedCategories([]); setCurrentPage(1); }} className="mt-5 text-sm text-green-700 font-medium hover:text-green-800 transition-colors">
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-green-700 mb-3">Notícias e Atualizações</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Acompanhe as últimas informações sobre regularização rural, legislação ambiental e práticas de conservação sustentável.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {filtered.map((item) => (
                    <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="overflow-hidden h-48 bg-gray-100">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          {item.category && (
                            <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded ${item.categoryColor || 'bg-gray-100 text-gray-600'}`}>
                              {item.category}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug group-hover:text-green-700 transition-colors">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{item.excerpt}</p>
                        <button className="inline-flex items-center gap-1.5 text-green-700 font-medium text-sm hover:gap-2.5 transition-all">
                          Ler Mais <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === page ? 'bg-green-700 text-white' : 'border border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-700'}`}>
                        {page}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Regulariza Rural</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['PRIVACIDADE', 'TERMOS DE USO', 'MAPA DO SITE', 'ACESSIBILIDADE'].map((l) => (
              <a key={l} href="#" className="text-green-200 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-green-200 text-xs mt-8">© {new Date().getFullYear()} REGULARIZA RURAL - REGULARIZAÇÃO E PRESERVAÇÃO AMBIENTAL</p>
        </div>
      </section>
    </main>
  );
}
