import { useState, useEffect } from 'react';
import AnamnesePage from './components/AnamnesePage';
import AdminDashboard from './components/AdminDashboard';
import LoyaltyCard from './components/LoyaltyCard';
import LandingPage from './components/LandingPage';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const searchParams = new URLSearchParams(window.location.search);
  
  // Captura dados da URL
  const telefone = searchParams.get('telefone') || '';

  useEffect(() => {
    const handleLocationChange = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // --- ROTEAMENTO ---

  // 1. Painel da Michele (atendimento-i-achele.../admin)
  if (route === '/admin') {
    return <AdminDashboard />;
  }

  // 2. Cartão de Fidelidade (atendimento-i-achele.../fidelidade)
  if (route === '/fidelidade' || route === '/perfil') {
    return <LoyaltyCard telefone={telefone} />;
  }

  // 3. Fichas de Anamnese (atendimento-i-achele.../anamnese)
  if (route === '/anamnese') {
    return <AnamnesePage />;
  }

  // 4. Tela Inicial Completa (O Mini-Site)
  return <LandingPage />;
}