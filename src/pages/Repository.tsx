import { useState, useEffect } from 'react';
import { Search, Download, Eye, Share2, FileText, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { api, RepositoryDocument } from '../lib/api';

const iconMap: Record<string, React.ReactNode> = {
  pdf: <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><FileText className="w-6 h-6 text-green-700" /></div>,
  docx: <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-700" /></div>,
  zip: <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><MapPin className="w-6 h-6 text-gray-700" /></div>,
  artigo: <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-700" /></div>,
  video: <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><Eye className="w-6 h-6 text-gray-700" /></div>,
};

const tabs = ['Documentos', 'Fotos', 'Vídeos', 'Entrevistas', 'Manual da Marca', 'Blog/Matérias'];

export default function Repository() {
  const [documents, setDocuments] = useState<RepositoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Documentos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getDocuments().then(setDocuments).finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="pt-16 bg-white">
      {/* Hero */}
      <section className="relative h-96 flex items-center overflow-hidden" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=1920)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-900/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <span className="inline-block bg-green-500/80 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">REPOSITÓRIO INSTITUCIONAL</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">Legado do Projeto</h1>
          <p className="text-green-100 text-lg mt-3 max-w-2xl">Acesse a base completa de conhecimentos, diretrizes e registros gerados para a governança das terras rurais.</p>
        </div>
      </section>

      {/* Tabs and Search */}
      <section className="bg-gray-50 sticky top-16 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeTab === tab ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-green-400'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar materiais..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {filtered.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="mb-4">{iconMap[doc.iconType || 'pdf'] || iconMap.pdf}</div>
                    <div className="flex-1 mb-4">
                      <p className="text-xs text-gray-500 font-bold mb-2">{doc.fileSize}</p>
                      <h3 className="font-bold text-gray-900 mb-2 text-base leading-snug">{doc.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
                    </div>
                    {doc.docType === 'DOWNLOAD' ? (
                      <a href={doc.fileUrl || '#'} download className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    ) : doc.docType === 'LINK' ? (
                      <a href={doc.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <FileText className="w-4 h-4" /> Ler Matéria
                      </a>
                    ) : (
                      <a href={doc.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Eye className="w-4 h-4" /> Assistir
                      </a>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Nenhum material encontrado.</div>}
            </>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Não encontrou o que procurava?</h2>
              <p className="text-green-100 mb-8 leading-relaxed">Nossa equipe está à disposição para fornecer documentos específicos ou esclarecer dúvidas sobre as publicações do projeto.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-2.5 bg-green-700 hover:bg-green-600 rounded-lg font-semibold transition-colors">Falar com Suporte</button>
                <button className="px-6 py-2.5 border-2 border-green-500 text-white hover:bg-green-800 rounded-lg font-semibold transition-colors">Central de Ajuda</button>
              </div>
            </div>
            <div className="space-y-6 bg-green-800/50 p-6 rounded-xl border border-green-700">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wider">E-MAIL DIRETO</p>
                  <p className="text-white font-semibold mt-1">contato@regularizarural.org</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wider">TELEFONE</p>
                  <p className="text-white font-semibold mt-1">+55 (61) 3344-5566</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
