import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, adminApi, PerguntaFrequente } from '../../../lib/api';
import { Modal, ConfirmDelete, Field, inputClass, textareaClass } from './compartilhado';

const emptyForm: Partial<PerguntaFrequente> = { pergunta: '', resposta: '', ordem: 1 };

export default function GerenciadorFaq() {
  const [items, setItems] = useState<PerguntaFrequente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PerguntaFrequente | null>(null);
  const [form, setForm] = useState<Partial<PerguntaFrequente>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getFaqs()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, ordem: (items.length + 1) });
    setShowModal(true);
  };
  const openEdit = (item: PerguntaFrequente) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminApi.updateFaq(editing.id, form);
      else await adminApi.createFaq(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await adminApi.deleteFaq(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Perguntas Frequentes (FAQ)</h2>
          <p className="text-sm text-gray-500">Exibidas no Painel de Resultados</p>
        </div>
        <button id="faq-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nova Pergunta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center px-5 py-4 cursor-pointer" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center mr-4 flex-shrink-0">
                  {item.ordem || idx + 1}
                </span>
                <span className="flex-1 font-medium text-gray-900">{item.pergunta}</span>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              {expanded === idx && (
                <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50 ml-11">
                  {item.resposta}
                </div>
              )}
            </div>
          ))}
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
            <Field label="Ordem">
              <input className={inputClass} type="number" min={1} value={form.ordem || 1} onChange={(e) => setForm((f) => ({ ...f, ordem: Number(e.target.value) }))} />
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
