import { useState, useEffect, FormEvent } from 'react';
import {
  ArrowLeft, Save, Eye, FileText, Loader2, X, MapPin, Calendar,
  Leaf, Users, CheckCircle2, Clock,
} from 'lucide-react';
import { adminApi, Atividade, AtividadeImagem, AtividadePonto } from '../../../lib/api';
import {
  Field, inputClass, textareaClass, MultiFileUpload, PontosEditor, ParceirosEditor,
} from './compartilhado';

// ─────────────────────────────────────────────────────────────────────────────
const ALL_BADGES = ['RECUPERAÇÃO', 'CERCAMENTO', 'MATA ATLÂNTICA', 'CERRADO', 'AMAZÔNIA', 'CAATINGA', 'SEMIARID'];
const ALL_STATES = ['MT', 'PA', 'RO', 'DF'];

const emptyForm: Partial<Atividade> = {
  titulo: '',
  descricao: '',
  insignias: [],
  valorAlvo: '',
  rotuloAlvo: 'PÚBLICO',
  objetivo: '',
  componenteId: 1,
  tipoAcao: 'Mutirão',
  demandante: 'SFB',
  estados: [],
  hectares: '',
  valorImpacto: '',
  rotuloImpacto: 'MECANISMO DE IMPACTO',
  metrica1Valor: '',
  metrica1Rotulo: 'MUDAS ADQUIRIDAS',
  delineamentoDescricao: 'Gleba delimitada e monitorada ativamente através de sensores orbitais diários para verificação do progresso da vegetação nativa integrada.',
  parceiros: [],
  data: '',
  status: 'publicado',
  imagens: [],
  pontos: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// Preview: Card
// ─────────────────────────────────────────────────────────────────────────────
function PreviewCard({ form }: { form: Partial<Atividade> }) {
  const capaUrl = form.imagens && form.imagens.length > 0 ? form.imagens[0].url : undefined;
  const statesLabel = form.estados?.length
    ? form.estados.join(', ')
    : 'Todas as UFs';

  return (
    <div className="max-w-xs mx-auto">
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-black/30 mb-3 text-center">
        Preview — Card da Listagem
      </p>
      <article className="bg-white rounded-sm overflow-hidden border border-preto-10 shadow-sm flex flex-col">
        {capaUrl ? (
          <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-preto-10">
            <img src={capaUrl} className="w-full h-full object-cover grayscale brightness-95" alt={form.titulo} />
          </div>
        ) : (
          <div className="h-44 bg-stone-100 border-b border-preto-10 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-stone-300" />
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-wider text-stone-500 uppercase mb-2 border-b border-stone-100 pb-2">
            <span>Comp: {form.componenteId || 1}</span>
            <span className="text-emerald-700">{statesLabel}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {form.tipoAcao && (
              <span className="bg-destaque-1 text-white font-mono uppercase text-[7px] font-bold px-2 py-0.5 tracking-wider">
                {form.tipoAcao}
              </span>
            )}
            {form.demandante && (
              <span className="bg-stone-100 text-stone-700 font-mono uppercase text-[7px] font-bold px-2 py-0.5 tracking-wider border border-stone-200">
                {form.demandante}
              </span>
            )}
          </div>

          <h3 className="text-sm font-serif font-bold text-stone-900 leading-snug mb-2">
            {form.titulo || <span className="text-stone-300 italic">Título da atividade...</span>}
          </h3>

          <p className="text-stone-600 text-[11px] leading-relaxed font-light font-sans line-clamp-3 flex-1">
            {form.descricao || <span className="text-stone-300 italic">Descrição...</span>}
          </p>

          <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase tracking-wider text-destaque-1 border-t border-stone-100 pt-3 mt-3">
            <span>Ver Detalhes</span>
            <span>→</span>
          </div>
        </div>
      </article>

      {/* Image count badge */}
      {form.imagens && form.imagens.length > 1 && (
        <p className="text-[9px] font-mono text-black/40 mt-2 text-center">
          +{form.imagens.length - 1} imagem(ns) adicionais na galeria
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview: Página de detalhe
// ─────────────────────────────────────────────────────────────────────────────
function PreviewPage({ form }: { form: Partial<Atividade> }) {
  const [activeImg, setActiveImg] = useState(0);
  const imagens = form.imagens && form.imagens.length > 0 ? form.imagens : [];
  const capaUrl = imagens.length > 0 ? imagens[activeImg]?.url : undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-black/30 text-center">
        Preview — Página de Detalhe
      </p>

      {/* Hero */}
      <div className="relative w-full h-48 rounded-sm overflow-hidden">
        {capaUrl ? (
          <img src={capaUrl} className="w-full h-full object-cover brightness-50 grayscale" alt="" />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-stone-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <div className="flex gap-1.5 mb-2">
            {form.tipoAcao && (
              <span className="px-2 py-0.5 bg-destaque-1 text-white text-[7px] font-mono uppercase tracking-wider font-bold">
                {form.tipoAcao}
              </span>
            )}
            {form.demandante && (
              <span className="px-2 py-0.5 bg-white/20 text-white text-[7px] font-mono uppercase tracking-wider font-bold">
                {form.demandante}
              </span>
            )}
          </div>
          <h2 className="text-white font-serif font-bold text-lg leading-tight">
            {form.titulo || <span className="opacity-50 italic">Título da atividade...</span>}
          </h2>
        </div>
      </div>

      {/* Gallery thumbnails */}
      {imagens.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto">
          {imagens.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImg(idx)}
              className={`shrink-0 w-16 h-12 border-2 overflow-hidden transition-colors ${
                idx === activeImg ? 'border-destaque-1' : 'border-transparent'
              }`}
            >
              <img src={img.url} className="w-full h-full object-cover" alt={img.legenda || ''} />
            </button>
          ))}
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 space-y-4">
          {form.descricao && (
            <div>
              <h3 className="text-sm font-serif font-bold text-black mb-1">Resumo da Atividade</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">{form.descricao}</p>
            </div>
          )}
          {form.objetivo && (
            <p className="text-xs text-stone-700 font-light">
              <strong>Objetivo:</strong> {form.objetivo}
            </p>
          )}

          {/* Números em Destaque */}
          <section className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-black">Números em Destaque</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Destaque 1 */}
              <div className="bg-white border border-preto-10 p-3 rounded-sm shadow-xs flex flex-col gap-1">
                <div className="w-6 h-6 border border-preto-10 text-destaque-1 flex items-center justify-center bg-destaque-1/5">
                  <Leaf className="w-3 h-3" />
                </div>
                <div className="text-lg font-serif font-bold text-destaque-1 mt-1">{form.metrica1Valor || '2.500'}</div>
                <div className="text-[7px] font-mono text-stone-500 uppercase tracking-wider font-bold">
                  {form.metrica1Rotulo || 'Mudas Adquiridas'}
                </div>
              </div>

              {/* Destaque 2 */}
              <div className="bg-white border border-preto-10 p-3 rounded-sm shadow-xs flex flex-col gap-1">
                <div className="w-6 h-6 border border-preto-10 text-destaque-2 flex items-center justify-center bg-destaque-2/5">
                  <Users className="w-3 h-3" />
                </div>
                <div className="text-lg font-serif font-bold text-destaque-2 mt-1">{form.valorImpacto || '45 Unidades'}</div>
                <div className="text-[7px] font-mono text-stone-500 uppercase tracking-wider font-bold">
                  {form.rotuloImpacto || 'Mecanismo de Impacto'}
                </div>
              </div>

              {/* Destaque 3 - Delineamento Espacial */}
              <div className="bg-fundo-escuro text-white p-4 rounded-sm col-span-2 flex flex-col gap-1 relative overflow-hidden shadow-xs">
                <span className="text-[8px] font-mono text-destaque-1 uppercase tracking-wider font-bold">Delineamento Espacial</span>
                <span className="text-lg font-serif italic text-destaque-1 font-bold">
                  {form.hectares || '0 Hectares'}
                </span>
                <span className="text-[10px] text-white/80 leading-relaxed font-sans font-light">
                  {form.delineamentoDescricao || 'Gleba delimitada e monitorada ativamente através de sensores orbitais diários para verificação do progresso da vegetação nativa integrada.'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-preto-10 p-4 rounded-sm shadow-xs space-y-4">
            {form.data && (
              <div>
                <p className="text-[8px] font-mono uppercase tracking-wider text-stone-400 mb-1">Data / Período</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-destaque-1" />
                  <p className="font-mono text-xs font-bold text-destaque-1">{form.data}</p>
                </div>
              </div>
            )}
            {form.pontos && form.pontos.length > 0 && (
              <div>
                <p className="text-[8px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Pontos Geográficos ({form.pontos.length})
                </p>
                <div className="space-y-1">
                  {form.pontos.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono text-stone-600">
                      <MapPin className="w-2.5 h-2.5 text-destaque-1 shrink-0" />
                      <span>{p.rotulo || `Ponto ${i + 1}`}: {p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instituições Parceiras */}
            {form.parceiros && form.parceiros.length > 0 && (
              <div className="border-t border-preto-10 pt-3">
                <p className="text-[8px] font-mono uppercase tracking-wider text-stone-400 mb-2">Instituições Parceiras</p>
                <ul className="space-y-1.5 font-sans">
                  {form.parceiros.map((parc, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-1.5 bg-preto-5 rounded-sm border border-preto-10">
                      <div className="w-5 h-5 bg-destaque-1 text-white flex items-center justify-center font-bold text-[8px] shrink-0">
                        {parc[0]?.toUpperCase() || 'P'}
                      </div>
                      <span className="text-[9px] font-bold text-stone-700 font-mono tracking-wide uppercase truncate">{parc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main EditorAtividade
// ─────────────────────────────────────────────────────────────────────────────
interface EditorAtividadeProps {
  editing: Atividade | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditorAtividade({ editing, onClose, onSaved }: EditorAtividadeProps) {
  const [form, setForm] = useState<Partial<Atividade>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [previewTab, setPreviewTab] = useState<'card' | 'page'>('card');

  useEffect(() => {
    setForm(editing ? { ...editing } : { ...emptyForm });
  }, [editing]);

  const set = <K extends keyof Atividade>(key: K, value: Atividade[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleBadge = (badge: string) =>
    setForm((f) => ({
      ...f,
      insignias: f.insignias?.includes(badge)
        ? f.insignias.filter((b) => b !== badge)
        : [...(f.insignias || []), badge],
    }));

  const toggleState = (st: string) =>
    setForm((f) => ({
      ...f,
      estados: f.estados?.includes(st)
        ? f.estados.filter((s) => s !== st)
        : [...(f.estados || []), st],
    }));

  const save = async (status: 'publicado' | 'rascunho') => {
    const isSavingDraft = status === 'rascunho';
    if (isSavingDraft) setSavingDraft(true); else setSaving(true);
    try {
      const payload = { ...form, status };
      if (editing) {
        await adminApi.updateActivity(editing.id, payload);
      } else {
        await adminApi.createActivity(payload);
      }
      onSaved();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      if (isSavingDraft) setSavingDraft(false); else setSaving(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save('publicado');
  };

  const isPublished = form.status === 'publicado';

  return (
    <div className="fixed inset-0 z-50 bg-preto-5 flex flex-col overflow-hidden">
      {/* ── Topbar ── */}
      <header className="bg-white border-b border-preto-10 px-5 py-3 flex items-center gap-4 shrink-0 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-black/40 hover:text-black/80 transition-colors font-mono uppercase text-[9px] font-bold tracking-[0.15em]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </button>

        <div className="h-4 w-px bg-preto-10" />

        <div className="flex-1 min-w-0">
          <span className="text-destaque-1 font-mono uppercase tracking-[0.2em] text-[8px] font-bold block">
            {editing ? `ATIV-${editing.id}` : 'Nova Atividade'}
          </span>
          <h1 className="font-serif font-bold text-black text-sm truncate">
            {form.titulo || 'Sem título'}
          </h1>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 border font-mono uppercase text-[8px] font-bold tracking-wider ${
          isPublished
            ? 'border-destaque-1/40 bg-destaque-1/5 text-destaque-1'
            : 'border-amber-300 bg-amber-50 text-amber-700'
        }`}>
          {isPublished
            ? <><CheckCircle2 className="w-2.5 h-2.5" /> Publicado</>
            : <><Clock className="w-2.5 h-2.5" /> Rascunho</>
          }
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => save('rascunho')}
            disabled={savingDraft || saving}
            className="flex items-center gap-1.5 px-3 py-2 border border-preto-10 text-black/60 hover:bg-preto-5 transition-colors font-mono uppercase tracking-[0.15em] text-[9px] font-bold disabled:opacity-50"
          >
            {savingDraft ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Rascunho
          </button>
          <button
            type="button"
            onClick={() => save('publicado')}
            disabled={saving || savingDraft || !form.titulo}
            className="flex items-center gap-1.5 px-4 py-2 bg-destaque-1 hover:bg-destaque-1/90 text-white font-mono uppercase tracking-[0.15em] text-[9px] font-bold transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            {editing ? 'Atualizar' : 'Publicar'}
          </button>
        </div>
      </header>

      {/* ── Body: Form + Preview ── */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Form */}
        <form
          id="editor-atividade-form"
          onSubmit={handleSubmit}
          className="w-[480px] shrink-0 overflow-y-auto border-r border-preto-10 bg-white"
        >
          <div className="p-6 space-y-5">

            {/* Section: Identificação */}
            <SectionHeader label="Identificação" />

            <Field label="Título" required>
              <input
                className={inputClass}
                value={form.titulo || ''}
                onChange={(e) => set('titulo', e.target.value)}
                placeholder="Ex: Mutirão de Regularização Fundiária"
                required
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Componente">
                <select
                  className={inputClass}
                  value={form.componenteId || 1}
                  onChange={(e) => set('componenteId', Number(e.target.value))}
                >
                  <option value={1}>1 — Fortalecimento institucional</option>
                  <option value={2}>2 — Apoio à regularização ambiental</option>
                  <option value={3}>3 — Recomposição e restauração ecológica</option>
                  <option value={4}>4 — Gestão do Projeto</option>
                </select>
              </Field>
              <Field label="Tipo de Ação">
                <select
                  className={inputClass}
                  value={form.tipoAcao || 'Mutirão'}
                  onChange={(e) => set('tipoAcao', e.target.value)}
                >
                  <option value="Mutirão">Mutirão</option>
                  <option value="Jornada do CAR">Jornada do CAR</option>
                  <option value="Consultoria">Consultoria</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Aquisição de bens">Aquisição de bens</option>
                  <option value="Digital">Digital</option>
                  <option value="Restauração/Recuperação">Restauração/Recuperação</option>
                </select>
              </Field>
              <Field label="Demandante">
                <select
                  className={inputClass}
                  value={form.demandante || 'SFB'}
                  onChange={(e) => set('demandante', e.target.value)}
                >
                  <option value="SFB">SFB</option>
                  <option value="Embrapa">Embrapa</option>
                  <option value="SEDAM-RO">SEDAM-RO</option>
                  <option value="SEMAS-PA">SEMAS-PA</option>
                  <option value="SEMA/MT">SEMA/MT</option>
                </select>
              </Field>
            </div>

            <Field label="Estados (UFs)">
              <div className="flex flex-wrap gap-2">
                {ALL_STATES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleState(st)}
                    className={`text-[9px] font-mono font-bold px-3 py-1.5 border transition-colors uppercase tracking-wider flex items-center gap-1 ${
                      form.estados?.includes(st)
                        ? 'bg-destaque-1 text-white border-destaque-1'
                        : 'border-preto-10 text-black/50 hover:border-destaque-1/50 hover:text-destaque-1'
                    }`}
                  >
                    {form.estados?.includes(st) && <X className="w-2.5 h-2.5" />}
                    {st}
                  </button>
                ))}
              </div>
            </Field>

            {/* Section: Conteúdo */}
            <SectionHeader label="Conteúdo" />

            <Field label="Descrição">
              <textarea
                className={textareaClass}
                rows={4}
                value={form.descricao || ''}
                onChange={(e) => set('descricao', e.target.value)}
                placeholder="Descreva a atividade em detalhes..."
              />
            </Field>

            <Field label="Objetivo">
              <input
                className={inputClass}
                value={form.objetivo || ''}
                onChange={(e) => set('objetivo', e.target.value)}
                placeholder="Ex: Regularizar 200 propriedades rurais"
              />
            </Field>

            {/* Section: Números em Destaque */}
            <SectionHeader label="Números em Destaque (3 Cards)" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Card 1 — Valor">
                <input
                  className={inputClass}
                  value={form.metrica1Valor || ''}
                  onChange={(e) => set('metrica1Valor', e.target.value)}
                  placeholder="Ex: 2.500"
                />
              </Field>
              <Field label="Card 1 — Rótulo">
                <input
                  className={inputClass}
                  value={form.metrica1Rotulo || ''}
                  onChange={(e) => set('metrica1Rotulo', e.target.value)}
                  placeholder="Ex: MUDAS ADQUIRIDAS"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Card 2 — Valor (Impacto)">
                <input
                  className={inputClass}
                  value={form.valorImpacto || ''}
                  onChange={(e) => set('valorImpacto', e.target.value)}
                  placeholder="Ex: 45 Unidades"
                />
              </Field>
              <Field label="Card 2 — Rótulo (Impacto)">
                <input
                  className={inputClass}
                  value={form.rotuloImpacto || ''}
                  onChange={(e) => set('rotuloImpacto', e.target.value)}
                  placeholder="Ex: MECANISMO DE IMPACTO"
                />
              </Field>
            </div>

            <div className="space-y-3">
              <Field label="Card 3 — Delineamento Espacial (Hectares)">
                <input
                  className={inputClass}
                  value={form.hectares || ''}
                  onChange={(e) => set('hectares', e.target.value)}
                  placeholder="Ex: 12.000 Hectares"
                />
              </Field>
              <Field label="Card 3 — Descrição do Delineamento">
                <textarea
                  className={textareaClass}
                  rows={2}
                  value={form.delineamentoDescricao || ''}
                  onChange={(e) => set('delineamentoDescricao', e.target.value)}
                  placeholder="Descrição da área / gleba monitorada..."
                />
              </Field>
            </div>

            {/* Instituições Parceiras */}
            <ParceirosEditor
              parceiros={form.parceiros || []}
              onChange={(parceiros) => set('parceiros', parceiros)}
            />

            {/* Section: Local & Data */}
            <SectionHeader label="Data / Período da Ação" />

            <Field label="Data / Período">
              <input
                className={inputClass}
                value={form.data || ''}
                onChange={(e) => set('data', e.target.value)}
                placeholder="Ex: Março 2024"
              />
            </Field>

            {/* Pontos Geográficos */}
            <PontosEditor
              pontos={form.pontos || []}
              onChange={(pontos) => set('pontos', pontos as AtividadePonto[])}
            />

            {/* Section: Galeria */}
            <SectionHeader label="Galeria de Imagens" />

            <MultiFileUpload
              imagens={form.imagens || []}
              onChange={(imagens) => set('imagens', imagens as AtividadeImagem[])}
            />

            {/* Section: Badges */}
            <SectionHeader label="Insígnias / Badges" />

            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  className={`text-[9px] font-mono font-bold px-3 py-1.5 border transition-colors uppercase tracking-wider flex items-center gap-1 ${
                    form.insignias?.includes(badge)
                      ? 'bg-destaque-1 text-white border-destaque-1'
                      : 'border-preto-10 text-black/50 hover:border-destaque-1/50 hover:text-destaque-1'
                  }`}
                >
                  {form.insignias?.includes(badge) && <X className="w-2.5 h-2.5" />}
                  {badge}
                </button>
              ))}
            </div>

            {/* Bottom spacer */}
            <div className="h-4" />
          </div>
        </form>

        {/* RIGHT: Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-stone-50">
          {/* Preview Tabs */}
          <div className="bg-white border-b border-preto-10 px-5 py-3 flex items-center gap-3 shrink-0">
            <Eye className="w-3.5 h-3.5 text-black/30" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-black/30 mr-2">Preview</span>
            <button
              type="button"
              onClick={() => setPreviewTab('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-colors border ${
                previewTab === 'card'
                  ? 'bg-destaque-1 text-white border-destaque-1'
                  : 'border-preto-10 text-black/50 hover:border-destaque-1/40'
              }`}
            >
              <FileText className="w-3 h-3" />
              Card
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('page')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-colors border ${
                previewTab === 'page'
                  ? 'bg-destaque-1 text-white border-destaque-1'
                  : 'border-preto-10 text-black/50 hover:border-destaque-1/40'
              }`}
            >
              <Eye className="w-3 h-3" />
              Página
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {previewTab === 'card'
              ? <PreviewCard form={form} />
              : <PreviewPage form={form} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="pt-2">
      <span className="text-destaque-1 font-mono tracking-[0.22em] text-[8px] uppercase font-bold block mb-1">{label}</span>
      <div className="h-px bg-preto-10" />
    </div>
  );
}
