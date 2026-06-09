import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Projeto from './pages/Projeto';
import Noticias from './pages/Noticias';
import Atividades from './pages/Atividades';
import Resultados from './pages/Resultados';
import Repositorio from './pages/Repositorio';
import AcessoAdmin from './pages/admin/Acesso';
import Painel from './pages/admin/Painel';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/rr-gestao/acesso" replace />;
}

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/projeto" element={<Projeto />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/atividades" element={<Atividades />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/repositorio" element={<Repositorio />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* CMS — Hidden routes, not linked from the public portal */}
          <Route path="/rr-gestao/acesso" element={<AcessoAdmin />} />
          <Route
            path="/rr-gestao/painel"
            element={
              <ProtectedRoute>
                <Painel />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
