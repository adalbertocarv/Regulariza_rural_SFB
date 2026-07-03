import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/projeto', label: 'O Projeto' },
  { path: '/noticias', label: 'Notícias' },
  { path: '/atividades', label: 'Atividades' },
  { path: '/resultados', label: 'Resultados' },
  { path: '/repositorio', label: 'Repositório' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'BR' | 'EN'>('BR');
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-preto-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group text-left focus:outline-none"
            id="nav-logo"
          >
            <span className="text-2xl font-serif italic text-black tracking-tight hover:text-destaque-1 transition-colors">
              Regulariza <span className="font-sans font-bold not-italic text-xs uppercase tracking-[0.25em] pl-1.5 text-destaque-1">Rural</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  id={`nav-item-${item.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative px-4 py-2 font-mono uppercase tracking-[0.22em] text-[10px] font-semibold transition-colors duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'text-destaque-1 font-bold'
                        : 'text-black/55 hover:text-destaque-1'
                    }`
                  }
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-destaque-1"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono uppercase tracking-[0.2em] text-[10px] font-bold text-black/60 hover:text-destaque-1 hover:bg-preto-5 rounded-sm transition-colors focus:outline-none cursor-pointer"
                id="language-select-btn"
              >
                <Globe className="w-3.5 h-3.5 stroke-[2]" />
                <span>{lang}</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-white border border-preto-10 rounded-sm shadow-xl overflow-hidden z-20"
                    >
                      {(['BR', 'EN'] as const).map((langOption) => (
                        <button
                          key={langOption}
                          onClick={() => {
                            setLang(langOption);
                            setLangOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left font-mono uppercase tracking-[0.15em] text-[9px] font-semibold cursor-pointer transition-colors ${
                            lang === langOption
                              ? 'bg-preto-5 text-destaque-1 font-bold'
                              : 'text-black/60 hover:bg-preto-5 hover:text-destaque-1'
                          }`}
                        >
                          {langOption === 'BR' ? 'Português (BR)' : 'English'}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-black/75 hover:text-black focus:outline-none cursor-pointer"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-preto-10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-left font-mono uppercase tracking-[0.18em] text-[10px] font-semibold rounded-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-preto-5 text-destaque-1 font-bold'
                        : 'text-black/60 hover:bg-preto-5 hover:text-destaque-1'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="h-px bg-preto-10 my-2" />
              <div className="flex justify-between items-center px-4 py-2">
                <span className="font-mono uppercase tracking-[0.18em] text-[10px] text-black/50 font-bold">Idioma</span>
                <div className="flex gap-2">
                  {(['BR', 'EN'] as const).map((langVal) => (
                    <button
                      key={langVal}
                      onClick={() => setLang(langVal)}
                      className={`px-3 py-1 font-mono text-[9px] font-bold rounded-sm cursor-pointer transition-all ${
                        lang === langVal
                          ? 'bg-destaque-1 text-white'
                          : 'bg-preto-5 text-black/60 hover:text-destaque-1'
                      }`}
                    >
                      {langVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
