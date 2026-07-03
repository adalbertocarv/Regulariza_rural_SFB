import { useState, useEffect, FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2, Download, FileText, Eye, BookOpen } from 'lucide-react';
import { api, adminApi, DocumentoRepositorio } from '../../../lib/api';
import { Modal, ConfirmDelete, FileUpload, Field, inputClass, textareaClass, selectClass } from './compartilhado';

const ICON_TYPES = ['pdf', 'docx', 'zip', 'artigo', 'video'];
const DOC_TYPES = ['DOWNLOAD', 'LINK', 'WATCH'];
const emptyForm: Partial<DocumentoRepositorio> = { titulo: '', descricao: '', tipoIcone: 'pdf', tamanhoArquivo: '', tipoDocumento: 'DOWNLOAD', urlArquivo: '' };

function DocTypeIcon({ type }: { type: string }) {
  const base = 'w-9 h-9 flex items-center justify-center border border-preto-10';
  const map: Record<string, JSX.Element> = {
    pdf:    <div className={`${base} bg-red-50`}><FileText className="w-4 h-4 text-red-600" /></div>,
    docx:   <div className={`${base} bg-blue-50`}><FileText className="w-4 h-4 text-blue-600" /></div>,
    video:  <div className={`${base} bg-preto-5`}><Eye className="w-4 h-4 text-black/50" /></div>,
    artigo: <div className={`${base} bg-destaque-1/10`}><FileText className="w-4 h-4 text-destaque-1" /></div>,
  };
  return map[type] || <div className={`${base} bg-preto-5`}><Download className="w-4 h-4 text-black/50" /></div>;
}

export default function GerenciadorDocumentos() {
  const [items, setItems]       = useState<DocumentoRepositorio[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<DocumentoRepositorio | null>(null);
  const [form, setForm]         = useState<Partial<DocumentoRepositorio>>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try { setItems(await api.getDocuments()); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item: DocumentoRepositorio) => { setEditing(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await adminApi.updateDocument(editing.id, form) : await adminApi.createDocument(form);
      closeModal(); loadData();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await adminApi.deleteDocument(deleteId); setDeleteId(null); loadData(); } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-1">Arquivos e Mídias</span>
          <h2 className="text-2xl font-serif font-bold text-black tracking-tight">Repositório</h2>
          <div className="h-[2px] w-10 bg-destaque-1 mt-3" />
        </div>
        <button id="docs-create-btn" onClick={openCreate} className="flex items-center gap-2 bg-destaque-1 hover:bg-destaque-1/90 text-white px-4 py-2.5 font-mono uppercase tracking-[0.18em] text-[9px] font-bold transition-colors">
          <Plus className="w-3.5 h-3.5" /> Novo Documento
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-destaque-1 animate-spin" />
          <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Carregando...</span>
        </div>
      ) : (
        <div className="bg-white border border-preto-10 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <BookOpen className="w-10 h-10 text-black/10" />
              <span className="font-mono uppercase tracking-wider text-[9px] text-black/30">Nenhum documento cadastrado</span>
              <button onClick={openCreate} className="font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-destaque-1 hover:underline">Adicionar o primeiro →</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-preto-10 bg-preto-5">
                    <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Tipo</th>
                    <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Título</th>
                    <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Ação</th>
                    <th className="text-left px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Tamanho</th>
                    <th className="text-right px-5 py-3 font-mono uppercase tracking-[0.15em] text-[9px] text-black/40 font-bold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-preto-5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-preto-5 transition-colors">
                      <td className="px-5 py-3"><DocTypeIcon type={item.tipoIcone || 'pdf'} /></td>
                      <td className="px-5 py-3 max-w-xs">
                        <div className="font-semibold text-black truncate text-sm">{item.titulo}</div>
                        <div className="text-black/35 text-xs truncate font-sans mt-0.5">{item.descricao}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[9px] font-mono font-bold px-2 py-1 bg-preto-5 text-black/50 uppercase tracking-wider border border-preto-10">{item.tipoDocumento}</span>
                      </td>
                      <td className="px-5 py-3 text-black/40 font-mono text-[10px]">{item.tamanhoArquivo}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="p-2 text-black/30 hover:text-destaque-2 hover:bg-destaque-2/5 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteId(item.id)} className="p-2 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Documento' : 'Novo Documento'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Título" required>
              <input className={inputClass} value={form.titulo || ''} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required />
            </Field>
            <Field label="Descrição">
              <textarea className={textareaClass} rows={2} value={form.descricao || ''} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo de Ícone">
                <select className={selectClass} value={form.tipoIcone || 'pdf'} onChange={(e) => setForm((f) => ({ ...f, tipoIcone: e.target.value }))}>
                  {ICON_TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </Field>
              <Field label="Tipo de Ação">
                <select className={selectClass} value={form.tipoDocumento || 'DOWNLOAD'} onChange={(e) => setForm((f) => ({ ...f, tipoDocumento: e.target.value }))}>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Tamanho / Descrição curta">
              <input className={inputClass} value={form.tamanhoArquivo || ''} onChange={(e) => setForm((f) => ({ ...f, tamanhoArquivo: e.target.value }))} placeholder="Ex: 2.4 MB" />
            </Field>
            <FileUpload label="Arquivo / Documento" currentUrl={form.urlArquivo} onUpload={(url) => setForm((f) => ({ ...f, urlArquivo: url }))} accept=".pdf,.zip,.docx,.mp4,.webm,image/*" hint="PDF, ZIP, DOCX, Vídeo — Máx. 50MB" />
            <div className="flex gap-3 pt-2 border-t border-preto-10">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-preto-10 text-black/60 hover:bg-preto-5 font-mono uppercase tracking-[0.15em] text-[9px] font-bold">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-destaque-1 hover:bg-destaque-1/90 text-white font-mono uppercase tracking-[0.15em] text-[9px] font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {editing ? 'Salvar Alterações' : 'Criar Documento'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteId && <ConfirmDelete onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
