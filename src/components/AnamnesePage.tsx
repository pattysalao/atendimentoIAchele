import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get('clienteId');
  const tipo = searchParams.get('tipo');

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ficha = tipo ? anamneseData[tipo] : null;

  useEffect(() => {
    if (!clienteId || !tipo || !ficha) {
      setError('Link inválido. Certifique-se de que o clienteId e o tipo estão presentes na URL.');
    }
  }, [clienteId, tipo, ficha]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    // Auto-advance if not the last question
    if (ficha && currentStep < ficha.perguntas.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 300);
    }
  };

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {}, // Simplified for this context
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError('Erro ao salvar as informações. Por favor, tente novamente.');
    throw new Error(JSON.stringify(errInfo));
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
      
      // Redirect back to Wteste  hatsApp after a short delay
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-slate-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ficha Concluída!</h2>
          <p className="text-slate-600 mb-4">Suas respostas foram salvas com sucesso. Você será redirecionado para o WhatsApp em instantes.</p>
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (!ficha) return null;

  const currentQuestion = ficha.perguntas[currentStep];
  const progress = ((currentStep + 1) / ficha.perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-frosted-gradient flex flex-col items-center font-sans max-w-md mx-auto relative overflow-hidden">
      {/* Background purely for decorative purposes to match the 'viewport' feel if needed, 
          but usually the container itself is enough in this sandboxed environment. */}
      
      {/* Header */}
      <div className="w-full pt-10 pb-6 px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1 font-bold">
          Studio Estética Avançada
        </div>
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
          Anamnese: {ficha.titulo}
        </h1>
      </div>

      {/* Progress Section */}
      <div className="w-full px-6 mb-8">
        <div className="bg-slate-200 h-[6px] w-full rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Pergunta {currentStep + 1} de {ficha.perguntas.length}
          </span>
          <span className="text-[11px] font-bold text-emerald-600">
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
            <div className="glass p-8 rounded-[24px] shadow-sm mb-8 text-center min-h-[140px] flex items-center justify-center">
              <h2 className="text-lg font-medium text-slate-800 leading-[1.4] max-w-[280px]">
                {currentQuestion.texto}
              </h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(currentQuestion.id, 'Sim')}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl border-2 transition-all duration-200 text-center font-bold text-lg",
                  answers[currentQuestion.id] === 'Sim' 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                    : "bg-white/80 border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-white"
                )}
              >
                Sim
              </button>

              <button
                onClick={() => handleAnswer(currentQuestion.id, 'Não')}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl border-2 transition-all duration-200 text-center font-bold text-lg",
                  answers[currentQuestion.id] === 'Não' 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                    : "bg-white/80 border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-white"
                )}
              >
                Não
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="w-full p-6 mt-auto bg-white border-t border-slate-100 flex flex-col items-center">
        {currentStep === ficha.perguntas.length - 1 && Object.keys(answers).length === ficha.perguntas.length ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-emerald-500 text-white font-bold py-5 px-6 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none uppercase tracking-wider text-sm"
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
                    className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                    ← Voltar anterior
                    </button>
                )}
            </div>
        )}
        
        <div className="mt-4 text-[10px] text-slate-400 font-medium">
          ID do Cliente: #{clienteId}
        </div>
      </div>
    </div>
  );
}
