import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PlanProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  isActive?: boolean;
  onSelect: () => void;
  buttonText: string;
  icon: React.ReactNode;
  color: string;
  buttonColor?: string;
}

const PlanCard: React.FC<PlanProps> = ({ 
  title, 
  price, 
  features, 
  isPopular, 
  isRecommended,
  isActive,
  onSelect, 
  buttonText, 
  icon,
  color,
  buttonColor
}) => (
  <div className={`relative p-6 rounded-3xl border-2 transition-all ${
    isActive 
      ? 'border-emerald-400 bg-emerald-50/30' 
      : isRecommended
        ? 'border-indigo-600 bg-indigo-50/10 shadow-2xl shadow-indigo-100 scale-[1.02] z-10'
        : isPopular 
          ? 'border-orange-400 bg-white shadow-xl shadow-orange-100 scale-105 z-10' 
          : 'border-slate-100 bg-white shadow-sm'
  }`}>
    {isActive && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
        <Check className="w-3 h-3" />
        Plano Atual
      </div>
    )}
    {isRecommended && !isActive && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-indigo-200">
        Recomendado
      </div>
    )}
    {isPopular && !isActive && !isRecommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Mais Escolhido
      </div>
    )}
    
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{price}</p>
      </div>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={`${title}-${i}`} className="flex items-start gap-3 text-sm font-medium text-slate-600">
          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>

    <button
      onClick={onSelect}
      disabled={isActive}
      className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-md ${
        isActive
          ? 'bg-emerald-100 text-emerald-600 cursor-default shadow-none'
          : buttonColor || 'bg-slate-50 text-slate-600 hover:bg-slate-100'
      }`}
    >
      {isActive ? 'Plano Ativo' : buttonText}
    </button>
  </div>
);

export const PlansPage: React.FC<{ 
  onBack: () => void; 
  onContinueFree: () => void; 
  onUpgrade: (plan: 'plus' | 'premium') => void;
  onSelectPlan: (plan: 'plus' | 'premium') => void;
  userPlan: 'free' | 'plus' | 'premium';
}> = ({ onBack, onContinueFree, onUpgrade, onSelectPlan, userPlan }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden">
      <header className="bg-white p-6 border-b border-slate-100 flex items-center sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight ml-2">Planos</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            Desbloqueie todo o potencial do app
          </h2>
          <p className="text-slate-500 font-medium">
            Mais controle, mais apoio, mais tranquilidade
          </p>
        </div>

        <div className="space-y-8 pt-4">
          <PlanCard 
            title="GRÁTIS"
            price="Gratuito para sempre"
            isActive={userPlan === 'free'}
            features={[
              "Acesso básico",
              "Modo crise (versão atual)",
              "Conteúdo limitado"
            ]}
            onSelect={onContinueFree}
            buttonText="Continuar grátis"
            icon={<Shield className="w-5 h-5 text-slate-400" />}
            color="bg-slate-50"
          />

          <PlanCard 
            title="PLUS"
            price="R$ 9,90 / mês"
            isActive={userPlan === 'plus'}
            isPopular
            features={[
              "Perfil da criança",
              "Histórico de crises",
              "Conteúdo completo",
              "Favoritos"
            ]}
            onSelect={() => onSelectPlan('plus')}
            buttonText="Desbloquear agora"
            icon={<Star className="w-5 h-5 text-orange-500" />}
            color="bg-orange-50"
            buttonColor="bg-orange-400 text-white hover:bg-orange-500 shadow-orange-200"
          />

          <PlanCard 
            title="PREMIUM"
            price="R$ 39,90 / mês"
            isActive={userPlan === 'premium'}
            isRecommended
            features={[
              "Tudo do PLUS",
              "Assistente inteligente (IA)",
              "Sugestões personalizadas",
              "Insights automáticos"
            ]}
            onSelect={() => onSelectPlan('premium')}
            buttonText="Desbloquear agora"
            icon={<Crown className="w-5 h-5 text-indigo-500" />}
            color="bg-indigo-50"
            buttonColor="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200"
          />
        </div>

        <div className="pt-8 text-center space-y-6 pb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Shield className="w-3 h-3 text-blue-500" />
              Cancele quando quiser
            </p>
            <p className="text-xs font-medium text-slate-400">
              Sem compromisso. Comece a usar em segundos.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mx-auto max-w-[280px]">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={`star-${i}`} className="w-3 h-3 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-600 leading-snug italic">
              "Me ajudou a manter a calma na hora da crise e deu mais segurança para meu filho."
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-2">
              — Mariane, mãe do Theo
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 opacity-30">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <Zap className="w-5 h-5 text-orange-500" />
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
