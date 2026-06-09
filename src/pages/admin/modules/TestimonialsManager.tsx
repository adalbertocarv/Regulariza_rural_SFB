import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, Quote } from 'lucide-react';
import { api, adminApi, Testimonial } from '../../../lib/api';
import { Modal, ConfirmDelete, Field, inputClass, textareaClass } from './shared';

const emptyForm: Partial<Testimonial> = { quote: '', name: '', role: '', avatarUrl: '' };

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getTestimonials()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: Testimonial) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminApi.updateTestimonial(editing.id, form);
      else await adminApi.createTestimonial(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await adminApi.deleteTestimonial(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Depoimentos</h2>
          <p className="text-sm text-gray-500">Vozes do Campo — produtores e especialistas</p>
        </div>
        <button id="testimonials-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Novo Depoimento
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <Quote className="w-5 h-5 text-green-500 mb-3" />
              <p className="text-gray-600 text-sm italic leading-relaxed mb-4 line-clamp-3">{item.quote}</p>
              <div className="flex items-center gap-3 mb-4">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.name || ''} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                    {(item.name || '?')[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.role}</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Depoimento' : 'Novo Depoimento'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Depoimento">
              <textarea className={textareaClass} rows={4} value={form.quote || ''} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} placeholder='"Texto do depoimento..."' />
            </Field>
            <Field label="Nome">
              <input className={inputClass} value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Cargo / Região">
              <input className={inputClass} value={form.role || ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Ex: Produtor Rural - Goiás" />
            </Field>
            <Field label="URL do Avatar">
              <input className={inputClass} type="url" value={form.avatarUrl || ''} onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://..." />
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
