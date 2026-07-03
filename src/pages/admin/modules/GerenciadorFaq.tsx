import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { api, adminApi, PerguntaFrequente } from '../../../lib/api';
import { Modal, ConfirmDelete, Field, inputClass, textareaClass } from './compartilhado';

const emptyForm: Partial<PerguntaFrequente> = { pergunta: '', resposta: '', ordem: 1 };

export default function GerenciadorFaq() {
  const [items, setItems]       = useState<PerguntaFrequente[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<PerguntaFrequente | null>(null);
  const [form, setForm]         = useState<Partial<PerguntaFrequente>>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getFaqs()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, ordem: (items.length + 1) }); setShowModal(true); };
  const openEdit = (item: PerguntaFrequente) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await adminApi.updateFaq(editing.id, form) : await adminApi.createFaq(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await adminApi.deleteFaq(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">Central de Dúvidas</span>
          <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Perguntas Frequentes</h2>
          <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
        </div>
        <button id="faq-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-destaque-1 hover:bg-destaque-1/90 text-white px-4 py-2.5 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-colors">
          <Plus className="w-3.5 h-3.5" /> Nova Pergunta
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-preto-10">
          <HelpCircle className="w-10 h-10 text-black/10" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhuma pergunta cadastrada</span>
          <button onClick={openCreate} className="font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-destaque-1 hover:underline">Criar a primeira →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => {
            const isOpen = expanded === idx;
            return (
              <div key={item.id} className={`bg-white border transition-colors ${isOpen ? 'border-destaque-1/40' : 'border-preto-10 hover:border-preto-10/80'}`}>
                {/* Accordion header */}
                <div
                  className="flex items-center px-5 py-4 cursor-pointer select-none"
                  onClick={() => setExpanded(isOpen ? null : idx)}
                >
                  {/* Order number */}
                  <span className="w-6 h-6 bg-destaque-1/10 border border-destaque-1/20 text-destaque-1 font-mono font-bold text-[9px] flex items-center justify-center mr-4 shrink-0 uppercase">
                    {String(item.ordem || idx + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-semibold text-black text-sm leading-snug">{item.pergunta}</span>
                  <div className="flex items-center gap-1 ml-4 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                      className="p-1.5 text-black/25 hover:text-destaque-2 hover:bg-destaque-2/5 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="p-1.5 text-black/25 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {isOpen
                      ? <ChevronUp className="w-3.5 h-3.5 text-destaque-1 ml-1" />
                      : <ChevronDown className="w-3.5 h-3.5 text-black/25 ml-1" />
                    }
                  </div>
                </div>
                {/* Answer panel */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 border-t border-preto-10">
                    <div className="ml-10 mt-3 text-sm text-black/60 font-sans leading-relaxed border-l-2 border-destaque-1/30 pl-4">
                      {item.resposta}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Pergunta' : 'Nova Pergunta'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Pergunta">
              <input className={inputClass} value={form.pergunta || ''} onChange={(e) => setForm((f) => ({ ...f, pergunta: e.target.value }))} required />
            </Field>
            <Field label="Resposta">
              <textarea className={textareaClass} rows={5} value={form.resposta || ''} onChange={(e) => setForm((f) => ({ ...f, resposta: e.target.value }))} />
            </Field>
            <Field label="Ordem de Exibição">
              <input className={inputClass} type="number" min={1} value={form.ordem || 1} onChange={(e) => setForm((f) => ({ ...f, ordem: Number(e.target.value) }))} />
            </Field>
            <div className="flex gap-3 pt-2 border-t border-preto-10">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-preto-10 text-black/60 hover:bg-preto-5 font-mono uppercase tracking-[0.15em] text-[9px] font-bold">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-destaque-1 hover:bg-destaque-1/90 text-white font-mono uppercase tracking-[0.15em] text-[9px] font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? 'Salvar Alterações' : 'Criar Pergunta'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
