import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, Download, FileText, Eye } from 'lucide-react';
import { api, adminApi, RepositoryDocument } from '../../../lib/api';
import { Modal, ConfirmDelete, FileUpload, Field, inputClass, textareaClass, selectClass } from './shared';

const ICON_TYPES = ['pdf', 'docx', 'zip', 'artigo', 'video'];
const DOC_TYPES = ['DOWNLOAD', 'LINK', 'WATCH'];
const emptyForm: Partial<RepositoryDocument> = { title: '', description: '', iconType: 'pdf', fileSize: '', docType: 'DOWNLOAD', fileUrl: '' };

function DocTypeIcon({ type }: { type: string }) {
  const base = 'w-10 h-10 rounded-lg flex items-center justify-center';
  const icons: Record<string, JSX.Element> = {
    pdf: <div className={`${base} bg-green-100`}><FileText className="w-5 h-5 text-green-700" /></div>,
    docx: <div className={`${base} bg-blue-100`}><FileText className="w-5 h-5 text-blue-700" /></div>,
    video: <div className={`${base} bg-gray-100`}><Eye className="w-5 h-5 text-gray-700" /></div>,
  };
  return icons[type] || <div className={`${base} bg-gray-100`}><Download className="w-5 h-5 text-gray-700" /></div>;
}

export default function DocumentsManager() {
  const [items, setItems] = useState<RepositoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RepositoryDocument | null>(null);
  const [form, setForm] = useState<Partial<RepositoryDocument>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getDocuments()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: RepositoryDocument) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminApi.updateDocument(editing.id, form);
      else await adminApi.createDocument(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await adminApi.deleteDocument(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Repositório</h2>
          <p className="text-sm text-gray-500">Documentos, vídeos e materiais para download</p>
        </div>
        <button id="docs-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Novo Documento
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Título</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Ação</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Tamanho</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3"><DocTypeIcon type={item.iconType || 'pdf'} /></td>
                  <td className="px-5 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate">{item.title}</div>
                    <div className="text-gray-400 text-xs truncate">{item.description}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{item.docType}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{item.fileSize}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Documento' : 'Novo Documento'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Título" required>
              <input className={inputClass} value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </Field>
            <Field label="Descrição">
              <textarea className={textareaClass} rows={2} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo de Ícone">
                <select className={selectClass} value={form.iconType || 'pdf'} onChange={(e) => setForm((f) => ({ ...f, iconType: e.target.value }))}>
                  {ICON_TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </Field>
              <Field label="Tipo de Ação">
                <select className={selectClass} value={form.docType || 'DOWNLOAD'} onChange={(e) => setForm((f) => ({ ...f, docType: e.target.value }))}>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Tamanho / Descrição curta">
              <input className={inputClass} value={form.fileSize || ''} onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))} placeholder="Ex: 2.4 MB" />
            </Field>
            <FileUpload
              label="Arquivo / Documento"
              currentUrl={form.fileUrl}
              onUpload={(url) => setForm((f) => ({ ...f, fileUrl: url }))}
              accept=".pdf,.zip,.docx,.mp4,.webm,image/*"
              hint="PDF, ZIP, DOCX, Vídeo — Máx. 50MB"
            />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60">
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
