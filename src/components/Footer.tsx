import { NavLink } from 'react-router-dom';
import { Leaf, MapPin, Mail, Phone, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-white font-bold text-lg">Regulariza Rural</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Unindo precisão técnica e compromisso ambiental para regularizar o futuro do campo.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Início', to: '/' },
                { label: 'O Projeto', to: '/projeto' },
                { label: 'Notícias', to: '/noticias' },
                { label: 'Atividades', to: '/atividades' },
                { label: 'Resultados', to: '/resultados' },
                { label: 'Repositório', to: '/repositorio' },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="hover:text-green-400 transition-colors">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Áreas de Atuação</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>Análise de Georreferenciamento</li>
              <li>Monitoramento Vegetal</li>
              <li>Consultoria Jurídica</li>
              <li>Recuperação de Áreas</li>
              <li>Regularização CAR</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span>Brasília, DF — Brasil</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>contato@regularizarural.gov.br</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <span>(61) 3000-0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2024 Regulariza Rural. Todos os direitos reservados.</span>
          <span>Ministério do Meio Ambiente e Mudança do Clima</span>
        </div>
      </div>
    </footer>
  );
}
