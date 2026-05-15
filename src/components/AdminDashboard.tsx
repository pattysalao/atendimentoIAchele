import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  PlusCircle, 
  Share2, 
  Search,
  DollarSign,
  Gift,
  Star,
  Settings,
  Save
} from 'lucide-react';
import { loyaltyService, ClienteFidelidade } from '../lib/loyaltyService';

export default function AdminDashboard() {
  const [clientes, setClientes] = useState<ClienteFidelidade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteFidelidade | null>(null);
  const [valorVenda, setValorVenda] = useState('');
  
  // Estados do White-Label (Velo Beleza)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [empresaNome, setEmpresaNome] = useState('Velo Beleza');
  const [empresaSlogan, setEmpresaSlogan] = useState('Central de Atendimento e Fidelidade');
  const [empresaLogo, setEmpresaLogo] = useState('');
  const [empresaVideo, setEmpresaVideo] = useState(''); 
  const [empresaSobre, setEmpresaSobre] = useState(''); // NOVO
  const [empresaCnpj, setEmpresaCnpj] = useState('');   // NOVO
  const [empresaGoogleLink, setEmpresaGoogleLink] = useState(''); // NOVO
  
  // Estados de Loading do Cloudinary
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Busca os dados salvos no Firebase ao carregar o painel
  useEffect(() => {
    const carregarDadosSite = async () => {
      const config = await loyaltyService.getConfigSite();
      if (config) {
        if (config.nome) setEmpresaNome(config.nome);
        if (config.slogan) setEmpresaSlogan(config.slogan);
        if (config.logo) setEmpresaLogo(config.logo);
        if (config.video) setEmpresaVideo(config.video);
        if (config.sobre) setEmpresaSobre(config.sobre);
        if (config.cnpj) setEmpresaCnpj(config.cnpj);
        if (config.googleLink) setEmpresaGoogleLink(config.googleLink);
      }
    };
    carregarDadosSite();
  }, []);

  // Função de Upload para o Cloudinary (Direto do Navegador)
  const handleUploadCloudinary = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ATENÇÃO DIEGO: Você precisará colocar seus dados do Cloudinary aqui depois!
    const CLOUD_NAME = 'dcmkzokol'; 
    const UPLOAD_PRESET = 'velobeleza'; // O código que você gerou no passo anterior// Deve estar configurado como "Unsigned" no Cloudinary

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      if (tipo === 'image') setIsUploadingLogo(true);
      else setIsUploadingVideo(true);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${tipo}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        if (tipo === 'image') setEmpresaLogo(data.secure_url);
        else setEmpresaVideo(data.secure_url);
      } else {
        console.error("Erro do Cloudinary:", data);
        alert("Erro nas credenciais do Cloudinary. Verifique o console.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Falha ao subir arquivo para o Cloudinary.");
    } finally {
      setIsUploadingLogo(false);
      setIsUploadingVideo(false);
    }
  };

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
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input 
                  type="text" 
                  placeholder="BUSCAR CLIENTE..." 
                  className="bg-zinc-800 border border-zinc-600 rounded-full py-3 pl-12 pr-6 text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-pink-custom w-64 placeholder:text-zinc-400 shadow-inner text-white"
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

            <button 
              onClick={() => setShowSettingsModal(true)}
              className="mt-auto w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest-plus hover:bg-pink-custom transition-all shadow-2xl flex items-center justify-center gap-2"
            >
              <Settings size={16} />
              Configurações da Empresa
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
  className="relative bg-[#1a1a1a] border border-zinc-700 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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

        {/* Modal de Configurações (White-Label Velo) */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSettingsModal(false)}
            />
            <motion.div 
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="relative bg-[#1a1a1a] border border-zinc-700 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
>
             <h3 className="text-2xl font-light mb-2">Configurações <span className="text-pink-400">Velo Beleza</span></h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Ecossistema Velo Delivery</p>
              
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* IDENTIDADE VISUAL */}
                <div className="bg-zinc-800/80 p-5 rounded-2xl border border-zinc-600 shadow-sm">
                  <h4 className="text-pink-400 text-xs font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">1</span> 
                    Identidade Visual
                  </h4>
                  <div className="space-y-4">
                    <input type="text" placeholder="Nome do Studio (Ex: Velo Beleza)" value={empresaNome} onChange={(e) => setEmpresaNome(e.target.value)} className="w-full bg-zinc-900 border border-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm font-bold text-white placeholder:text-zinc-400 transition-all" />
                    <input type="text" placeholder="Slogan (Ex: Realçando sua beleza)" value={empresaSlogan} onChange={(e) => setEmpresaSlogan(e.target.value)} className="w-full bg-zinc-900 border border-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-white placeholder:text-zinc-400 transition-all" />
                    {/* Botão Upload de Logo */}
                    <div className="bg-zinc-900 border border-zinc-500 rounded-xl p-3">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">Logomarca (Upload)</label>
                      <div className="flex gap-2 items-center">
                        <input type="file" accept="image/*" onChange={(e) => handleUploadCloudinary(e, 'image')} className="text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 w-full cursor-pointer transition-all" />
                        {isUploadingLogo && <span className="text-pink-400 text-xs font-bold animate-pulse whitespace-nowrap">Enviando...</span>}
                      </div>
                      {empresaLogo && <p className="text-[10px] text-green-400 mt-2 truncate">✓ {empresaLogo}</p>}
                    </div>

                    {/* Botão Upload de Vídeo Reels */}
                    <div className="bg-zinc-900 border border-zinc-500 rounded-xl p-3">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">Vídeo Destaque (Reels/MP4)</label>
                      <div className="flex gap-2 items-center">
                        <input type="file" accept="video/*" onChange={(e) => handleUploadCloudinary(e, 'video')} className="text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 w-full cursor-pointer transition-all" />
                        {isUploadingVideo && <span className="text-pink-400 text-xs font-bold animate-pulse whitespace-nowrap">Enviando...</span>}
                      </div>
                      {empresaVideo && <p className="text-[10px] text-green-400 mt-2 truncate">✓ {empresaVideo}</p>}
                    </div>
                  </div>
                </div>

                {/* CONTEÚDO E SEO */}
                <div className="bg-zinc-800/80 p-5 rounded-2xl border border-zinc-600 shadow-sm">
                  <h4 className="text-pink-400 text-xs font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">2</span> 
                    Site e SEO (Google)
                  </h4>
                  <div className="space-y-4">
                    <textarea value={empresaSobre} onChange={(e) => setEmpresaSobre(e.target.value)} placeholder="Conte um pouco sobre o estúdio..." className="w-full bg-zinc-900 border border-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-white h-24 placeholder:text-zinc-400 transition-all" />
                    <input value={empresaCnpj} onChange={(e) => setEmpresaCnpj(e.target.value)} type="text" placeholder="CNPJ da Empresa" className="w-full bg-zinc-900 border border-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-white placeholder:text-zinc-400 transition-all" />
                    <input value={empresaGoogleLink} onChange={(e) => setEmpresaGoogleLink(e.target.value)} type="text" placeholder="Link do Google Meu Negócio" className="w-full bg-zinc-900 border border-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-white placeholder:text-zinc-400 transition-all" />
                  </div>
                </div>

               <button 
                  onClick={async () => {
                    try {
                      const configSite = {
                        nome: empresaNome,
                        slogan: empresaSlogan,
                        logo: empresaLogo,
                        video: empresaVideo,
                        sobre: empresaSobre,
                        cnpj: empresaCnpj,
                        googleLink: empresaGoogleLink
                      };
                      await loyaltyService.salvarConfigSite(configSite);
                      alert("Configurações do Velo Beleza salvas com sucesso!"); 
                      setShowSettingsModal(false);
                      window.location.reload(); 
                    } catch (error) {
                      console.error("Erro ao salvar:", error);
                      alert("Erro de permissão no Firebase! Verifique as regras do Firestore.");
                    }
                  }}
                  className="w-full bg-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-pink-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.3)] mt-6"
                >
                  <Save size={20} />
                  Salvar Configurações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
