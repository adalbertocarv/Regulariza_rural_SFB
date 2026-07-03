import { NavLink } from 'react-router-dom';
import { Mail, ShieldAlert, FileText, Globe } from 'lucide-react';

export default function Footer() {
  const partnerLogos = [
    {
      name: 'Cooperação Alemã',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Logo_Deutsche_Zusammenarbeit.png/512px-Logo_Deutsche_Zusammenarbeit.png',
      alt: 'Logo Cooperação Alemã'
    },
    {
      name: 'KfW',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/KfW_logo.svg/512px-KfW_logo.svg.png',
      alt: 'Logo KfW'
    },
    {
      name: 'IICA',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/IICA_Logo.svg/512px-IICA_Logo.svg.png',
      alt: 'Logo IICA'
    },
    {
      name: 'Serviço Florestal Brasileiro',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Servi%C3%A7o_Florestal_Brasileiro_-_logo.png/512px-Servi%C3%A7o_Florestal_Brasileiro_-_logo.png',
      alt: 'Logo Serviço Florestal Brasileiro'
    },
    {
      name: 'Ministério do Meio Ambiente e Mudança do Clima',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Logo_Minist%C3%A9rio_do_Meio_Ambiente_e_Mudan%C3%A7a_do_Clima.svg/512px-Logo_Minist%C3%A9rio_do_Meio_Ambiente_e_Mudan%C3%A7a_do_Clima.svg.png',
      alt: 'Logo Ministério do Meio Ambiente'
    },
    {
      name: 'Governo Federal do Brasil',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Governo_do_Brasil_2023.svg/512px-Governo_do_Brasil_2023.svg.png',
      alt: 'Logo Governo Federal do Brasil'
    }
  ];

  return (
    <footer className="bg-fundo-escuro text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Col 1: Logo & Info */}
          <div className="md:col-span-1">
            <NavLink 
              to="/"
              className="text-2xl font-serif font-light tracking-tight text-white mb-6 text-left hover:opacity-90 focus:outline-none block"
            >
              Regulariza <span className="font-serif italic text-destaque-1 font-bold">Rural</span>
            </NavLink>
            <div className="flex gap-4">
              <a
                href="mailto:contato@regularizarural.org"
                className="w-10 h-10 rounded-sm bg-white/5 hover:bg-destaque-2 hover:text-white border border-white/10 flex items-center justify-center text-white/85 transition-all duration-300"
                title="E-mail direto"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-[0.18em] mb-6">Navegação</h4>
            <ul className="space-y-3 font-sans text-xs select-none">
              {[
                { to: '/', label: 'Início' },
                { to: '/projeto', label: 'O Projeto' },
                { to: '/noticias', label: 'Notícias' },
                { to: '/atividades', label: 'Atividades' },
                { to: '/resultados', label: 'Resultados' },
                { to: '/repositorio', label: 'Repositório' },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-white/60 hover:text-destaque-1 transition-all text-left hover:underline decoration-destaque-1 underline-offset-4 font-semibold block"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-[0.18em] mb-6">Legal e Gestão</h4>
            <ul className="space-y-3 font-sans text-xs text-white/60 font-light">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-white/50" />
                <a href="#" className="hover:text-destaque-1 transition-colors">Transparência Governamental</a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-white/50" />
                <a href="#" className="hover:text-destaque-1 transition-colors">Política de Privacidade</a>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-white/50" />
                <a href="#" className="hover:text-destaque-1 transition-colors">Termos de Uso do Geoportal</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Institutional Partner Logos Bar */}
        <div className="pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch justify-center">
            {partnerLogos.map((logo, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg flex items-center justify-center border border-white/10 shadow-xs h-20 transition-all hover:scale-[1.03] select-none"
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
