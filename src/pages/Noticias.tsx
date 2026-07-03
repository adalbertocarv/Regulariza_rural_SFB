import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, Noticia } from '../lib/api';

export default function Noticias() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeArticle, setActiveArticle] = useState<Noticia | null>(null);

  const categories = ['LEGISLAÇÃO', 'CAMPO', 'TECNOLOGIA', 'MERCADO', 'SUSTENTABILIDADE', 'BIODIVERSIDADE'];

  useEffect(() => {
    setLoading(true);
    api.getNews({ limit: 100 })
      .then((res) => setNews(res.items))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (catLabel: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catLabel)
        ? prev.filter((c) => c !== catLabel)
        : [...prev, catLabel]
    );
    setVisibleCount(6);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearch('');
    setVisibleCount(6);
  };

  const filteredArticles = useMemo(() => {
    return news.filter((art) => {
      const matchSearch =
        art.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (art.resumo && art.resumo.toLowerCase().includes(search.toLowerCase()));

      const matchCat =
        selectedCategories.length === 0 ||
        (art.categoria && selectedCategories.includes(art.categoria.toUpperCase()));

      return matchSearch && matchCat;
    });
  }, [news, search, selectedCategories]);

  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  return (
    <div className="bg-preto-5 text-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-8 sm:mt-12">
        {/* Header */}
        <header className="mb-12">
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[10px] uppercase mb-3 block font-bold">Informativos</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-black tracking-tight mb-4">
            Notícias e <span className="font-serif italic text-destaque-1">Atualizações</span>
          </h1>
          <p className="text-stone-700 font-sans text-sm max-w-3xl leading-relaxed">
            Acompanhe as últimas informações sobre regularização rural, legislação ambiental, inovações geotecnológicas e práticas de conservação sustentável.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs">
                <h3 className="text-xs font-mono font-bold tracking-[0.18em] mb-4 uppercase text-black">Filtrar Categoria</h3>
                <div className="h-[2px] w-12 bg-destaque-1 mb-6" />

                <div className="space-y-4">
                  {categories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat);
                    return (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat)}
                          className="w-4 h-4 rounded-none border-preto-10 text-destaque-1 focus:ring-destaque-1 bg-white cursor-pointer"
                        />
                        <span className={`text-xs tracking-tight uppercase font-mono transition-colors ${
                          isChecked ? 'text-destaque-1 font-bold' : 'text-stone-600 group-hover:text-destaque-1'
                        }`}>
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="h-[1px] bg-preto-10 my-6" />

                <button
                  type="button"
                  onClick={handleClearFilters}
                  disabled={selectedCategories.length === 0 && search === ''}
                  className="text-[10px] font-mono uppercase tracking-wider font-bold text-destaque-1 hover:text-destaque-2 underline transition-all cursor-pointer disabled:opacity-30 disabled:no-underline"
                >
                  Limpar Filtros
                </button>
              </div>

              {/* Search */}
              <div className="bg-white p-6 rounded-sm border border-preto-10 shadow-xs">
                <h3 className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-destaque-1 mb-3">Pesquisa Rápida</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Palavra-chave..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setVisibleCount(6); }}
                    className="w-full bg-preto-5 border border-preto-10 rounded-sm pl-9 pr-4 py-2 text-xs font-sans focus:ring-1 focus:ring-destaque-1 focus:border-destaque-1 focus:outline-none placeholder-stone-400"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 space-y-12">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-destaque-1 animate-spin" /></div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white p-12 rounded-sm border border-preto-10 text-center space-y-4 shadow-xs">
                <p className="text-stone-600 font-light text-sm">Nenhum artigo encontrado para os filtros ativos.</p>
                <button
                  onClick={handleClearFilters}
                  className="border-2 border-destaque-1 text-destaque-1 hover:bg-destaque-1 hover:text-white px-5 py-2.5 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold transition-all cursor-pointer"
                >
                  Resetar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {paginatedArticles.map((art) => (
                    <article
                      key={art.id}
                      className="bg-white rounded-sm overflow-hidden border border-preto-10 hover:border-destaque-1/40 hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer group"
                      onClick={() => setActiveArticle(art)}
                    >
                      <div>
                        {art.urlImagem && (
                          <div className="relative h-44 sm:h-48 overflow-hidden bg-[#fafafa] select-none border-b border-preto-10">
                            <img
                              className="w-full h-full object-cover transition-transform duration-700 pointer-events-none select-none grayscale group-hover:grayscale-0"
                              src={art.urlImagem}
                              alt={art.titulo}
                            />
                            {art.categoria && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-destaque-1 text-white px-2.5 py-1 rounded-none text-[9px] font-mono uppercase tracking-wider font-bold">
                                  {art.categoria}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider font-bold text-destaque-2 mb-3 select-none">
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-destaque-1" />
                            <span>{new Date(art.criadoEm).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <h2 className="text-xl font-serif text-black font-bold leading-snug mb-3 group-hover:text-destaque-1 transition-colors line-clamp-2">
                            {art.titulo}
                          </h2>
                          <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 font-light">
                            {art.resumo}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-100 mt-4 text-[10px] font-mono uppercase tracking-wider font-bold text-destaque-1">
                        <span>Ler artigo completo</span>
                        <span>→</span>
                      </div>
                    </article>
                  ))}
                </div>

                {paginatedArticles.length < filteredArticles.length && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="border border-destaque-1 text-destaque-1 hover:bg-destaque-1 hover:text-white px-8 py-3 rounded-sm font-mono uppercase tracking-[0.18em] text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Carregar Mais Notícias
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-sm overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-preto-10 shadow-2xl relative"
            >
              <div className="relative h-64 bg-stone-900 overflow-hidden">
                {activeArticle.urlImagem && (
                  <img src={activeArticle.urlImagem} alt={activeArticle.titulo} className="w-full h-full object-cover grayscale brightness-75" />
                )}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono">
                  {activeArticle.categoria && <span className="bg-destaque-1 text-white px-2 py-0.5 font-bold uppercase">{activeArticle.categoria}</span>}
                  <span className="text-stone-400">{new Date(activeArticle.criadoEm).toLocaleDateString('pt-BR')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black leading-tight">{activeArticle.titulo}</h2>
                <div className="h-[2px] w-12 bg-destaque-1" />
                <p className="text-stone-700 text-sm font-sans leading-relaxed pt-2">{activeArticle.conteudo || activeArticle.resumo}</p>
                <div className="pt-6 border-t border-stone-100 flex justify-end">
                  <button onClick={() => setActiveArticle(null)} className="px-6 py-2.5 bg-preto-5 border border-preto-10 font-mono text-[10px] uppercase tracking-wider font-bold">Fechar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
