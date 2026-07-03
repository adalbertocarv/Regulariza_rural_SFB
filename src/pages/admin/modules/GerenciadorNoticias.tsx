import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Newspaper } from 'lucide-react';
import { api, adminApi, Noticia } from '../../../lib/api';
import { Modal, ConfirmDelete, FileUpload, Field, inputClass, textareaClass, selectClass } from './compartilhado';

const CATEGORIES = [
  { label: 'Legislação',       value: 'LEGISLAÇÃO',       color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Tecnologia',       value: 'TECNOLOGIA',       color: 'bg-orange-100 text-orange-700' },
  { label: 'Sustentabilidade', value: 'SUSTENTABILIDADE', color: 'bg-blue-100 text-blue-700' },
  { label: 'Campo',            value: 'CAMPO',            color: 'bg-cyan-100 text-cyan-700' },
  { label: 'Ambiental',        value: 'AMBIENTAL',        color: 'bg-lime-100 text-lime-700' },
  { label: 'Mercado',          value: 'MERCADO',          color: 'bg-purple-100 text-purple-700' },
  { label: 'Social',           value: 'SOCIAL',           color: 'bg-red-100 text-red-700' },
  { label: 'Biodiversidade',   value: 'BIODIVERSIDADE',   color: 'bg-green-100 text-green-700' },
  { label: 'Evento',           value: 'EVENTO',           color: 'bg-teal-100 text-teal-700' },
];

const emptyForm: Partial<Noticia> = {
  titulo: '', resumo: '', conteudo: '',
  categoria: 'LEGISLAÇÃO', corCategoria: 'bg-yellow-100 text-yellow-700', urlImagem: '',
};

export default function GerenciadorNoticias() {
  const [items, setItems]       = useState<Noticia[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<Noticia | null>(null);
  const [form, setForm]         = useState<Partial<Noticia>>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (p = page) => {
    setLoading(true); setError('');
    try {
      const data = await api.getNews({ page: p, limit: 8 });
      setItems(data.items); setTotalPages(data.totalPages);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erro ao carregar'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: Noticia) => { setEditing(item); setForm(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleCategoryChange = (cat: string) => {
    const found = CATEGORIES.find((c) => c.value === cat);
    setForm((f) => ({ ...f, categoria: cat, corCategoria: found?.color || '' }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await adminApi.updateNews(editing.id, form) : await adminApi.createNews(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try {
      await adminApi.deleteNews(deleteId); setDeleteId(null); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro ao deletar'); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">
            Conteúdo Editorial
          </span>
          <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Notícias</h2>
          <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
        </div>
        <button
          id="news-create-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-destaque-1 hover:bg-destaque-1/90 text-white px-4 py-2.5 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nova Notícia
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 p-4 mb-5 text-red-700 text-xs font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white border border-preto-10 overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Newspaper className="w-10 h-10 text-black/10" />
                <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhuma notícia cadastrada</span>
                <button onClick={openCreate} className="font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-destaque-1 hover:underline">
                  Criar a primeira →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-preto-10 bg-preto-5">
                      <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Imagem</th>
                      <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Título</th>
                      <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Categoria</th>
                      <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Data</th>
                      <th className="text-right px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-preto-5">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-preto-5 transition-colors">
                        <td className="px-5 py-3">
                          {item.urlImagem
                            ? <img src={item.urlImagem} alt="" className="w-12 h-10 object-cover border border-preto-10" />
                            : <div className="w-12 h-10 bg-preto-5 border border-preto-10" />
                          }
                        </td>
                        <td className="px-5 py-3 max-w-xs">
                          <div className="font-semibold text-black truncate text-sm">{item.titulo}</div>
                          <div className="text-black/35 text-xs truncate font-sans mt-0.5">{item.resumo}</div>
                        </td>
                        <td className="px-5 py-3">
                          {item.categoria && (
                            <span className={`text-[9px] font-mono font-bold px-2 py-1 uppercase tracking-wider ${item.corCategoria || 'bg-preto-5 text-black/60'}`}>
                              {item.categoria}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-black/40 font-mono text-[10px]">
                          {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 text-black/30 hover:text-destaque-2 hover:bg-destaque-2/5 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-2 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 font-mono text-[10px] font-bold transition-colors ${
                    page === p
                      ? 'bg-destaque-1 text-white'
                      : 'border border-preto-10 text-black/50 hover:border-destaque-1 hover:text-destaque-1'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {showModal && (
        <Modal title={editing ? 'Editar Notícia' : 'Nova Notícia'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Título" required>
              <input className={inputClass} value={form.titulo || ''} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required />
            </Field>
            <Field label="Categoria">
              <select className={selectClass} value={form.categoria || ''} onChange={(e) => handleCategoryChange(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Resumo (Excerpt)">
              <textarea className={textareaClass} rows={2} value={form.resumo || ''} onChange={(e) => setForm((f) => ({ ...f, resumo: e.target.value }))} />
            </Field>
            <Field label="Conteúdo Completo">
              <textarea className={textareaClass} rows={5} value={form.conteudo || ''} onChange={(e) => setForm((f) => ({ ...f, conteudo: e.target.value }))} />
            </Field>
            <FileUpload label="Imagem de Capa" currentUrl={form.urlImagem} onUpload={(url) => setForm((f) => ({ ...f, urlImagem: url }))} hint="JPG, PNG, WebP — Máx. 10MB" />
            <div className="flex gap-3 pt-2 border-t border-preto-10">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-preto-10 text-black/60 hover:bg-preto-5 transition-colors font-mono uppercase tracking-[0.15em] text-[9px] font-bold">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-destaque-1 hover:bg-destaque-1/90 text-white font-mono uppercase tracking-[0.15em] text-[9px] font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? 'Salvar Alterações' : 'Criar Notícia'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
