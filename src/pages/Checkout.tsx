import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  ChevronRight,
  Lock
} from 'lucide-react';

interface CheckoutPageProps {
  plan: 'plus' | 'premium';
  onBack: () => void;
  onConfirm: (method: 'card' | 'pix') => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, onBack, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  const planDetails = {
    plus: { name: 'Plano PLUS', price: 'R$ 9,90/mês' },
    premium: { name: 'Plano PREMIUM', price: 'R$ 39,90/mês' }
  };

  const details = planDetails[plan];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden">
      <header className="bg-white p-6 border-b border-slate-100 flex items-center sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight ml-2">Confirmar Assinatura</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            Quase lá!
          </h2>
          <p className="text-slate-500 font-medium">
            Você está prestes a desbloquear todos os recursos do app.
          </p>
        </div>

        {/* Resumo do Plano */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Plano Selecionado</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${plan === 'premium' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
              {plan}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-black text-slate-900">{details.name}</h3>
              <p className="text-sm text-slate-500 font-medium">Acesso total aos recursos</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{details.price}</span>
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Forma de Pagamento</h3>
          
          <button 
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'border-orange-400 bg-orange-50/30' : 'border-slate-100 bg-white'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <p className="font-black text-slate-900">Cartão de Crédito</p>
              <p className="text-xs font-medium text-slate-500">Cobrança automática mensal</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-orange-400' : 'border-slate-200'}`}>
              {paymentMethod === 'card' && <div className="w-3 h-3 bg-orange-400 rounded-full" />}
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('pix')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'pix' ? 'border-orange-400 bg-orange-50/30' : 'border-slate-100 bg-white'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'pix' ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <QrCode className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <p className="font-black text-slate-900">Pix</p>
              <p className="text-xs font-medium text-slate-500">Confirmação imediata</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pix' ? 'border-orange-400' : 'border-slate-200'}`}>
              {paymentMethod === 'pix' && <div className="w-3 h-3 bg-orange-400 rounded-full" />}
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl">
          <Lock className="w-4 h-4 text-slate-400" />
          <p className="text-[10px] font-bold text-slate-500 leading-tight">
            Seus dados estão seguros. Utilizamos criptografia de ponta para processar sua assinatura.
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 space-y-3">
        <button 
          onClick={() => onConfirm(paymentMethod)}
          className="w-full py-4 bg-orange-400 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all"
        >
          Confirmar Assinatura
        </button>
        <button 
          onClick={onBack}
          className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
