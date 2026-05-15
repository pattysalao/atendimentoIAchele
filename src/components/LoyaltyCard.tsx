import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  History, 
  Gift, 
  MapPin, 
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { loyaltyService, ClienteFidelidade } from '../lib/loyaltyService';

export default function LoyaltyCard({ telefone }: { telefone: string }) {
  const [cliente, setCliente] = useState<ClienteFidelidade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await loyaltyService.getClienteByTelefone(telefone);
      setCliente(data);
      setLoading(false);
    }
    load();
  }, [telefone]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-12 h-12 border-2 border-pink-500 rounded-full"
      />
    </div>
  );

  if (!cliente) return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 max-w-sm">
        <Sparkles size={48} className="text-pink-400 mx-auto mb-4" />
        <h2 className="text-2xl font-light mb-4">Cliente não encontrado</h2>
        <p className="text-white/40 mb-8">Parece que você ainda não faz parte do clube Michele Estética.</p>
        <button className="w-full bg-pink-500 text-black py-3 rounded-full font-bold">Falar com Michele</button>
      </div>
    </div>
  );

  const metaPontos = 10;
  const progresso = Math.min((cliente.saldo_pontos / metaPontos) * 100, 100);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto font-sans">
      <div className="flex-1 bg-white/[0.03] rounded-[40px] border border-white/10 p-12 flex flex-col relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-custom/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-20 h-20 rounded-full border-2 border-pink-custom p-1 bg-black overflow-hidden shadow-xl">
             <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center text-3xl">✨</div>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black mb-1">Área da Cliente</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter">{cliente.nome}</h2>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-pink-custom text-black px-3 py-1 rounded-full font-black uppercase tracking-widest">VIP {cliente.tier_vip}</span>
              <span className="text-[10px] border border-white/10 text-white/40 px-3 py-1 rounded-full font-bold uppercase tracking-widest">ID: {cliente.id?.slice(0, 5)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          {/* Main Balance Card */}
          <div className="bg-black/60 border border-pink-custom/20 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[11px] text-pink-custom uppercase tracking-[0.3em] font-black mb-3">Seu Cashback</p>
                <p className="text-6xl font-black tracking-tighter">R$ {cliente.saldo_cashback.toFixed(2)}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Meta de Pontos</p>
                <p className="text-2xl font-black text-pink-custom">{cliente.saldo_pontos} <span className="text-sm text-white/20">/ {metaPontos}</span></p>
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-4 p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progresso}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-pink-custom to-pink-500 rounded-full shadow-[0_0_20px_rgba(255,197,211,0.3)]"
                />
              </div>
              <p className="text-[11px] text-white/40 italic font-medium">Faltam {metaPontos - cliente.saldo_pontos} visitas para sua recompensa exclusiva!</p>
            </div>
          </div>

          {/* Quick Info & Actions */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 flex flex-col justify-between flex-1">
              <TrendingUp size={24} className="text-pink-custom mb-2" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Status da Fidelidade</p>
                <p className="text-lg font-black uppercase tracking-tight text-white/80">Quase lá!</p>
              </div>
            </div>
            
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 flex flex-col justify-between flex-1">
              <Calendar size={24} className="text-pink-custom mb-2" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Última Visita</p>
                <p className="text-lg font-black uppercase tracking-tight text-white/80">
                  {cliente.ultima_visita ? new Date(cliente.ultima_visita?.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History / Rewards section */}
        <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/30 font-black">Histórico de Procedimentos</p>
            <History size={16} className="text-white/20" />
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1 group-hover:text-pink-custom transition-colors">Microagulhamento Facial</p>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">14 Jan 2026</p>
              </div>
              <div className="text-right">
                <p className="text-pink-custom font-black text-sm tracking-widest">+R$ 15,00</p>
              </div>
            </div>
             <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1 group-hover:text-pink-custom transition-colors">Drenagem Premium</p>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">22 Dez 2025</p>
              </div>
              <div className="text-right">
                <p className="text-pink-custom font-black text-sm tracking-widest">+R$ 8,50</p>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-10 w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-3xl hover:bg-pink-custom transition-all shadow-2xl active:scale-95 transform">
          Agendar Próxima Sessão
        </button>
      </div>
    </div>
  );
}
