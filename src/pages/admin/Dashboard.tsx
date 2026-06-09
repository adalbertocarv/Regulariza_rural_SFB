import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Newspaper, Zap, BookOpen, MessageSquare,
  BarChart3, HelpCircle, LogOut, Menu, X, Leaf, ChevronRight,
} from 'lucide-react';
import NewsManager from './modules/NewsManager';
import ActivitiesManager from './modules/ActivitiesManager';
import DocumentsManager from './modules/DocumentsManager';
import TestimonialsManager from './modules/TestimonialsManager';
import StatsManager from './modules/StatsManager';
import FaqManager from './modules/FaqManager';

type Section = 'overview' | 'news' | 'activities' | 'documents' | 'testimonials' | 'stats' | 'faqs';

const navItems: { id: Section; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'news', label: 'Notícias', icon: Newspaper },
  { id: 'activities', label: 'Atividades', icon: Zap },
  { id: 'documents', label: 'Repositório', icon: BookOpen },
  { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
  { id: 'stats', label: 'Métricas', icon: BarChart3 },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

function Overview({
  user,
  onSelectSection,
}: {
  user: { name: string | null; email: string };
  onSelectSection: (section: Section) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Olá, {user.name || user.email.split('@')[0]}! 👋
      </h2>
      <p className="text-gray-500 mb-8">Bem-vindo ao painel administrativo do Regulariza Rural.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {navItems.slice(1).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <item.icon className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-400">Gerenciar {item.label.toLowerCase()}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
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
      case 'news': return <NewsManager />;
      case 'activities': return <ActivitiesManager />;
      case 'documents': return <DocumentsManager />;
      case 'testimonials': return <TestimonialsManager />;
      case 'stats': return <StatsManager />;
      case 'faqs': return <FaqManager />;
      default: return <Overview user={user!} onSelectSection={setActiveSection} />;
    }
  };

  const currentNav = navItems.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">Regulariza Rural</div>
            <div className="text-xs text-gray-400">Admin CMS</div>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{currentNav?.label || 'Dashboard'}</h1>
            <p className="text-xs text-gray-400">Portal Regulariza Rural</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
          >
            Ver Portal <ChevronRight className="w-3 h-3" />
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
