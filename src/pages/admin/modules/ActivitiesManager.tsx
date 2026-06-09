import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { api, adminApi, Activity } from '../../../lib/api';
import { Modal, ConfirmDelete, FileUpload, Field, inputClass, textareaClass } from './shared';

const ALL_BADGES = ['RECUPERAÇÃO', 'CERCAMENTO', 'MATA ATLÂNTICA', 'CERRADO', 'AMAZÔNIA', 'CAATINGA', 'SEMIARID'];
const emptyForm: Partial<Activity> = { title: '', description: '', badges: [], targetValue: '', targetLabel: 'PÚBLICO', objective: '', imageUrl: '' };

export default function ActivitiesManager() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState<Partial<Activity>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getActivities({ limit: 50 });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: Activity) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const toggleBadge = (badge: string) => {
    setForm((f) => ({
      ...f,
      badges: f.badges?.includes(badge) ? f.badges.filter((b) => b !== badge) : [...(f.badges || []), badge],
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateActivity(editing.id, form);
      } else {
        await adminApi.createActivity(form);
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
      await adminApi.deleteActivity(deleteId);
      setDeleteId(null);
      loadData();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Atividades</h2>
          <p className="text-sm text-gray-500">Ações de campo e projetos em andamento</p>
        </div>
        <button
          id="activities-create-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Atividade
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.badges.map((b) => (
                    <span key={b} className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{b}</span>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Atividade' : 'Nova Atividade'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Título" required>
              <input className={inputClass} value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </Field>

            <Field label="Descrição">
              <textarea className={textareaClass} rows={3} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </Field>

            <Field label="Badges">
              <div className="flex flex-wrap gap-2">
                {ALL_BADGES.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                      form.badges?.includes(badge)
                        ? 'bg-green-700 text-white border-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-green-400'
                    }`}
                  >
                    {form.badges?.includes(badge) && <X className="w-3 h-3 inline mr-1" />}
                    {badge}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Rótulo (PÚBLICO / ÁREA)">
                <select className={inputClass} value={form.targetLabel || 'PÚBLICO'} onChange={(e) => setForm((f) => ({ ...f, targetLabel: e.target.value }))}>
                  <option>PÚBLICO</option>
                  <option>ÁREA</option>
                </select>
              </Field>
              <Field label="Valor">
                <input className={inputClass} value={form.targetValue || ''} onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))} placeholder="Ex: 85 Famílias" />
              </Field>
            </div>

            <Field label="Objetivo">
              <input className={inputClass} value={form.objective || ''} onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))} />
            </Field>

            <FileUpload label="Imagem" currentUrl={form.imageUrl} onUpload={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
