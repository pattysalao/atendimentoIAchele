import { motion } from 'framer-motion';
import { Star, Layout, Zap, ArrowRight } from 'lucide-react';

export default function VeloBelezaHome() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500 selection:text-black">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-black text-black text-xs italic">V</div>
          <span className="font-black text-xl tracking-tighter uppercase">Velo <span className="text-pink-500">Beleza</span></span>
        </div>
        <div className="flex gap-4">
          <a href="/admin" className="text-xs font-bold uppercase tracking-widest py-2 px-6 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all">Login</a>
        </div>
      </nav>

      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Ecossistema Velo Delivery</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
            A evolução da sua <br/> <span className="text-zinc-500 italic font-light">Clínica de Estética.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-12 leading-relaxed">
            Fidelize as suas clientes, organize a sua gestão e tenha um mini-site de luxo indexado no Google.
          </p>
          <div className="flex justify-center">
            <a href="/admin" className="bg-pink-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_40px_rgba(236,72,153,0.3)]">
              Começar Agora <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}