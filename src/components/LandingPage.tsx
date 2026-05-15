import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loyaltyService } from '../lib/loyaltyService';
import { auth } from '../lib/firebase';

export default function LandingPage({ proId }: { proId?: string }) {
  const [siteData, setSiteData] = useState({
    nome: "Velo Beleza",
    slogan: "Realçando a tua beleza natural com exclusividade.",
    logo: "/logo.png",
    videoReels: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-41480-large.mp4",
    telefoneContato: "5548991276509",
    cnpj: "00.000.000/0001-00",
    endereco: "São José, SC",
    servicos: [
      { id: 1, nome: "Lash Lifting", preco: "R$ 120" },
      { id: 2, nome: "Extensão de Cílios", preco: "R$ 180" },
      { id: 3, nome: "Limpeza de Pele", preco: "R$ 150" }
    ]
  });

  // Carrega as configurações reais do Velo Beleza usando o ID da profissional na URL
  useEffect(() => {
    const carregarConfig = async () => {
      // Se a URL não tiver o ID (?pro=...), ele não busca nada e mostra os dados de demonstração
      if (!proId) return; 
      
      const config = await loyaltyService.getConfigSite(proId);
      if (config) {
        setSiteData(prev => ({
          ...prev,
          nome: config.nome || prev.nome,
          slogan: config.slogan || prev.slogan,
          logo: config.logo || prev.logo,
          videoReels: config.video || prev.videoReels,
          cnpj: config.cnpj || prev.cnpj
        }));
      }
    };
    carregarConfig();
  }, []);

  // 1. DADOS ESTRUTURADOS (SEO GOOGLE)
  // Isto é lido de forma invisível pelo Google para indexar o negócio localmente
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": siteData.nome,
    "image": siteData.logo,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São José",
      "addressRegion": "SC",
      "addressCountry": "BR"
    },
    "telephone": siteData.telefoneContato,
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#FFC5D3] selection:text-black">
      {/* Injeção do SEO via JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* HERO SECTION - EFEITO REELS */}
      <section className="relative h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden rounded-b-[3rem] shadow-2xl shadow-[#FFC5D3]/10">
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-40 scale-105"
            src={siteData.videoReels}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center px-6 mt-20"
        >
          {/* Espaço para Logomarca caso tenha, senão usa texto */}
          <div className="w-24 h-24 mb-6 rounded-full border-2 border-[#FFC5D3] p-1 overflow-hidden bg-black flex items-center justify-center">
             <img src={siteData.logo} alt="Logo" className="w-16 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
             <span className="text-[#FFC5D3] font-black text-xs uppercase absolute -z-10">Logo</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            {siteData.nome}
          </h1>
          <p className="text-[#FFC5D3] text-sm md:text-base tracking-[0.2em] uppercase font-bold max-w-sm mb-10">
            {siteData.slogan}
          </p>

          <a 
            href={`https://wa.me/${siteData.telefoneContato}?text=Olá! Gostaria de agendar um horário.`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#FFC5D3] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,197,211,0.3)]"
          >
            <Calendar size={16} />
            Agendar Horário
          </a>
        </motion.div>
      </section>

      {/* PAINEL DE ACESSO RÁPIDO (Fidelidade e Anamnese) */}
      <section className="px-6 py-12 -mt-10 relative z-20 max-w-lg mx-auto flex flex-col gap-4">
        <a 
          href="/fidelidade"
          className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl flex items-center justify-between hover:border-[#FFC5D3] transition-colors group shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Star size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm">Clube de Fidelidade</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Consulta os teus pontos</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-600 group-hover:text-[#FFC5D3] transition-colors" />
        </a>

        <a 
          href="/anamnese?tipo=cilios"
          className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl flex items-center justify-between hover:border-[#FFC5D3] transition-colors group shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
              <MessageCircle size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm">Ficha de Saúde</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Preenche antes da sessão</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
        </a>
      </section>

      {/* SEÇÃO DE SERVIÇOS */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[1px] flex-1 bg-zinc-800" />
          <h2 className="text-[#FFC5D3] text-xs font-black uppercase tracking-[0.3em]">Serviços</h2>
          <div className="h-[1px] flex-1 bg-zinc-800" />
        </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteData.servicos.map((servico) => (
            <div key={servico.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col items-center text-center hover:border-zinc-800 transition-colors">
              <h3 className="font-bold text-lg mb-2">{servico.nome}</h3>
              <p className="text-[#FFC5D3] font-mono">{servico.preco}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AVALIAÇÕES & FAQ */}
      <section className="px-6 py-12 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Avaliações */}
          <div>
            <h2 className="text-[#FFC5D3] text-xs font-black uppercase tracking-[0.3em] mb-6">O que dizem</h2>
            <div className="space-y-4">
                <div className="bg-black border border-zinc-800 p-5 rounded-2xl">
                  <div className="flex text-yellow-500 mb-2"><Star size={12}/><Star size={12}/><Star size={12}/><Star size={12}/><Star size={12}/></div>
                  <p className="text-sm text-zinc-300 italic mb-2">"O melhor lifting que já fiz! Durou horrores."</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">— Juliana A.</p>
                </div>
                <div className="bg-black border border-zinc-800 p-5 rounded-2xl">
                  <div className="flex text-yellow-500 mb-2"><Star size={12}/><Star size={12}/><Star size={12}/><Star size={12}/><Star size={12}/></div>
                  <p className="text-sm text-zinc-300 italic mb-2">"Ambiente incrível e atendimento impecável."</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">— Marcos S.</p>
                </div>
            </div>
          </div>
          {/* FAQ */}
          <div>
            <h2 className="text-[#FFC5D3] text-xs font-black uppercase tracking-[0.3em] mb-6">Dúvidas Frequentes</h2>
            <div className="space-y-4">
                <div className="bg-black border border-zinc-800 p-5 rounded-2xl">
                  <h4 className="font-bold text-sm mb-2 text-white flex items-center gap-2">Quanto tempo dura?</h4>
                  <p className="text-xs text-zinc-400 pl-2">Em média 20 a 30 dias, dependendo dos cuidados em casa.</p>
                </div>
                <div className="bg-black border border-zinc-800 p-5 rounded-2xl">
                  <h4 className="font-bold text-sm mb-2 text-white flex items-center gap-2">Dói para fazer?</h4>
                  <p className="text-xs text-zinc-400 pl-2">Não! É totalmente indolor, muitas clientes até dormem.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ & DADOS DA EMPRESA */}
      <footer className="border-t border-zinc-900 bg-black pt-12 pb-24 px-6 text-center">
        <div className="flex justify-center items-center gap-2 text-zinc-500 text-xs mb-6">
          <MapPin size={14} />
          {siteData.endereco}
        </div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">CNPJ: {siteData.cnpj}</p>
        <p className="text-[10px] text-zinc-600">© {new Date().getFullYear()} {siteData.nome}. Todos os direitos reservados.</p>
        
        <div className="mt-12 inline-block px-4 py-2 rounded-full border border-zinc-900 bg-zinc-950">
           <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Powered by Velo Beleza</p>
        </div>
      </footer>

      {/* BOTÃO FIXO WHATSAPP */}
      <a 
        href={`https://wa.me/${siteData.telefoneContato}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={28} className="text-black" />
      </a>
    </div>
  );
}