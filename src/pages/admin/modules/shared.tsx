import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../../lib/api';

interface FileUploadProps {
  label?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  hint?: string;
}

export function FileUpload({ label = 'Imagem', currentUrl, onUpload, accept = 'image/*', hint }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);

    // Local preview
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
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      {previewUrl && !previewUrl.startsWith('blob') ? (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => { setPreviewUrl(''); onUpload(''); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-3 ${
            uploading ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <div>
              <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-2">Enviando... {progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <div className="text-sm text-gray-500">Clique para enviar arquivo</div>
              {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {/* URL input fallback */}
      <div className="flex gap-2">
        <Upload className="w-4 h-4 text-gray-400 mt-2.5 flex-shrink-0" />
        <input
          type="url"
          placeholder="Ou cole uma URL externa..."
          value={previewUrl.startsWith('blob') ? '' : previewUrl}
          onChange={(e) => { setPreviewUrl(e.target.value); onUpload(e.target.value); }}
          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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

// ── Modal Component ─────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Delete Dialog ───────────────────────────────────────────────────────
interface ConfirmDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDelete({ onConfirm, onCancel, loading }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar exclusão</h3>
        <p className="text-gray-500 text-sm mb-6">Essa ação não pode ser desfeita. Deseja continuar?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form field helpers ──────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all';
export const textareaClass = `${inputClass} resize-none`;
export const selectClass = inputClass;
