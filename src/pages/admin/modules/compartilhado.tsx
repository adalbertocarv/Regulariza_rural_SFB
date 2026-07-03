import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, GripVertical, Plus, MapPin, Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import type { AtividadeImagem, AtividadePonto } from '../../../lib/api/types';

// ── Shared style tokens ──────────────────────────────────────────────────────────
export const inputClass =
  'w-full px-3 py-2.5 border border-preto-10 bg-preto-5 text-sm text-black focus:outline-none focus:border-destaque-1 focus:ring-1 focus:ring-destaque-1/30 transition-all font-sans placeholder-black/30';
export const textareaClass = `${inputClass} resize-none`;
export const selectClass =
  'w-full px-3 py-2.5 border border-preto-10 bg-preto-5 text-sm text-black focus:outline-none focus:border-destaque-1 focus:ring-1 focus:ring-destaque-1/30 transition-all font-sans appearance-none cursor-pointer';

// ── Field Component ──────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className="block font-mono uppercase tracking-[0.16em] text-[9px] font-bold text-black/50 mb-2">
        {label} {required && <span className="text-red-500 normal-case">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── FileUpload Component ─────────────────────────────────────────────────────────
interface FileUploadProps {
  label?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  hint?: string;
}

export function FileUpload({ label = 'Arquivo', currentUrl, onUpload, accept = 'image/*', hint }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    try {
      const result = await adminApi.uploadFile(file, setProgress);
      setPreviewUrl(result.url);
      onUpload(result.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro no upload');
      setPreviewUrl(currentUrl || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="block font-mono uppercase tracking-[0.16em] text-[9px] font-bold text-black/50 mb-2">
          {label}
        </label>
      )}

      {previewUrl && !previewUrl.startsWith('blob') ? (
        <div className="relative mb-3 border border-preto-10 bg-preto-5 overflow-hidden">
          <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => { setPreviewUrl(''); onUpload(''); }}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors mb-3 ${
            uploading ? 'border-destaque-1/50 bg-destaque-1/5' : 'border-preto-10 hover:border-destaque-1/40 hover:bg-preto-5'
          }`}
        >
          {uploading ? (
            <div>
              <Loader2 className="w-7 h-7 text-destaque-1 animate-spin mx-auto mb-2" />
              <div className="text-xs font-mono text-black/50 mb-2 uppercase tracking-wider">
                Enviando... {progress}%
              </div>
              <div className="w-full bg-preto-10 h-[2px]">
                <div className="bg-destaque-1 h-[2px] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="w-7 h-7 text-black/20 mx-auto mb-2" />
              <div className="text-xs font-mono text-black/40 uppercase tracking-wider">
                Arraste ou clique para enviar
              </div>
              {hint && <div className="text-[9px] font-mono text-black/30 mt-1 uppercase tracking-wider">{hint}</div>}
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] font-mono text-red-600 mb-2 uppercase tracking-wider">{error}</p>
      )}

      {/* URL fallback */}
      <div className="flex gap-2 items-center">
        <Upload className="w-3.5 h-3.5 text-black/30 shrink-0" />
        <input
          type="url"
          placeholder="Ou cole uma URL externa..."
          value={previewUrl.startsWith('blob') ? '' : previewUrl}
          onChange={(e) => { setPreviewUrl(e.target.value); onUpload(e.target.value); }}
          className="flex-1 text-xs px-3 py-2 border border-preto-10 bg-preto-5 focus:outline-none focus:border-destaque-1 focus:ring-1 focus:ring-destaque-1/20 transition-all font-sans placeholder-black/25"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── Modal Component ──────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-preto-10">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-preto-10 bg-preto-5">
          <div>
            <span className="text-destaque-1 font-mono uppercase tracking-[0.2em] text-[9px] font-bold block mb-0.5">
              Editor
            </span>
            <h3 className="font-serif font-bold text-black text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-black/30 hover:text-black/70 hover:bg-preto-10 p-1.5 transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────────
interface ConfirmDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDelete({ onConfirm, onCancel, loading }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white shadow-2xl p-7 max-w-sm w-full border border-preto-10">
        <div className="mb-1">
          <span className="text-red-600 font-mono uppercase tracking-[0.2em] text-[9px] font-bold">Atenção</span>
        </div>
        <h3 className="font-serif font-bold text-black text-lg mb-2">Confirmar exclusão</h3>
        <div className="h-[1px] bg-preto-10 mb-4" />
        <p className="text-black/50 text-sm mb-6 font-sans leading-relaxed">
          Essa ação não pode ser desfeita. Deseja continuar?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-preto-10 text-black/60 hover:bg-preto-5 transition-colors font-mono uppercase tracking-[0.15em] text-[9px] font-bold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors font-mono uppercase tracking-[0.15em] text-[9px] font-bold flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MultiFileUpload Component ─────────────────────────────────────────────────
interface MultiFileUploadProps {
  imagens: AtividadeImagem[];
  onChange: (imagens: AtividadeImagem[]) => void;
}

export function MultiFileUpload({ imagens, onChange }: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);

  const handleFiles = async (files: FileList) => {
    setError('');
    setUploading(true);
    try {
      const results: AtividadeImagem[] = [];
      for (let i = 0; i < files.length; i++) {
        const r = await adminApi.uploadFile(files[i]);
        results.push({ url: r.url, ordem: imagens.length + i, legenda: '' });
      }
      onChange([...imagens, ...results].map((img, idx) => ({ ...img, ordem: idx })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const remove = (idx: number) =>
    onChange(imagens.filter((_, i) => i !== idx).map((img, i) => ({ ...img, ordem: i })));

  const updateLegenda = (idx: number, legenda: string) =>
    onChange(imagens.map((img, i) => (i === idx ? { ...img, legenda } : img)));

  const onDragStart = (idx: number) => { dragIdx.current = idx; };
  const onDragOver  = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const updated = [...imagens];
    const [moved] = updated.splice(dragIdx.current, 1);
    updated.splice(idx, 0, moved);
    dragIdx.current = idx;
    onChange(updated.map((img, i) => ({ ...img, ordem: i })));
  };
  const onDragEnd = () => { dragIdx.current = null; };

  return (
    <div>
      <label className="block font-mono uppercase tracking-[0.16em] text-[9px] font-bold text-black/50 mb-2">
        Galeria de Imagens <span className="normal-case text-black/30">(arraste para reordenar — 1ª imagem = capa)</span>
      </label>

      {imagens.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {imagens.map((img, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
              className="group relative border border-preto-10 bg-preto-5 overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {idx === 0 && (
                <span className="absolute top-1 left-1 z-10 bg-destaque-1 text-white text-[7px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 z-10 w-5 h-5 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <GripVertical className="absolute bottom-1 left-1 w-3 h-3 text-white/60" />
              <img src={img.url} alt={img.legenda || ''} className="w-full h-24 object-cover" />
              <input
                type="text"
                placeholder="Legenda..."
                value={img.legenda || ''}
                onChange={(e) => updateLegenda(idx, e.target.value)}
                className="w-full px-2 py-1 text-[9px] border-0 border-t border-preto-10 bg-white focus:outline-none font-sans"
              />
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
          uploading ? 'border-destaque-1/50 bg-destaque-1/5' : 'border-preto-10 hover:border-destaque-1/40 hover:bg-preto-5'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-destaque-1 animate-spin" />
            <span className="text-xs font-mono text-black/50 uppercase tracking-wider">Enviando...</span>
          </div>
        ) : (
          <>
            <ImageIcon className="w-6 h-6 text-black/20 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-black/40 uppercase tracking-wider">Clique ou arraste para adicionar imagens</div>
          </>
        )}
      </div>

      {error && <p className="text-[10px] font-mono text-red-600 mt-1 uppercase tracking-wider">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
      />
    </div>
  );
}

// ── PontosEditor Component ────────────────────────────────────────────────────
interface PontosEditorProps {
  pontos: AtividadePonto[];
  onChange: (pontos: AtividadePonto[]) => void;
}

export function PontosEditor({ pontos, onChange }: PontosEditorProps) {
  const addPonto = () =>
    onChange([...pontos, { lat: 0, lng: 0, rotulo: '', ordem: pontos.length }]);

  const remove = (idx: number) =>
    onChange(pontos.filter((_, i) => i !== idx).map((p, i) => ({ ...p, ordem: i })));

  const update = (idx: number, field: 'lat' | 'lng' | 'rotulo', value: string) =>
    onChange(
      pontos.map((p, i) =>
        i === idx
          ? { ...p, [field]: field === 'rotulo' ? value : parseFloat(value) || 0 }
          : p
      )
    );

  return (
    <div>
      <label className="block font-mono uppercase tracking-[0.16em] text-[9px] font-bold text-black/50 mb-2">
        Pontos Geográficos
      </label>

      <div className="space-y-2 mb-2">
        {pontos.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-preto-5 border border-preto-10 p-2">
            <MapPin className="w-3.5 h-3.5 text-destaque-1 shrink-0" />
            <input
              type="number"
              step="any"
              placeholder="Lat"
              value={p.lat || ''}
              onChange={(e) => update(idx, 'lat', e.target.value)}
              className="w-24 px-2 py-1.5 border border-preto-10 bg-white text-xs focus:outline-none focus:border-destaque-1 font-mono"
            />
            <input
              type="number"
              step="any"
              placeholder="Lng"
              value={p.lng || ''}
              onChange={(e) => update(idx, 'lng', e.target.value)}
              className="w-24 px-2 py-1.5 border border-preto-10 bg-white text-xs focus:outline-none focus:border-destaque-1 font-mono"
            />
            <input
              type="text"
              placeholder="Rótulo (opcional)"
              value={p.rotulo || ''}
              onChange={(e) => update(idx, 'rotulo', e.target.value)}
              className="flex-1 px-2 py-1.5 border border-preto-10 bg-white text-xs focus:outline-none focus:border-destaque-1 font-sans"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPonto}
        className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-destaque-1 hover:text-destaque-2 transition-colors border border-destaque-1/30 hover:border-destaque-1/60 px-3 py-2"
      >
        <Plus className="w-3 h-3" />
        Adicionar Ponto
      </button>
    </div>
  );
}

// ── ParceirosEditor Component ──────────────────────────────────────────────────
interface ParceirosEditorProps {
  parceiros: string[];
  onChange: (parceiros: string[]) => void;
}

export function ParceirosEditor({ parceiros, onChange }: ParceirosEditorProps) {
  const addParceiro = () => onChange([...parceiros, '']);
  const remove = (idx: number) => onChange(parceiros.filter((_, i) => i !== idx));
  const update = (idx: number, value: string) =>
    onChange(parceiros.map((p, i) => (i === idx ? value : p)));

  return (
    <div>
      <label className="block font-mono uppercase tracking-[0.16em] text-[9px] font-bold text-black/50 mb-2">
        Instituições Parceiras
      </label>

      <div className="space-y-2 mb-2">
        {parceiros.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-preto-5 border border-preto-10 p-2">
            <input
              type="text"
              placeholder="Nome da instituição parceira (ex: IICA, SFB...)"
              value={p}
              onChange={(e) => update(idx, e.target.value)}
              className="flex-1 px-2 py-1.5 border border-preto-10 bg-white text-xs focus:outline-none focus:border-destaque-1 font-sans"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1 text-black/30 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addParceiro}
        className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-destaque-1 hover:text-destaque-2 transition-colors border border-destaque-1/30 hover:border-destaque-1/60 px-3 py-2"
      >
        <Plus className="w-3 h-3" />
        Adicionar Instituição Parceira
      </button>
    </div>
  );
}
