import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import { adminApi, Atividade } from '../../../lib/api';
import { ConfirmDelete } from './compartilhado';
import EditorAtividade from './EditorAtividade';

const COMPONENTES_NOMES: Record<number, string> = {
  1: 'Fortalecimento institucional',
  2: 'Apoio à regularização ambiental',
  3: 'Recomposição e restauração ecológica',
  4: 'Gestão do Projeto',
};

export default function GerenciadorAtividades() {
  const [items, setItems]         = useState<Atividade[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing]     = useState<Atividade | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'publicado' | 'rascunho'>('todos');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllActivities({ limit: 200 });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setShowEditor(true); };
  const openEdit = (item: Atividade) => { setEditing(item); setShowEditor(true); };
  const closeEditor = () => { setShowEditor(false); setEditing(null); };
  const handleSaved = () => { closeEditor(); loadData(); };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await adminApi.deleteActivity(deleteId); setDeleteId(null); loadData(); }
    finally { setDeleting(false); }
  };

  const filtered = items.filter((item) => {
    if (filterStatus === 'todos') return true;
    return item.status === filterStatus;
  });

  const counts = {
    todos: items.length,
    publicado: items.filter((i) => i.status === 'publicado').length,
    rascunho:  items.filter((i) => i.status === 'rascunho').length,
  };

  if (showEditor) {
    return (
      <EditorAtividade
        editing={editing}
        onClose={closeEditor}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">Ações de Campo</span>
          <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Atividades</h2>
          <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
        </div>
        <button
          id="activities-create-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-destaque-1 hover:bg-destaque-1/90 text-white px-4 py-2.5 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nova Atividade
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['todos', 'publicado', 'rascunho'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider border transition-colors ${
              filterStatus === s
                ? s === 'rascunho'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-destaque-1 text-white border-destaque-1'
                : 'border-preto-10 text-black/50 hover:border-destaque-1/40'
            }`}
          >
            {s === 'publicado' && <Eye className="w-3 h-3" />}
            {s === 'rascunho'  && <EyeOff className="w-3 h-3" />}
            {s === 'todos' ? 'Todos' : s} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-preto-10">
          <Zap className="w-10 h-10 text-black/10" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhuma atividade encontrada</span>
          <button onClick={openCreate} className="font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-destaque-1 hover:underline">
            Criar a primeira →
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white border border-preto-10 overflow-hidden hover:border-destaque-1/40 hover:-translate-y-0.5 transition-all duration-200">
              {/* Cover image */}
              {(() => {
                const cover = item.imagens?.[0]?.url;
                return cover ? (
                  <div className="relative h-36 overflow-hidden border-b border-preto-10">
                    <img src={cover} alt={item.titulo} className="w-full h-full object-cover grayscale brightness-95" />
                    {item.imagens?.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] font-mono px-1.5 py-0.5">
                        +{item.imagens.length - 1} fotos
                      </span>
                    )}
                  </div>
                ) : null;
              })()}
              <div className="p-5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider text-black/40 uppercase mb-2 border-b border-preto-5 pb-2">
                  <span>Componente {item.componenteId || 1}: {COMPONENTES_NOMES[item.componenteId || 1]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-destaque-2">{item.estados?.join(', ') || 'Todas UFs'}</span>
                    {item.status === 'rascunho' && (
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.tipoAcao && (
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-destaque-1 text-white uppercase tracking-wider">{item.tipoAcao}</span>
                  )}
                  {item.demandante && (
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-preto-5 border border-preto-10 text-black/70 uppercase tracking-wider">{item.demandante}</span>
                  )}
                  {item.insignias.map((b) => (
                    <span key={b} className="text-[8px] font-mono font-bold px-2 py-0.5 bg-destaque-1/10 text-destaque-1 uppercase tracking-wider">{b}</span>
                  ))}
                </div>
                <h3 className="font-serif font-bold text-black mb-1 leading-tight">{item.titulo}</h3>
                <p className="text-xs text-black/50 line-clamp-2 mb-4 font-sans leading-relaxed">{item.descricao}</p>

                {/* Stats pills */}
                <div className="flex gap-3 mb-3">
                  {item.imagens?.length > 0 && (
                    <span className="text-[8px] font-mono text-black/40">📷 {item.imagens.length} imagem(ns)</span>
                  )}
                  {item.pontos?.length > 0 && (
                    <span className="text-[8px] font-mono text-black/40">📍 {item.pontos.length} ponto(s)</span>
                  )}
                </div>

                <div className="flex justify-end gap-1 border-t border-preto-5 pt-3">
                  <button onClick={() => openEdit(item)} className="p-2 text-black/30 hover:text-destaque-2 hover:bg-destaque-2/5 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
