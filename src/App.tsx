import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import AnamnesePage from './components/AnamnesePage';
import AdminDashboard from './components/AdminDashboard';
import LoyaltyCard from './components/LoyaltyCard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import VeloBelezaHome from './components/VeloBelezaHome';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [user, setUser] = useState<any>(null);
  
  const searchParams = new URLSearchParams(window.location.search);
  
  // Captura dados da URL
  const telefone = searchParams.get('telefone') || '';
  const proId = searchParams.get('pro') || ''; // NOVO: Puxa o ID da profissional da URL

  useEffect(() => {
    // Monitora se o usuário está logado
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleLocationChange = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      unsubscribe();
    };
  }, []);

  // --- ROTEAMENTO MULTI-TENANT VELO BELEZA ---

  // 1. Painel Admin (Protegido por Login)
  if (route === '/admin') {
    return user ? <AdminDashboard /> : <Login />;
  }

  // 2. Cartão de Fidelidade
  if (route === '/fidelidade' || route === '/perfil') {
    return <LoyaltyCard telefone={telefone} />;
  }

  // 3. Fichas de Anamnese
  if (route === '/anamnese') {
    return <AnamnesePage />;
  }

  // 4. Site da Profissional (O Mini-Site repassa o ID para puxar os dados certos)
  if (route === '/studio' || route === '/home') {
    return <LandingPage proId={proId} />;
  }

  // 5. Landing Page Institucional (O que o mundo vê no domínio principal)
  return <VeloBelezaHome />;
}