import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface LockedOverlayProps {
  onUnlock: () => void;
  message?: string;
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({ 
  onUnlock, 
  message = "Conteúdo disponível na versão completa" 
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl" />
      
      {/* Content */}
      <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl text-center space-y-6 max-w-[280px]">
        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 leading-tight">
            {message}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            Assine o plano PLUS ou PREMIUM para acessar este recurso.
          </p>
        </div>

        <button
          onClick={onUnlock}
          className="w-full py-4 bg-orange-400 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Crown className="w-4 h-4" />
          Desbloquear
        </button>
      </div>
    </div>
  );
};
