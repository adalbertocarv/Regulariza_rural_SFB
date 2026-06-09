import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Project from './pages/Project';
import News from './pages/News';
import Activities from './pages/Activities';
import Results from './pages/Results';
import Repository from './pages/Repository';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

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
        <Route path="/" element={<Home />} />
        <Route path="/projeto" element={<Project />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/atividades" element={<Activities />} />
        <Route path="/resultados" element={<Results />} />
        <Route path="/repositorio" element={<Repository />} />
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
          <Route path="/rr-gestao/acesso" element={<AdminLogin />} />
          <Route
            path="/rr-gestao/painel"
            element={
              <ProtectedRoute>
                <Dashboard />
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
