import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Leaf } from 'lucide-react';

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'O Projeto', to: '/projeto' },
  { label: 'Notícias', to: '/noticias' },
  { label: 'Atividades', to: '/atividades' },
  { label: 'Resultados', to: '/resultados' },
  { label: 'Repositório', to: '/repositorio' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg">
          <Leaf className={`w-5 h-5 ${transparent ? 'text-white' : 'text-green-700'}`} />
          <span className={transparent ? 'text-white' : 'text-green-700'}>Regulariza Rural</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors pb-0.5 border-b-2 ${
                  isActive
                    ? transparent
                      ? 'text-white border-white'
                      : 'text-green-700 border-green-600'
                    : transparent
                    ? 'text-white/80 border-transparent hover:text-white hover:border-white/60'
                    : 'text-gray-600 border-transparent hover:text-green-700 hover:border-green-400'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded border transition-colors ${
              transparent
                ? 'text-white border-white/40 hover:border-white'
                : 'text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-700'
            }`}
          >
            PT <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          className={`md:hidden ${transparent ? 'text-white' : 'text-gray-700'}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
