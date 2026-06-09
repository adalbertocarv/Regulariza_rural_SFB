import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { api, adminApi, News } from '../../../lib/api';
import { Modal, ConfirmDelete, FileUpload, Field, inputClass, textareaClass, selectClass } from './compartilhado';

const CATEGORIES = [
  { label: 'Legislação', value: 'LEGISLAÇÃO', color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Tecnologia', value: 'TECNOLOGIA', color: 'bg-orange-100 text-orange-700' },
  { label: 'Sustentabilidade', value: 'SUSTENTABILIDADE', color: 'bg-blue-100 text-blue-700' },
  { label: 'Campo', value: 'CAMPO', color: 'bg-blue-100 text-blue-700' },
  { label: 'Ambiental', value: 'AMBIENTAL', color: 'bg-lime-100 text-lime-700' },
  { label: 'Mercado', value: 'MERCADO', color: 'bg-purple-100 text-purple-700' },
  { label: 'Social', value: 'SOCIAL', color: 'bg-red-100 text-red-700' },
  { label: 'Biodiversidade', value: 'BIODIVERSIDADE', color: 'bg-green-100 text-green-700' },
  { label: 'Evento', value: 'EVENTO', color: 'bg-teal-100 text-teal-700' },
];

const emptyForm: Partial<News> = { title: '', excerpt: '', content: '', category: 'LEGISLAÇÃO', categoryColor: 'bg-yellow-100 text-yellow-700', imageUrl: '' };

export default function GerenciadorNoticias() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState<Partial<News>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getNews({ page: p, limit: 8 });
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: News) => { setEditing(item); setForm(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleCategoryChange = (cat: string) => {
    const found = CATEGORIES.find((c) => c.value === cat);
    setForm((f) => ({ ...f, category: cat, categoryColor: found?.color || '' }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateNews(editing.id, form);
      } else {
        await adminApi.createNews(form);
      }
      closeModal();
      loadData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteNews(deleteId);
      setDeleteId(null);
      loadData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao deletar');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notícias</h2>
          <p className="text-sm text-gray-500">Gerencie as notícias e atualizações do portal</p>
        </div>
        <button
          id="news-create-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Notícia
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Imagem</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Título</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Categoria</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Data</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-12 h-10 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-10 bg-gray-100 rounded-lg" />
                        )}
                      </td>
                      <td className="px-5 py-3 max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{item.title}</div>
                        <div className="text-gray-400 text-xs truncate">{item.excerpt}</div>
                      </td>
                      <td className="px-5 py-3">
                        {item.category && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.categoryColor || 'bg-gray-100 text-gray-600'}`}>
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? 'bg-green-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-green-400'
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
              <input
                className={inputClass}
                value={form.title || ''}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </Field>

            <Field label="Categoria">
              <select
                className={selectClass}
                value={form.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Resumo (Excerpt)">
              <textarea
                className={textareaClass}
                rows={2}
                value={form.excerpt || ''}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </Field>

            <Field label="Conteúdo Completo">
              <textarea
                className={textareaClass}
                rows={5}
                value={form.content || ''}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>

            <FileUpload
              label="Imagem"
              currentUrl={form.imageUrl}
              onUpload={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              hint="JPG, PNG, WebP — Máx. 10MB"
            />

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Salvar Alterações' : 'Criar Notícia'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
      )}
    </div>
  );
}
