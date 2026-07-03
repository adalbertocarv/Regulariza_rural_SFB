import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { api, adminApi, Depoimento } from '../../../lib/api';
import { Modal, ConfirmDelete, Field, inputClass, textareaClass } from './compartilhado';

const emptyForm: Partial<Depoimento> = { citacao: '', nome: '', cargo: '', urlAvatar: '' };

export default function GerenciadorDepoimentos() {
  const [items, setItems]       = useState<Depoimento[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<Depoimento | null>(null);
  const [form, setForm]         = useState<Partial<Depoimento>>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getTestimonials()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: Depoimento) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await adminApi.updateTestimonial(editing.id, form) : await adminApi.createTestimonial(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await adminApi.deleteTestimonial(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">Vozes do Campo</span>
          <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Depoimentos</h2>
          <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
        </div>
        <button id="testimonials-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-destaque-1 hover:bg-destaque-1/90 text-white px-4 py-2.5 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-colors">
          <Plus className="w-3.5 h-3.5" /> Novo Depoimento
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-preto-10">
          <MessageSquare className="w-10 h-10 text-black/10" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhum depoimento cadastrado</span>
          <button onClick={openCreate} className="font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-destaque-1 hover:underline">Adicionar o primeiro →</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-preto-10 p-5 hover:border-destaque-1/40 hover:-translate-y-0.5 transition-all duration-200">
              {/* Quote mark */}
              <div className="w-7 h-7 bg-destaque-1/10 border border-destaque-1/20 flex items-center justify-center mb-4">
                <span className="text-destaque-1 font-serif font-black text-lg leading-none">"</span>
              </div>
              <p className="text-black/60 text-sm italic leading-relaxed mb-4 line-clamp-3 font-sans border-l-2 border-destaque-1/30 pl-3">{item.citacao}</p>
              <div className="flex items-center gap-3 mb-4">
                {item.urlAvatar ? (
                  <img src={item.urlAvatar} alt={item.nome || ''} className="w-9 h-9 object-cover border border-preto-10" />
                ) : (
                  <div className="w-9 h-9 bg-destaque-1/10 border border-destaque-1/20 flex items-center justify-center text-destaque-1 font-mono font-bold text-sm">
                    {(item.nome || '?')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-black text-sm leading-tight">{item.nome}</div>
                  <div className="text-[9px] font-mono text-black/40 uppercase tracking-wider mt-0.5">{item.cargo}</div>
                </div>
              </div>
              <div className="flex justify-end gap-1 border-t border-preto-5 pt-3">
                <button onClick={() => openEdit(item)} className="p-2 text-black/30 hover:text-destaque-2 hover:bg-destaque-2/5 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Depoimento' : 'Novo Depoimento'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Depoimento">
              <textarea className={textareaClass} rows={4} value={form.citacao || ''} onChange={(e) => setForm((f) => ({ ...f, citacao: e.target.value }))} placeholder='"Texto do depoimento..."' />
            </Field>
            <Field label="Nome">
              <input className={inputClass} value={form.nome || ''} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
            </Field>
            <Field label="Cargo / Região">
              <input className={inputClass} value={form.cargo || ''} onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))} placeholder="Ex: Produtor Rural - Goiás" />
            </Field>
            <Field label="URL do Avatar">
              <input className={inputClass} type="url" value={form.urlAvatar || ''} onChange={(e) => setForm((f) => ({ ...f, urlAvatar: e.target.value }))} placeholder="https://..." />
            </Field>
            <div className="flex gap-3 pt-2 border-t border-preto-10">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-preto-10 text-black/60 hover:bg-preto-5 font-mono uppercase tracking-[0.15em] text-[9px] font-bold">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-destaque-1 hover:bg-destaque-1/90 text-white font-mono uppercase tracking-[0.15em] text-[9px] font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? 'Salvar Alterações' : 'Criar Depoimento'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
