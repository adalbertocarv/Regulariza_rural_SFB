import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Newspaper, Zap, BookOpen, MessageSquare,
  BarChart3, HelpCircle, LogOut, Menu, X, ChevronRight, Leaf, ExternalLink,
} from 'lucide-react';
import GerenciadorNoticias from './modules/GerenciadorNoticias';
import GerenciadorAtividades from './modules/GerenciadorAtividades';
import GerenciadorDocumentos from './modules/GerenciadorDocumentos';
import GerenciadorDepoimentos from './modules/GerenciadorDepoimentos';
import GerenciadorEstatisticas from './modules/GerenciadorEstatisticas';
import GerenciadorFaq from './modules/GerenciadorFaq';

type Section = 'overview' | 'news' | 'activities' | 'documents' | 'testimonials' | 'stats' | 'faqs';

const navItems: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'overview',    label: 'Visão Geral',  icon: LayoutDashboard, description: 'Painel de controle' },
  { id: 'news',        label: 'Notícias',     icon: Newspaper,       description: 'Publicações e atualizações' },
  { id: 'activities',  label: 'Atividades',   icon: Zap,             description: 'Ações do projeto' },
  { id: 'documents',   label: 'Repositório',  icon: BookOpen,        description: 'Documentos e arquivos' },
  { id: 'testimonials',label: 'Depoimentos',  icon: MessageSquare,   description: 'Relatos de beneficiários' },
  { id: 'stats',       label: 'Métricas',     icon: BarChart3,       description: 'Indicadores do projeto' },
  { id: 'faqs',        label: 'FAQs',         icon: HelpCircle,      description: 'Perguntas frequentes' },
];

function Overview({ user, onSelectSection }: { user: { nome: string | null; email: string }; onSelectSection: (s: Section) => void }) {
  const name = user.nome || user.email.split('@')[0];
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <span className="text-destaque-1 font-mono tracking-[0.25em] text-[9px] uppercase font-bold block mb-2">
          Bem-vindo de volta
        </span>
        <h2 className="text-3xl font-serif font-bold text-black tracking-tight mb-1">
          Olá, <span className="italic text-destaque-1">{name}</span>
        </h2>
        <div className="h-[2px] w-12 bg-destaque-1 mt-4" />
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.slice(1).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className="group bg-white border border-preto-10 p-6 text-left hover:border-destaque-1/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 bg-preto-5 border border-preto-10 flex items-center justify-center group-hover:bg-destaque-1/10 group-hover:border-destaque-1/30 transition-colors">
                <item.icon className="w-4.5 h-4.5 text-black/60 group-hover:text-destaque-1 transition-colors" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-preto-10 group-hover:text-destaque-1 transition-colors mt-1" />
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[9px] text-black/40 font-bold mb-1">
                {item.description}
              </div>
              <div className="font-serif font-bold text-black text-base group-hover:text-destaque-1 transition-colors">
                {item.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Painel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/rr-gestao/acesso');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'news':         return <GerenciadorNoticias />;
      case 'activities':   return <GerenciadorAtividades />;
      case 'documents':    return <GerenciadorDocumentos />;
      case 'testimonials': return <GerenciadorDepoimentos />;
      case 'stats':        return <GerenciadorEstatisticas />;
      case 'faqs':         return <GerenciadorFaq />;
      default:             return <Overview user={user!} onSelectSection={setActiveSection} />;
    }
  };

  const currentNav = navItems.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen bg-preto-5 flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fundo-escuro editorial */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-fundo-escuro z-30 flex flex-col transition-transform duration-300 border-r border-white/5 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-7 h-7 bg-destaque-1 flex items-center justify-center shrink-0">
            <Leaf className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-serif text-sm font-bold italic tracking-tight leading-tight">
              Regulariza Rural
            </div>
            <div className="text-white/35 font-mono uppercase tracking-[0.2em] text-[8px] font-bold mt-0.5">
              CMS Admin
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-white/40 hover:text-white/80 transition-colors focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <span className="px-3 mb-3 block font-mono uppercase tracking-[0.2em] text-[8px] text-white/25 font-bold">
            Módulos
          </span>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 focus:outline-none cursor-pointer group relative ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/45 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-destaque-1" />
                )}
                <item.icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${isActive ? 'text-destaque-1' : 'text-white/30 group-hover:text-white/60'}`} />
                <span className="font-mono uppercase tracking-[0.15em] text-[9px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-7 h-7 bg-destaque-1/20 border border-destaque-1/30 flex items-center justify-center text-destaque-1 font-mono font-bold text-[10px] shrink-0">
              {(user?.nome || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/80 text-xs font-semibold truncate leading-tight">
                {user?.nome || 'Admin'}
              </div>
              <div className="text-white/30 text-[9px] truncate font-mono mt-0.5">{user?.email}</div>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none font-mono uppercase tracking-[0.15em] text-[9px] font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-preto-10 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-black/40 hover:text-black/80 transition-colors focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-black/30 font-mono uppercase tracking-[0.15em] text-[9px] font-bold">
                CMS
              </span>
              <ChevronRight className="w-3 h-3 text-black/20" />
              <span className="text-black/50 font-mono uppercase tracking-[0.15em] text-[9px] font-bold">
                {currentNav?.label || 'Dashboard'}
              </span>
            </div>
            <h1 className="font-serif font-bold text-black text-lg leading-tight mt-0.5">
              {currentNav?.label || 'Visão Geral'}
            </h1>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 font-mono uppercase tracking-[0.15em] text-[9px] font-bold text-destaque-1 hover:text-destaque-2 transition-colors"
          >
            Ver Portal <ExternalLink className="w-3 h-3" />
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
