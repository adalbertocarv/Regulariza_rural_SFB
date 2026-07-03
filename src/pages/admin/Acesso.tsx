import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, Leaf } from 'lucide-react';

export default function AcessoAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/rr-gestao/painel');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fundo-escuro flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background editorial texture */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-destaque-1/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-destaque-2/5 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-destaque-1 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-2xl font-serif italic text-white tracking-tight">
              Regulariza <span className="font-sans font-bold not-italic text-[10px] uppercase tracking-[0.25em] pl-1 text-destaque-1">Rural</span>
            </span>
          </div>
          <div className="h-px w-16 bg-destaque-1/60 mx-auto mb-5" />
          <span className="text-white/40 font-mono uppercase tracking-[0.25em] text-[9px] font-bold block">
            Painel Administrativo
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.06] border border-white/10 p-8 backdrop-blur-sm">
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-400/20 p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs font-sans leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-white/50 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@regularizarural.org"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-destaque-1/60 focus:ring-1 focus:ring-destaque-1/30 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-[0.18em] text-[9px] font-bold text-white/50 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-destaque-1/60 focus:ring-1 focus:ring-destaque-1/30 transition-all font-sans"
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-destaque-1 hover:bg-destaque-1/90 disabled:bg-destaque-1/40 disabled:cursor-not-allowed text-white font-mono uppercase tracking-[0.22em] text-[10px] font-bold transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 font-mono text-[9px] uppercase tracking-[0.2em] mt-8">
          © {new Date().getFullYear()} Regulariza Rural · Área Restrita
        </p>
      </div>
    </div>
  );
}
