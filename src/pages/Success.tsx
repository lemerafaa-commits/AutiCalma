import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, PartyPopper, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  onFinish: () => void;
  plan: 'plus' | 'premium';
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onFinish, plan }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="w-8 h-8 text-amber-400" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-2 -left-4"
          >
            <PartyPopper className="w-8 h-8 text-orange-400" />
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Assinatura Ativada!
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Parabéns! Agora você tem acesso completo aos recursos do plano <span className="text-orange-500 font-black uppercase">{plan}</span>.
          </p>
        </div>

        <div className="w-full bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 space-y-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-900">Recursos Desbloqueados</p>
              <p className="text-xs font-medium text-slate-500">Aproveite todo o potencial do app</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button 
          onClick={onFinish}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Começar a usar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
