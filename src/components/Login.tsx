import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loyaltyService } from '../lib/loyaltyService';
import { Sparkles, ShieldCheck, Star } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  // A mesma função serve para Cadastrar e para Logar usando o Google
  const handleAuth = async () => {
    setIsLoading(true);
    await loyaltyService.loginComGoogle();
    // O redirecionamento para o /admin acontece sozinho pelo App.tsx ouvindo o Firebase
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex text-white font-sans selection:bg-pink-500 selection:text-black">
      
      {/* LADO ESQUERDO - Banner Velo Beleza (Visível apenas no PC) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 border-r border-zinc-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Efeito de brilho no fundo */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-black text-black text-xs italic">V</div>
            <span className="font-black text-xl tracking-tighter uppercase">Velo <span className="text-pink-500">Beleza</span></span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black tracking-tighter mb-6 leading-tight">
            A plataforma completa para <br/>
            <span className="text-pink-500 italic">profissionais da estética.</span>
          </h1>
          
          <ul className="space-y-4 text-zinc-400">
            <li className="flex items-center gap-3"><Star size={18} className="text-pink-500" /> Site Premium com SEO Otimizado</li>
            <li className="flex items-center gap-3"><Star size={18} className="text-pink-500" /> Clube de Fidelidade Automático</li>
            <li className="flex items-center gap-3"><Star size={18} className="text-pink-500" /> Fichas de Anamnese Digitais</li>
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 w-max">
          <ShieldCheck className="text-green-400" size={24} />
          <div>
            <p className="text-xs font-bold text-white">Segurança Google Cloud</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Criptografia de ponta a ponta</p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO - Área de Login/Cadastro */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-[#0a0a0a]">
        {/* Logo Mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-black text-black text-xs italic">V</div>
          <span className="font-black text-xl tracking-tighter uppercase">Velo <span className="text-pink-500">Beleza</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-[2rem] shadow-2xl"
        >
          <div className="text-center mb-8">
            <Sparkles className="mx-auto text-pink-500 mb-4" size={32} />
            <h2 className="text-2xl font-black mb-2">Seu Novo Studio</h2>
            <p className="text-zinc-400 text-sm">Crie sua conta ou faça login para acessar o painel de gestão.</p>
          </div>

          <div className="space-y-4">
            {/* BOTÃO CADASTRAR */}
            <button 
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-lg"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5" alt="Google" />
              {isLoading ? 'Autenticando...' : 'Criar minha conta com Google'}
            </button>
            
            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-zinc-800"></div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">ou já tem conta?</span>
              <div className="h-[1px] flex-1 bg-zinc-800"></div>
            </div>

            {/* BOTÃO LOGIN */}
            <button 
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-transparent border border-zinc-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5" alt="Google" />
              {isLoading ? 'Acessando...' : 'Fazer Login com Google'}
            </button>
          </div>
          
          <p className="mt-8 text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
            Ao entrar, você concorda com os <br/>Termos de Uso do Ecossistema Velo.
          </p>
        </motion.div>
      </div>

    </div>
  );
}