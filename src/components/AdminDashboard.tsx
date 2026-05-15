import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  PlusCircle, 
  Share2, 
  Search,
  DollarSign,
  Gift,
  Star
} from 'lucide-react';
import { loyaltyService, ClienteFidelidade } from '../lib/loyaltyService';

export default function AdminDashboard() {
  const [clientes, setClientes] = useState<ClienteFidelidade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteFidelidade | null>(null);
  const [valorVenda, setValorVenda] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const data = await loyaltyService.getClientes();
    setClientes(data);
    setLoading(false);
  };

  const handleRegisterSale = async () => {
    if (!selectedCliente || !valorVenda) return;
    const valor = parseFloat(valorVenda);
    await loyaltyService.registrarVenda(selectedCliente.id!, valor);
    setShowSaleModal(false);
    setValorVenda('');
    fetchClientes();
    alert('Venda registrada com sucesso! Pontos e cashback atualizados.');
  };

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.telefone.includes(searchTerm)
  );

  const generatePromo = () => {
    const msg = encodeURIComponent("Oi! Michele aqui com uma oferta relâmpago: Lifting Facial por apenas R$99 hoje! Vamos agendar?");
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const sendReviewBooster = (telefone: string) => {
    const link = "https://g.page/r/your-google-review-link/review";
    const msg = encodeURIComponent(`Olá! Sua avaliação no Google vale 5 pontos de bônus na Michele Estética! Link: ${link}`);
    window.open(`https://wa.me/${telefone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="h-full font-sans">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32"
        >
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Clientes</p>
          <p className="text-4xl font-black tracking-tighter text-pink-custom">{clientes.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32"
        >
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Pontos Gerados</p>
          <p className="text-4xl font-black tracking-tighter text-pink-custom">
            {clientes.reduce((acc, c) => acc + c.saldo_pontos, 0)} <span className="text-xs font-normal text-white/20 uppercase tracking-widest ml-1">pts</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-custom/5 blur-2xl rounded-full -mr-8 -mt-8" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold relative z-10">Review Booster</p>
          <p className="text-4xl font-black tracking-tighter text-pink-custom relative z-10">+5 <span className="text-xs font-normal text-white/20 uppercase tracking-widest ml-1">bônus</span></p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Customer Management */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-[#111] rounded-[2.5rem] border border-white/10 p-10 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs uppercase tracking-[0.4em] text-pink-custom font-black">Gestão de Clientes</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  placeholder="EX: JULIANA ALMEIDA" 
                  className="bg-black border border-white/5 rounded-full py-3 pl-12 pr-6 text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-pink-custom/40 w-64 placeholder:text-white/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
              {filteredClientes.map((cliente) => (
                <motion.div 
                  layout
                  key={cliente.id}
                  className="bg-black border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-pink-custom/30 transition-all group"
                  id={`customer-${cliente.id}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center text-pink-custom font-black border border-white/5">
                      {cliente.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest leading-none mb-2">{cliente.nome}</h3>
                      <p className="text-white/20 text-[10px] font-bold tracking-widest">{cliente.telefone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-1">Saldo Total</p>
                      <p className="text-pink-custom font-black text-xl tracking-tighter">R$ {cliente.saldo_cashback.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setSelectedCliente(cliente); setShowSaleModal(true); }}
                        className="w-10 h-10 bg-pink-custom text-black rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-pink-custom/10"
                        id={`btn-sale-${cliente.id}`}
                      >
                        <PlusCircle size={20} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => sendReviewBooster(cliente.telefone)}
                        className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                        id={`btn-review-${cliente.id}`}
                      >
                        <Star size={18} className="text-white/40 group-hover:text-yellow-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Tools Side Pane */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white/[0.03] rounded-[2.5rem] border border-white/10 p-10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-custom/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/40 font-black mb-8">Ferramentas de Marketing</h2>

            <div className="space-y-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-pink-custom to-pink-500 rounded-2xl flex items-center justify-center text-black">
                    <Gift size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Promo Relâmpago</h4>
                    <p className="text-[10px] text-white/30 italic">Lifting Facial 40% OFF</p>
                  </div>
                </div>
                <button 
                  onClick={generatePromo}
                  className="w-full py-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-green-500/20 transition-all"
                >
                  Disparar WhatsApp
                </button>
              </div>

              <div className="flex flex-col gap-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-pink-custom">
                    <Star size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Review Booster</h4>
                    <p className="text-[10px] text-white/30 italic">Ofereça +5 pontos bônus</p>
                  </div>
                </div>
                <div className="p-4 bg-black border border-white/5 rounded-xl flex items-center justify-between group">
                  <span className="text-[9px] text-white/30 tracking-widest font-bold truncate">G.PAGE/MICHELE...</span>
                  <button className="text-[9px] text-pink-custom font-black uppercase tracking-widest-plus group-hover:scale-105 transition-transform">Copiar</button>
                </div>
              </div>
            </div>

            <button className="mt-auto w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest-plus hover:bg-pink-custom transition-all shadow-2xl">
              Configurações Gerais
            </button>
          </div>
        </section>
      </div>

      {/* Sale Modal */}
      <AnimatePresence>
        {showSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSaleModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-light mb-6">Registrar Venda para <span className="text-pink-400">{selectedCliente?.nome}</span></h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Valor Total (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xl focus:outline-none focus:border-pink-500"
                      value={valorVenda}
                      onChange={(e) => setValorVenda(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-pink-500/5 p-4 rounded-2xl border border-pink-500/10 mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Cashback (10%)</span>
                    <span className="text-pink-300 font-mono">R$ {(parseFloat(valorVenda || '0') * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Pontos Ganhos</span>
                    <span className="text-pink-300 font-mono">{Math.floor(parseFloat(valorVenda || '0') / 20)} pts</span>
                  </div>
                </div>

                <button 
                  onClick={handleRegisterSale}
                  className="w-full bg-pink-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-pink-400 transition-colors shadow-lg shadow-pink-500/20"
                >
                  Confirmar e Gerar Pontos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
