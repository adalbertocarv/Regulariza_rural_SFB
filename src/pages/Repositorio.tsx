import { useState, useEffect, useMemo } from 'react';
import { Search, Download, Eye, BookOpen, AlertCircle, ChevronRight, X, FileText, Image, Video, PenTool, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, DocumentoRepositorio } from '../lib/api';

export default function Repositorio() {
  const [documents, setDocuments] = useState<DocumentoRepositorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Documentos');
  const [search, setSearch] = useState('');
  const [viewingDoc, setViewingDoc] = useState<DocumentoRepositorio | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [downloadToastText, setDownloadToastText] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getDocuments()
      .then((data) => setDocuments(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { label: 'Documentos', icon: FileText },
    { label: 'Fotos', icon: Image },
    { label: 'Vídeos', icon: Video },
    { label: 'Manual da Marca', icon: PenTool },
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchCat = !doc.tipoDocumento || doc.tipoDocumento.toUpperCase().includes(activeCategory.toUpperCase()) || activeCategory === 'Documentos';
      const matchSearch =
        doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (doc.descricao && doc.descricao.toLowerCase().includes(search.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [documents, activeCategory, search]);

  const triggerDownload = (doc: DocumentoRepositorio) => {
    if (downloadingDocId) return;
    setDownloadingDocId(doc.id);
    setProgressVal(0);

    const interval = setInterval(() => {
      setProgressVal((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingDocId(null);
            setDownloadToastText(`Download de "${doc.titulo}" iniciado com sucesso!`);
            setTimeout(() => setDownloadToastText(null), 4000);
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  return (
    <div className="bg-preto-5 text-black min-h-screen pt-16">
      {/* Hero Header */}
      <section className="relative h-[350px] sm:h-[400px] flex items-center overflow-hidden max-w-7xl mx-auto rounded-sm mt-4 shadow-xs">
        <div className="absolute inset-0 z-0 select-none">
          <img
            alt="Paisagem rural"
            className="w-full h-full object-cover grayscale brightness-[0.45]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzUcHD8EJUdogIFDVppXhrwCoXzgMj2Ung5dMmcNi4GAvBJeqiA3H6Z5xpaYLS_FY0RWzomxeyyE1Y0x2SRU85busjI6mAu_6hMY63yP7ELNbQcK08XSxgW_v7vt33di8Cc3jfkvFe7sV0443B1uwj31F52FGlqu3PA5HurNHktgfbEavVO1-ZsKPu8J5ZaV8iyjhdSbZn_-2mtNTxjeLLrjmyJz0Oc_jKOs4Hn2czaiDbp4CaKeBaapWLxCCoTsmTl2vEF0XzoEQ"
          />
          <div className="absolute inset-0 bg-[#038E5C]/15 mix-blend-overlay" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-fundo-escuro/95 via-transparent to-transparent" />
        </div>
        <div className="px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="text-destaque-1 font-mono tracking-[0.25em] uppercase text-[10px] font-bold mb-4 block bg-white px-2 py-1 max-w-fit rounded-sm">Repositório Institucional</span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight mb-5 tracking-tight">
              Legado do <span className="font-serif italic text-destaque-1">Projeto</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base max-w-lg leading-relaxed font-sans font-light">
              Acesse a base completa de conhecimentos, modelos administrativos, cartilhas de conservação e materiais de imprensa.
            </p>
          </div>
        </div>
      </section>

      {/* Switcher & Search */}
      <section className="bg-white py-8 border-b border-preto-10 select-none max-w-7xl mx-auto mt-6 rounded-sm shadow-xs">
        <div className="px-6 sm:px-8 space-y-6 lg:space-y-0 lg:flex items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-sm border border-preto-10 bg-preto-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => { setActiveCategory(cat.label); setSearch(''); }}
                  className={`px-4 py-2.5 rounded-sm text-[10px] font-mono uppercase tracking-[0.15em] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSelected ? 'bg-destaque-1 text-white shadow-sm' : 'text-stone-600 hover:bg-destaque-1/10 hover:text-destaque-1'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-preto-5 border border-preto-10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-black focus:ring-1 focus:ring-destaque-1 focus:border-destaque-1 focus:outline-none placeholder-stone-500 font-sans font-bold"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3.5 top-3.5" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-destaque-1 animate-spin" /></div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white p-12 rounded-sm border border-preto-10 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto stroke-[1.5]" />
            <p className="text-stone-600 font-light text-sm">Nenhum documento encontrado para a busca atual.</p>
            <button onClick={() => { setActiveCategory('Documentos'); setSearch(''); }} className="border-2 border-destaque-1 text-destaque-1 hover:bg-destaque-1 hover:text-white px-5 py-2.5 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold transition-all cursor-pointer">
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const isDownloading = downloadingDocId === doc.id;
              return (
                <div key={doc.id} className="group bg-white p-8 rounded-sm border border-preto-10 flex flex-col justify-between hover:border-destaque-1/40 hover:translate-y-[-2px] transition-all duration-300 shadow-xs">
                  <div>
                    <div className="flex justify-between items-center mb-6 select-none">
                      <div className="p-2.5 border border-preto-10 text-destaque-1 bg-destaque-1/5 rounded-none">
                        <BookOpen className="w-4.5 h-4.5 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1a1a1a] px-2.5 py-1 bg-preto-5 border border-preto-10">
                        {doc.tipoIcone?.toUpperCase() || 'PDF'} • {doc.tamanhoArquivo || '2.0 MB'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-serif text-[#1a1a1a] font-bold leading-snug group-hover:text-destaque-1 transition-colors">
                        {doc.titulo}
                      </h3>
                      <p className="text-stone-600 text-xs leading-relaxed font-sans font-light">
                        {doc.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {isDownloading ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-destaque-1">
                          <span>Processando arquivo...</span>
                          <span>{progressVal}%</span>
                        </div>
                        <div className="w-full h-1 bg-preto-10 rounded-none overflow-hidden">
                          <div className="h-full bg-destaque-1 transition-all duration-100" style={{ width: `${progressVal}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => triggerDownload(doc)}
                          className="flex-1 bg-destaque-1 hover:bg-destaque-1/90 text-white py-3 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="p-3 rounded-sm border border-preto-10 text-stone-600 hover:border-destaque-1 hover:text-destaque-1 transition-all cursor-pointer"
                          title="Visualizar documento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <p className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider text-center leading-normal select-none">
                      Uso restrito a fins institucionais e educativos
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {viewingDoc && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white rounded-sm overflow-hidden max-w-lg w-full shadow-2xl relative border border-preto-10">
              <div className="bg-fundo-escuro text-white p-6 relative">
                <span className="text-[10px] font-mono font-bold text-destaque-1 uppercase tracking-widest block mb-2">{viewingDoc.tipoIcone?.toUpperCase() || 'PDF'} • {viewingDoc.tamanhoArquivo || '2 MB'}</span>
                <h4 className="font-serif text-lg leading-tight pr-8 font-bold">{viewingDoc.titulo}</h4>
                <button onClick={() => setViewingDoc(null)} className="absolute top-6 right-6 text-white/75 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-xs text-stone-600 leading-relaxed font-sans font-light">{viewingDoc.descricao}</p>
                <div className="flex gap-3">
                  <button onClick={() => setViewingDoc(null)} className="flex-1 border border-preto-10 text-[#1a1a1a] hover:bg-preto-5 py-3 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold cursor-pointer">Fechar</button>
                  <button onClick={() => { const doc = viewingDoc; setViewingDoc(null); triggerDownload(doc); }} className="flex-1 bg-destaque-1 hover:bg-destaque-1/90 text-white py-3 rounded-sm font-mono uppercase tracking-[0.15em] text-[10px] font-bold cursor-pointer border-none">Baixar Arquivo</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {downloadToastText && (
          <div className="fixed bottom-6 right-6 z-50 p-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-fundo-escuro text-white p-4 rounded-sm shadow-2xl flex items-center gap-3 border border-destaque-1/25">
              <div className="text-xs font-sans text-white">{downloadToastText}</div>
              <button onClick={() => setDownloadToastText(null)} className="text-destaque-1 font-mono uppercase text-[9px] font-bold tracking-wider pl-4 cursor-pointer">[ok]</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
