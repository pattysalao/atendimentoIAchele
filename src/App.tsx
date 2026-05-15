import { useState, useEffect } from 'react';
import AnamnesePage from './components/AnamnesePage';
import AdminDashboard from './components/AdminDashboard';
import LoyaltyCard from './components/LoyaltyCard';

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

  // 4. Ecrã Inicial / Hub de Links
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <img src="/logo.png" alt="Logo Studio" className="w-32 mb-8 object-contain" />
      <h1 className="text-[#FFC5D3] text-2xl font-bold mb-2">Studio Estética Avançada</h1>
      <p className="text-zinc-500 text-sm mb-10">Central de Atendimento e Fidelidade</p>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={() => { window.history.pushState({}, '', '/fidelidade'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl font-bold hover:border-[#FFC5D3] transition-colors"
        >
          💖 Meu Clube de Fidelidade
        </button>
        <button 
          onClick={() => { window.history.pushState({}, '', '/anamnese?tipo=cilios'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl font-bold hover:border-[#FFC5D3] transition-colors"
        >
          📋 Preencher Ficha de Saúde
        </button>
      </div>
    </div>
  );
}