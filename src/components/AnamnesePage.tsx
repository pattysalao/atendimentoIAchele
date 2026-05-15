import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { anamneseData } from '../types';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export default function AnamnesePage() {
  const searchParams = new URLSearchParams(window.location.search);
  const clienteId = searchParams.get('clienteId');
  const tipo = searchParams.get('tipo');

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ficha = tipo ? anamneseData[tipo as keyof typeof anamneseData] : null;

  useEffect(() => {
    if (!clienteId || !tipo || !ficha) {
      setError('Link inválido. Certifique-se de que o clienteId e o tipo estão presentes na URL.');
    }
  }, [clienteId, tipo, ficha]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    if (ficha && currentStep < ficha.perguntas.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 300);
    }
  };

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {},
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError('Erro ao salvar as informações. Por favor, tente novamente.');
  };

  const handleSubmit = async () => {
    if (!ficha || !clienteId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        clienteId,
        tipo,
        titulo: ficha.titulo,
        respostas: answers,
        data_preenchimento: serverTimestamp(),
      };

      await addDoc(collection(db, 'fichas_anamnese'), payload);
      
      setIsFinished(true);
      
      setTimeout(() => {
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "5500000000000";
        window.location.href = `https://wa.me/${whatsappNumber}`;
      }, 2000);

    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'fichas_anamnese');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-800 max-w-sm w-full text-center">
          <AlertCircle className="w-12 h-12 text-[#FFC5D3] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-800 max-w-sm w-full text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-[#FFC5D3] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ficha Concluída!</h2>
          <p className="text-zinc-400 mb-4">Suas respostas foram salvas com sucesso. Você será redirecionado para o WhatsApp em instantes.</p>
          <Loader2 className="w-6 h-6 text-[#FFC5D3] animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (!ficha) return null;

  const currentQuestion = ficha.perguntas[currentStep];
  const progress = ((currentStep + 1) / ficha.perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center font-sans max-w-md mx-auto relative overflow-hidden">
      
      {/* Header com Logo */}
      <div className="w-full pt-10 pb-6 px-6 text-center flex flex-col items-center">
        <img src="/logo.png" alt="Logo Studio" className="w-32 h-auto mb-4 object-contain" />
        <div className="text-[10px] uppercase tracking-[0.15em] text-[#FFC5D3] mb-1 font-bold">
          Studio Estética Avançada
        </div>
        <h1 className="text-[22px] font-extrabold text-white tracking-tight">
          Anamnese: {ficha.titulo}
        </h1>
      </div>

      {/* Progress Section */}
      <div className="w-full px-6 mb-8">
        <div className="bg-zinc-800 h-[6px] w-full rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-[#FFC5D3] h-full rounded-full transition-all duration-500"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">
            Pergunta {currentStep + 1} de {ficha.perguntas.length}
          </span>
          <span className="text-[11px] font-bold text-[#FFC5D3]">
            {Math.round(progress)}% concluído
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[24px] shadow-sm mb-8 text-center min-h-[140px] flex items-center justify-center">
              <h2 className="text-lg font-medium text-white leading-[1.4] max-w-[280px]">
                {currentQuestion.texto}
              </h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(currentQuestion.id, 'Sim')}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl border-2 transition-all duration-200 text-center font-bold text-lg",
                  answers[currentQuestion.id] === 'Sim' 
                    ? "bg-[#FFC5D3] border-[#FFC5D3] text-black" 
                    : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                )}
              >
                Sim
              </button>

              <button
                onClick={() => handleAnswer(currentQuestion.id, 'Não')}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl border-2 transition-all duration-200 text-center font-bold text-lg",
                  answers[currentQuestion.id] === 'Não' 
                    ? "bg-[#FFC5D3] border-[#FFC5D3] text-black" 
                    : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                )}
              >
                Não
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="w-full p-6 mt-auto bg-black border-t border-zinc-900 flex flex-col items-center">
        {currentStep === ficha.perguntas.length - 1 && Object.keys(answers).length === ficha.perguntas.length ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#FFC5D3] text-black font-extrabold py-5 px-6 rounded-2xl shadow-lg shadow-[#FFC5D3]/20 flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none uppercase tracking-wider text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Finalizar Ficha
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </motion.button>
        ) : (
            <div className="h-[60px] flex items-center justify-center">
                {currentStep > 0 && (
                    <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-zinc-300 transition-colors"
                    >
                    ← Voltar anterior
                    </button>
                )}
            </div>
        )}
        
        <div className="mt-4 text-[10px] text-zinc-500 font-medium">
          ID do Cliente: #{clienteId}
        </div>
      </div>
    </div>
  );
}