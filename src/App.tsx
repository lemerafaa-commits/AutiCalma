/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Users, 
  MessageCircle, 
  ChevronRight, 
  ArrowLeft, 
  Info,
  CheckCircle2,
  XCircle,
  Heart,
  Search,
  X,
  Zap,
  Clock,
  Timer,
  Waves,
  LayoutDashboard,
  LogOut,
  User,
  Pause,
  Play,
  Home,
  Crown,
  Star,
  Activity,
  Calendar,
  TrendingUp,
  BarChart3,
  Trash2
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { ProfilePage } from './pages/Profile';
import { PlansPage } from './pages/Plans';
import { CheckoutPage } from './pages/Checkout';
import { SuccessPage } from './pages/Success';
import { LockedOverlay } from './components/LockedOverlay';
import { Assistant } from './components/Assistant';

/// --- Types & Data ---
import { 
  CategoryId, 
  Situation, 
  EmergencySituation, 
  CrisisLog, 
  CrisisHistoryEvent, 
  CrisisLevel, 
  Category 
} from './types';

import { 
  CRISIS_LEVEL_MAP, 
  EMERGENCY_DATA, 
  APP_DATA 
} from './constants';

// --- Components ---
import { useCrisisManager } from './hooks/useCrisisManager';

import { formatTime, getCrisisMessage } from './lib/utils';

const Layout = ({ 
  children, 
  title, 
  onBack, 
  bgClass = "bg-slate-50",
  headerTextClass = "text-slate-900",
  heartBgClass = "bg-slate-100",
  heartIconClass = "text-slate-300"
}: { 
  children: React.ReactNode, 
  title?: string, 
  onBack?: () => void,
  bgClass?: string,
  headerTextClass?: string,
  heartBgClass?: string,
  heartIconClass?: string
}) => (
  <div className={`min-h-screen ${bgClass} font-sans text-slate-800 flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden transition-colors duration-500`}>
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-3 sticky top-0 z-10 flex items-center gap-3">
      <div className="flex items-center gap-3 flex-1">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className={`w-5 h-5 ${headerTextClass}`} />
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0">
            <Waves className="w-full h-full text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-bold ${headerTextClass} tracking-tight`}>AutiCalma</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Beta</span>
          </div>
        </div>

        {title && onBack && (
          <div className="h-4 w-px bg-slate-200 mx-1" />
        )}
        
        {title && onBack && (
          <h1 className={`text-xs font-bold ${headerTextClass} opacity-60 truncate max-w-[120px]`}>
            {title}
          </h1>
        )}
      </div>
      
      <div className={`w-8 h-8 ${heartBgClass} rounded-full flex items-center justify-center transition-colors shrink-0`}>
        <Heart className={`w-4 h-4 ${heartIconClass}`} />
      </div>
    </header>
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
    <footer className="p-8 bg-white/50 border-t border-slate-100 text-center">
      <p className="text-[9px] text-slate-300 uppercase tracking-[0.25em] font-bold">
        Orientações educativas • Não substitui profissionais
      </p>
    </footer>
  </div>
);

const CRISIS_CLASSIFICATION_OPTIONS = [
  "Crise sensorial",
  "Autoagressão",
  "Gritos ou choro intenso",
  "Crise em local público",
  "Outro / Não especificado"
];

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

// MODO TESTE ATIVO
// Todos os usuários estão com plano premium liberado
// REMOVER isso antes de produção real
const isTestMode = true;

function MainApp() {
  const { user, loading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'list' | 'detail' | 'emergency' | 'emergencyDetail' | 'diary' | 'dashboard' | 'auth' | 'profile' | 'plans' | 'checkout' | 'success'>('home');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<'plus' | 'premium' | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencySituation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [finalCrisisType, setFinalCrisisType] = useState<string | null>(null);
  const [crisisObservation, setCrisisObservation] = useState('');
  const [crisisOrigin, setCrisisOrigin] = useState<'crisis' | 'info' | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const {
    elapsedTime,
    isTimerRunning,
    setIsTimerRunning,
    crisisLevel,
    setCrisisLevel,
    initialCrisisLevel,
    setInitialCrisisLevel,
    hospitalClicked,
    setHospitalClicked,
    feedbackAjudou,
    setFeedbackAjudou,
    hasEndedCrisis,
    lastCrisisDuration,
    crisisHistory,
    endCrisis,
    registrarEventoCrise,
    sairDaCrise,
    iniciarCrise,
    resetCrisisState,
    clearHistory
  } = useCrisisManager(user?.uid, setCurrentScreen);
  const [userPlan, setUserPlan] = useState<'free' | 'plus' | 'premium'>(() => {
    if (isTestMode) return 'premium';
    const saved = localStorage.getItem('auticalma_userPlan');
    if (saved === 'plus' || saved === 'premium') return saved;
    return 'free';
  });

  const isPro = userPlan !== 'free';

  const finalizarCrise = useCallback(() => {
    endCrisis();
    setCurrentScreen('emergency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [endCrisis, setCurrentScreen]);

  const concluirRegistroEVoltar = useCallback(() => {
    const tipo = finalCrisisType || 'Não especificado';
    registrarEventoCrise(tipo, crisisObservation);

    sairDaCrise();
    setSelectedCategory(null);
    setSelectedSituation(null);
    setSelectedEmergency(null);
    setSearchTerm('');
    setFinalCrisisType(null);
    setCrisisObservation('');
    setCrisisOrigin(null);
  }, [registrarEventoCrise, lastCrisisDuration, sairDaCrise, finalCrisisType, crisisObservation, setSelectedCategory, setSelectedSituation, setSelectedEmergency, setSearchTerm]);

  const voltarAoInicio = useCallback(() => {
    // Apenas navega para home e reseta estados de navegação, Sem parar timer ou mostrar resumo
    setFeedbackAjudou(null);
    setSelectedCategory(null);
    setSelectedSituation(null);
    setSelectedEmergency(null);
    setSearchTerm('');
    setCurrentScreen('home');
    setCrisisOrigin(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentScreen, setFeedbackAjudou]);

  const goHomeSafe = useCallback(() => {
    // Repurposed to just voltarAoInicio as requested (Nav buttons shouldn't trigger summary)
    voltarAoInicio();
  }, [voltarAoInicio]);

  const iniciarCriseEmergencia = () => {
    resetCrisisState(); // Start fresh
    iniciarCrise('emergencia');
    setCurrentScreen('emergency');
    setCrisisOrigin('crisis');
  };

  const goBack = () => {
    if (currentScreen === 'detail') setCurrentScreen('list');
    else if (currentScreen === 'list') voltarAoInicio();
    else if (currentScreen === 'emergency') voltarAoInicio();
    else if (currentScreen === 'emergencyDetail') setCurrentScreen('emergency');
    else if (currentScreen === 'diary') voltarAoInicio();
    else if (currentScreen === 'profile') voltarAoInicio();
    else if (currentScreen === 'plans') voltarAoInicio();
  };

  useEffect(() => {
    localStorage.setItem('auticalma_userPlan', userPlan);
  }, [userPlan]);

  // Auto-start timer when entering emergency screen
  useEffect(() => {
    if (currentScreen === 'emergency' && !isTimerRunning && elapsedTime === 0 && !lastCrisisDuration && !hasEndedCrisis) {
      setIsTimerRunning(true);
    }
  }, [currentScreen, isTimerRunning, elapsedTime, lastCrisisDuration, hasEndedCrisis]);

  // Reset scroll on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen, selectedSituation, selectedEmergency]);

  // Reset feedback when switching content
  useEffect(() => {
    setFeedbackAjudou(null);
  }, [selectedSituation, selectedEmergency, setFeedbackAjudou]);

  // Protected and Redirect Route Logic
  useEffect(() => {
    if (loading) return;

    if (!user) {
      // If not logged in, protect 'dashboard' and 'profile'
      if (currentScreen === 'dashboard' || currentScreen === 'profile') {
        setCurrentScreen('auth');
        setAuthMode('login');
      }
    } else {
      // If logged in, don't allow 'auth'
      if (currentScreen === 'auth') {
        setCurrentScreen(user.role === 'admin' ? 'dashboard' : 'home');
      }
      
      // If logged in as user, don't allow 'dashboard'
      if (currentScreen === 'dashboard' && user.role !== 'admin') {
        setCurrentScreen('home');
      }
    }
  }, [user, loading, currentScreen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (currentScreen === 'dashboard' && user) {
    return <DashboardPage onBack={goHomeSafe} />;
  }

  if (currentScreen === 'profile' && user) {
    return <ProfilePage onBack={goHomeSafe} userPlan={userPlan} onUnlock={() => setCurrentScreen('plans')} />;
  }

  if (currentScreen === 'plans') {
    return (
      <PlansPage 
        onBack={goHomeSafe} 
        onContinueFree={goHomeSafe}
        userPlan={userPlan}
        onUpgrade={(plan) => {
          setUserPlan(plan);
        }}
        onSelectPlan={(plan) => {
          setSelectedPlanForCheckout(plan);
          setCurrentScreen('checkout');
        }}
      />
    );
  }

  if (currentScreen === 'checkout' && selectedPlanForCheckout) {
    return (
      <CheckoutPage 
        plan={selectedPlanForCheckout}
        onBack={() => setCurrentScreen('plans')}
        onConfirm={(method) => {
          setUserPlan(selectedPlanForCheckout);
          setCurrentScreen('success');
        }}
      />
    );
  }

  if (currentScreen === 'success' && selectedPlanForCheckout) {
    return (
      <SuccessPage 
        plan={selectedPlanForCheckout}
        onFinish={() => {
          goHomeSafe();
          setSelectedPlanForCheckout(null);
        }}
      />
    );
  }

  if (currentScreen === 'auth' && !user) {
    return authMode === 'login' ? (
      <LoginPage 
        onSwitch={() => {
          setAuthMode('register');
          setAuthMessage('');
        }} 
        onSuccess={() => {
          // Redirection is handled by the useEffect above
        }} 
        onBack={voltarAoInicio}
        initialMessage={authMessage}
      />
    ) : (
      <RegisterPage 
        onSwitch={() => {
          setAuthMode('login');
          setAuthMessage('');
        }} 
        onSuccess={() => {
          setAuthMessage('Conta criada com sucesso. Faça login para continuar.');
          setAuthMode('login');
          setCurrentScreen('auth');
        }} 
        onBack={voltarAoInicio}
      />
    );
  }

  const allSituations = (Object.keys(APP_DATA) as CategoryId[]).flatMap(catId => 
    APP_DATA[catId].situations.map(sit => ({ ...sit, categoryId: catId }))
  );

  const filteredResults = searchTerm.trim() === '' 
    ? [] 
    : allSituations.filter(sit => 
        sit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sit.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sit.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCurrentScreen('list');
    setSearchTerm('');
    setCrisisOrigin('info');
  };

  const handleSituationSelect = (situation: Situation, catId?: CategoryId) => {
    const categoryId = catId || selectedCategory;
    
    // Only start timer logic IF we are already in crisis flow (e.g. from Emergency button)
    if (crisisOrigin === 'crisis') {
      iniciarCrise(situation.id, categoryId || undefined);
    } else {
      setCrisisOrigin('info');
    }
    
    if (categoryId) setSelectedCategory(categoryId);
    setSelectedSituation(situation);
    
    setCurrentScreen('detail');
    setSearchTerm('');
  };

  const currentCrisisType = selectedSituation?.title || selectedEmergency?.title || (currentScreen === 'emergency' ? 'Emergência' : 'Desconhecido');

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Layout>
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Olá, {user ? user.name.split(' ')[0] : 'Pai/Mãe'}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-slate-500 text-lg font-medium">
                    Como posso ajudar hoje?
                  </p>
                  {userPlan !== 'free' && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      userPlan === 'premium' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {userPlan}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  onClick={() => setCurrentScreen('plans')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="p-3 bg-amber-100 border border-amber-200 rounded-2xl text-amber-600 shadow-lg shadow-amber-100/50 relative group transition-colors hover:bg-amber-200"
                  title="Desbloquear versão completa"
                >
                  <Crown className="w-5 h-5 fill-current" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                  
                  {/* Tooltip hint for desktop */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                    Desbloquear versão completa
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>
                </motion.button>
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => setCurrentScreen('dashboard')}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 transition-colors shadow-sm"
                        title="Dashboard Admin"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setCurrentScreen('profile')}
                      className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 transition-colors shadow-sm"
                      title="Meu Perfil"
                    >
                      <User className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        resetCrisisState();
                        setCurrentScreen('auth');
                      }}
                      className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                      title="Sair"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setCurrentScreen('auth')}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 transition-colors shadow-sm"
                    title="Entrar / Criar conta"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative mb-12">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar situação..."
                className="block w-full pl-12 pr-10 py-5 bg-white border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100/50 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            <button
              onClick={iniciarCriseEmergencia}
              className="w-full mb-3 p-6 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl shadow-md shadow-orange-50 flex items-center justify-center gap-4 transition-all active:scale-[0.98] group"
            >
              <Zap className="w-6 h-6 fill-current" />
              <span className="text-xl font-bold">Meu filho está em crise agora</span>
            </button>

            {/* Social Proof Home */}
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <p className="text-[11px] font-bold text-slate-500 tracking-tight">
                Mais de 100 famílias confiam no AutiCalma hoje
              </p>
            </div>

            <button
              onClick={() => {
                // MVP TEST MODE
                // Histórico liberado sem login para validação
                // Reativar bloqueio por login antes da versão final
                setCurrentScreen('diary');
              }}
              className="w-full mb-10 p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] group text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-none mb-1">Ver histórico de crises</h3>
                  <p className="text-xs font-medium text-slate-400">Acompanhe padrões e evolução</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
            </button>

            <AnimatePresence>
              {searchTerm.trim() !== '' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 space-y-3 overflow-hidden"
                >
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Resultados da busca ({filteredResults.length})
                  </h3>
                  {filteredResults.length > 0 ? (
                    <div className="grid gap-2">
                      {filteredResults.map((result, idx) => (
                        <button
                          key={`${result.id}-${idx}`}
                          onClick={() => handleSituationSelect(result, result.categoryId)}
                          className="w-full text-left p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-amber-200 transition-all flex items-center justify-between group"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-stone-800 group-hover:text-amber-900">
                              {result.title}
                            </span>
                            <span className="text-[10px] uppercase tracking-tighter text-stone-400">
                              Em: {APP_DATA[result.categoryId].title}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-400" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400 italic p-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                      Nenhuma situação encontrada para "{searchTerm}"
                    </p>
                  )}
                  <div className="h-px bg-stone-100 w-full my-4" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4">
              {(Object.keys(APP_DATA) as CategoryId[]).map((key, idx) => {
                const cat = APP_DATA[key];
                const accentColor = key === 'crise' ? 'text-orange-500' : key === 'socializacao' ? 'text-violet-500' : 'text-emerald-500';
                const accentBg = key === 'crise' ? 'bg-orange-50' : key === 'socializacao' ? 'bg-violet-50' : 'bg-emerald-50';
                
                return (
                  <button
                    key={`${cat.id}-${idx}`}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left p-6 rounded-2xl border-l-4 transition-all active:scale-[0.98] flex items-center gap-5 ${cat.color} shadow-sm hover:shadow-md`}
                  >
                    <div className={`p-4 rounded-xl ${accentBg} ${accentColor} shrink-0`}>
                      {React.cloneElement(cat.icon as React.ReactElement, { className: "w-7 h-7" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{cat.title}</h3>
                      <p className="text-sm text-slate-500 leading-snug font-medium">
                        {cat.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                );
              })}
            </div>

            {/* Upgrade Banner - Moved to bottom and refined */}
            {userPlan !== 'premium' && (
              <button
                onClick={() => setCurrentScreen('plans')}
                className="w-full mt-10 p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl text-left relative overflow-hidden group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100/50 flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-slate-900 font-black text-sm tracking-tight">
                      Desbloqueie a IA personalizada
                    </h3>
                    <p className="text-slate-500 text-[11px] font-medium leading-tight">
                      Receba sugestões adaptadas ao seu filho
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-500 text-white font-bold text-[11px] px-4 py-2 rounded-xl shadow-sm shadow-orange-200 group-hover:bg-orange-600 transition-colors">
                    <span>Ver planos</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            )}

            <div className="mt-12 p-6 text-center">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Este guia foi criado para oferecer suporte imediato e empático em momentos de necessidade.
              </p>
            </div>
          </Layout>
        </motion.div>
      )}

      {currentScreen === 'list' && selectedCategory && (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Layout 
            title={APP_DATA[selectedCategory].title} 
            onBack={goBack}
            bgClass={APP_DATA[selectedCategory].bgClass}
            headerTextClass={APP_DATA[selectedCategory].headerTextClass}
            heartBgClass={APP_DATA[selectedCategory].heartBgClass}
            heartIconClass={APP_DATA[selectedCategory].heartIconClass}
          >
            <div className="space-y-4">
              <div className="mb-8">
                <p className="text-slate-500 font-medium text-lg">O que está acontecendo?</p>
                <p className="text-slate-400 text-xs font-medium">Selecione a opção que melhor descreve o momento</p>
              </div>
              <div className="grid gap-4">
                {APP_DATA[selectedCategory].situations.map((sit, idx) => {
                  const isSelected = selectedSituation?.id === sit.id;
                  const category = APP_DATA[selectedCategory];
                  
                  return (
                    <button
                      key={`${sit.id}-${idx}`}
                      onClick={() => {
                        // Feedback visual imediato
                        setSelectedSituation(sit);
                        // Delay para o usuário ver a seleção
                        setTimeout(() => {
                          handleSituationSelect(sit);
                        }, 200);
                      }}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm ${
                        isSelected 
                        ? `${category.color} border-current shadow-md` 
                        : 'bg-white border-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <span className={`text-lg font-bold block mb-1 ${isSelected ? category.itemHoverTextClass : 'text-slate-700'}`}>
                          {sit.title}
                        </span>
                        <span className={`text-xs font-medium line-clamp-1 ${isSelected ? 'opacity-70' : 'text-slate-400'}`}>
                          {sit.explanation}
                        </span>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${category.actionBtnBgClass} shadow-sm`}>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <ChevronRight className={`w-5 h-5 text-slate-200 group-hover:text-slate-400`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-8 pb-4">
                <button
                  onClick={voltarAoInicio}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Voltar ao início
                </button>
              </div>
            </div>
          </Layout>
        </motion.div>
      )}

      {currentScreen === 'detail' && (
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Layout 
            title={selectedCategory ? APP_DATA[selectedCategory].title : "Detalhes"} 
            onBack={goBack}
            bgClass={selectedCategory ? APP_DATA[selectedCategory].bgClass : undefined}
            headerTextClass={selectedCategory ? APP_DATA[selectedCategory].headerTextClass : undefined}
            heartBgClass={selectedCategory ? APP_DATA[selectedCategory].heartBgClass : undefined}
            heartIconClass={selectedCategory ? APP_DATA[selectedCategory].heartIconClass : undefined}
          >
            {!selectedSituation || !selectedSituation.title ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-200" />
                <p className="text-slate-400 font-medium text-sm">
                  Conteúdo indisponível no momento.
                </p>
                <button 
                  onClick={goBack}
                  className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-xs"
                >
                  Voltar
                </button>
              </div>
            ) : (
              <div className="space-y-8 pb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">
                    {selectedCategory ? APP_DATA[selectedCategory].title : "Detalhes"}
                  </p>
                  <h2 className={`text-2xl font-bold mb-1 ${selectedCategory ? APP_DATA[selectedCategory].headerTextClass : 'text-slate-900'}`}>
                    {selectedSituation.title}
                  </h2>
                  <p className="text-emerald-600 text-sm font-bold mb-6">
                    {selectedSituation.reassurance || "Isso é comum. Você pode ajudar com calma."}
                  </p>
                  <div className="space-y-2">
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {selectedSituation.explanation}
                    </p>
                  </div>
                </div>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    O que fazer agora
                  </h3>
                  <div className="space-y-3">
                    {selectedSituation.steps?.map((step, idx) => (
                      <div key={`step-${selectedSituation.id}-${idx}`} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
                        <span className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-slate-700 leading-snug font-semibold">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    O que evitar
                  </h3>
                  <div className="space-y-3">
                    {selectedSituation.toAvoid?.map((item, idx) => (
                      <div key={`avoid-${selectedSituation.id}-${idx}`} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
                        <div className="w-2 h-2 bg-rose-300 rounded-full shrink-0 mt-2" />
                        <p className="text-slate-700 leading-snug font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedSituation.tip && (
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm">
                    <p className="text-amber-900 text-sm font-medium leading-relaxed">
                      <span className="font-bold block mb-1 text-amber-600 uppercase text-[10px] tracking-widest">Dica extra:</span>
                      {selectedSituation.tip}
                    </p>
                  </div>
                )}

                {/* INTEGRATED TIMER CARD - ONLY IN CRISIS FLOW */}
                {crisisOrigin === 'crisis' && isTimerRunning && (
                  <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 shadow-xl shadow-orange-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full bg-orange-500 animate-pulse`} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tempo da Crise</p>
                        <p className="text-2xl font-mono font-bold text-slate-700 leading-none">
                          {formatTime(elapsedTime)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={finalizarCrise}
                      className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Finalizar
                    </button>
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100">
                  <p className="text-slate-500 text-sm font-bold text-center mb-6">Isso ajudou?</p>
                  
                  {feedbackAjudou === null ? (
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={() => setFeedbackAjudou(true)}
                        className="px-10 py-3 bg-slate-50 text-slate-600 rounded-full font-bold text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-all active:scale-95 border border-transparent hover:border-emerald-200"
                      >
                        Sim
                      </button>
                      <button 
                        onClick={() => setFeedbackAjudou(false)}
                        className="px-10 py-3 bg-slate-50 text-slate-600 rounded-full font-bold text-sm hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 border border-transparent hover:border-rose-200"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center p-4 rounded-2xl font-bold text-sm ${
                        feedbackAjudou 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {feedbackAjudou 
                        ? "Que bom que ajudou 💙" 
                        : "Obrigado pelo feedback, vamos melhorar 🙏"}
                    </motion.div>
                  )}
                </div>

                <div className="pt-8 pb-4">
                  <button
                    onClick={voltarAoInicio}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Voltar ao início
                  </button>
                </div>
              </div>
            )}
          </Layout>
        </motion.div>
      )}

      {currentScreen === 'emergency' && (
        <motion.div
          key="emergency"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Layout 
            title="Modo Emergência" 
            onBack={goBack}
            bgClass="bg-slate-50"
            headerTextClass="text-orange-600"
            heartBgClass="bg-orange-50"
            heartIconClass="text-orange-400"
          >
            <div className="space-y-6 pb-10">
              {!hasEndedCrisis ? (
                <>
                  {/* 1. BLOCO PRINCIPAL (PRIMEIRO) */}
                  <div className="text-center space-y-2 pt-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Respire fundo.
                    </h2>
                    <div className="h-10 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={getCrisisMessage(elapsedTime)}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.4 }}
                          className="text-slate-500 font-medium text-sm"
                        >
                          {getCrisisMessage(elapsedTime)}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                    {[
                      "Mantenha a calma e respire fundo",
                      "Fale baixo e com tranquilidade",
                      "Reduza estímulos (luz, barulho, pessoas)",
                      "Evite toque físico se houver resistência",
                      "Dê tempo para a autorregulação"
                    ].map((step, i) => (
                      <div key={`emergency-step-${i}`} className="flex gap-4 items-start">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-slate-700 font-semibold leading-relaxed text-sm">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* 2. ORIENTAÇÕES ESPECÍFICAS */}
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Orientações específicas
                      </h3>
                    </div>
                    <div className="grid gap-2">
                      {EMERGENCY_DATA.map((item) => {
                        const isSelected = selectedEmergency?.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedEmergency(item);
                              const level = CRISIS_LEVEL_MAP[item.id] || 'moderado';
                              setCrisisLevel(level);
                              setInitialCrisisLevel(level);
                              setHospitalClicked(false);
                              setTimeout(() => {
                                setCurrentScreen('emergencyDetail');
                              }, 200);
                            }}
                            className={`w-full p-5 rounded-2xl text-left transition-all active:scale-[0.98] shadow-sm flex items-center justify-between border-2 ${
                              isSelected 
                              ? 'bg-orange-50/50 border-orange-400 shadow-orange-50' 
                              : 'bg-white border-slate-50 hover:border-orange-200'
                            }`}
                          >
                            <div className="flex-1">
                              <div className={`font-bold text-base ${isSelected ? 'text-orange-900' : 'text-slate-800'}`}>
                                {item.title}
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2.5 BOTÃO DE ESCALADA E HOSPITAL */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <button 
                        onClick={() => setCrisisLevel('grave')}
                        className="text-[10px] font-bold text-slate-400 hover:text-orange-400 transition-colors uppercase tracking-widest"
                      >
                        A situação está piorando?
                      </button>
                    </div>

                    {crisisLevel !== 'leve' && (
                      <div className="pt-2">
                        <p className={`text-[11px] font-medium mb-2 ${crisisLevel === 'grave' ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                          {crisisLevel === 'grave' ? 'Procure ajuda imediata:' : 'Se precisar de ajuda externa:'}
                        </p>
                        <button
                          onClick={() => {
                            setHospitalClicked(true);
                            window.open('https://www.google.com/maps/search/?api=1&query=hospital+near+me', '_blank');
                          }}
                          className={`w-full p-4 rounded-[14px] text-left transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center gap-3 shadow-sm group border ${
                            crisisLevel === 'grave' 
                            ? 'bg-rose-50 border-rose-200 shadow-rose-50' 
                            : 'bg-[#FFF7ED] border-orange-200 shadow-orange-50'
                          }`}
                        >
                          <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                            crisisLevel === 'grave' ? 'text-rose-500' : 'text-orange-500'
                          }`}>
                            <span className="text-2xl">{crisisLevel === 'grave' ? '🚑' : '🏥'}</span>
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold text-sm leading-tight ${crisisLevel === 'grave' ? 'text-rose-900' : 'text-[#9A3412]'}`}>
                              Ir para hospital próximo
                            </p>
                            <p className={`text-[10px] font-medium mt-0.5 ${crisisLevel === 'grave' ? 'text-rose-600/60' : 'text-orange-700/60'}`}>
                              Abrir rota imediata no mapa
                            </p>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${crisisLevel === 'grave' ? 'text-rose-300' : 'text-orange-300'}`} />
                        </button>
                        {/* 
                          FUTURO: 
                          - O nível de crise poderá ser definido por IA
                          - Pode considerar histórico da criança e sinais vitais
                        */}
                      </div>
                    )}
                  </div>

                  {/* 4. TIMER (POR ÚLTIMO) */}
                  <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200 text-center shadow-inner">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                      Tempo de Crise
                    </p>
                    <div className="text-4xl font-mono font-bold text-slate-700 mb-6 tracking-tighter">
                      {formatTime(elapsedTime)}
                    </div>
                    
                    <button
                      onClick={finalizarCrise}
                      className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-100 active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Finalizar crise
                    </button>
                  </div>
                </>
              ) : (
                /* 3. RESUMO DA CRISE */
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-4"
                >
                  <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-3">A crise passou.</h3>
                    <p className="text-emerald-700 font-medium leading-relaxed">
                      Você lidou com isso da melhor forma possível.
                    </p>
                    <p className="text-emerald-600/80 text-xs font-bold uppercase tracking-widest mt-4">
                      Agora vamos registrar rapidamente o que aconteceu.
                    </p>
                  </div>

                  {lastCrisisDuration !== null && (
                    <div className="w-full p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Duração Total</p>
                        <p className="text-4xl font-bold text-slate-700">{formatTime(lastCrisisDuration)}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Como você classifica esta crise?</p>
                        <div className="space-y-2">
                          {CRISIS_CLASSIFICATION_OPTIONS.map(tipo => (
                            <button
                              key={tipo}
                              onClick={() => setFinalCrisisType(tipo)}
                              className={`w-full p-4 border rounded-xl text-left transition-all group ${
                                finalCrisisType === tipo 
                                ? 'bg-orange-600 border-orange-600' 
                                : 'bg-slate-50 border-slate-100 hover:bg-orange-50 hover:border-orange-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-bold ${finalCrisisType === tipo ? 'text-white' : 'text-slate-700 group-hover:text-orange-700'}`}>
                                  {tipo}
                                </span>
                                <ChevronRight className={`w-4 h-4 ${finalCrisisType === tipo ? 'text-orange-200' : 'text-slate-300 group-hover:text-orange-400'}`} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">Observação opcional</p>
                        <textarea
                          placeholder="Escreva algo importante sobre o que aconteceu"
                          value={crisisObservation}
                          onChange={(e) => setCrisisObservation(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-h-[100px] resize-none"
                        />
                      </div>

                      <button
                        onClick={concluirRegistroEVoltar}
                        className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 active:scale-[0.98] transition-all"
                      >
                        Salvar e voltar ao início
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {!hasEndedCrisis && (
                <div className="pt-8 pb-4">
                  <button
                    onClick={voltarAoInicio}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Voltar ao início
                  </button>
                </div>
              )}
            </div>
          </Layout>
        </motion.div>
      )}

      {currentScreen === 'diary' && (
        <motion.div
          key="diary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Layout title="Histórico de crises" onBack={goBack}>
            <div className="space-y-6 relative pb-10">
              <div className="px-1">
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Acompanhe os eventos registrados e observe padrões ao longo do tempo.
                </p>
              </div>

              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-tight">Total</p>
                  <p className="text-xl font-bold text-slate-700">{crisisHistory.length}</p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase mt-1">Crises</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-tight">Média</p>
                  <p className="text-xl font-bold text-orange-500">
                    {crisisHistory.length > 0 
                      ? `${Math.round(crisisHistory.reduce((acc, curr) => acc + curr.tempoTotal, 0) / crisisHistory.length / 60)}`
                      : '0'
                    }
                  </p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase mt-1">Minutos</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-tight">Última</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    {crisisHistory.length > 0 
                      ? new Date(crisisHistory[crisisHistory.length - 1].data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                      : '-'
                    }
                  </p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase mt-1">Data</p>
                </div>
              </div>

              {!isPro && (
                <LockedOverlay 
                  onUnlock={() => setCurrentScreen('plans')} 
                  message="Histórico completo disponível no PLUS"
                />
              )}

              <div className={!isPro ? 'opacity-20 pointer-events-none blur-[4px]' : ''}>
                {crisisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {[...crisisHistory].reverse().map((event) => (
                      <div key={event.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-orange-400">
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                {new Date(event.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} às {new Date(event.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <h4 className="font-bold text-slate-800 text-base leading-tight">{event.tipo}</h4>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                              event.nivelFinal === 'leve' ? 'bg-emerald-50 text-emerald-600' :
                              event.nivelFinal === 'moderado' ? 'bg-amber-50 text-amber-600' :
                              'bg-rose-50 text-rose-600'
                            }`}>
                              Nível {event.nivelFinal}
                            </div>
                          </div>

                          <div className="flex gap-6 py-3 border-y border-slate-50">
                            <div>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Duração</p>
                              <p className="text-sm font-mono font-bold text-slate-600">{formatTime(event.tempoTotal)}</p>
                            </div>
                            {event.feedbackAjudou !== undefined && (
                              <div>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Resultado</p>
                                <p className={`text-sm font-bold flex items-center gap-1 ${event.feedbackAjudou ? 'text-emerald-600' : 'text-slate-400'}`}>
                                  {event.feedbackAjudou ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Estratégia ajudou
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5" />
                                      Estratégia não ajudou
                                    </>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {event.observacao && (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Observação</p>
                              <p className="text-xs text-slate-600 italic font-medium">"{event.observacao}"</p>
                            </div>
                          )}

                          {event.acionouHospital && (
                            <div className="flex items-center gap-2 text-rose-600 bg-rose-50/50 px-3 py-2 rounded-xl text-xs font-bold border border-rose-100">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              Ajuda externa acionada
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={clearHistory}
                      className="w-full py-8 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar histórico
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-20 px-8 space-y-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto opacity-50">
                      <Clock className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-600 font-bold text-lg">Nenhuma crise registrada ainda</p>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed">
                        Quando uma crise for finalizada, ela aparecerá aqui.
                      </p>
                    </div>
                    
                    <button
                      onClick={voltarAoInicio}
                      className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-all"
                    >
                      Voltar ao início
                    </button>
                  </div>
                )}
              </div>

              {crisisHistory.length > 0 && (
                <div className="pt-4 pb-4">
                  <button
                    onClick={voltarAoInicio}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Voltar ao início
                  </button>
                </div>
              )}
            </div>
          </Layout>
        </motion.div>
      )}

      {currentScreen === 'emergencyDetail' && selectedEmergency && (
        <motion.div
          key="emergencyDetail"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Layout 
            title="Orientação" 
            onBack={goBack}
            bgClass="bg-slate-50"
            headerTextClass="text-orange-600"
            heartBgClass="bg-orange-50"
            heartIconClass="text-orange-400"
          >
            <div className="space-y-8 pb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                  {selectedEmergency.title}
                </h2>
                <p className="text-orange-600 text-sm font-bold mb-6">
                  {selectedEmergency.reassurance || "Mantenha a calma. Você está no controle."}
                </p>
                {selectedEmergency.subtitle && (
                  <p className="text-slate-500 font-medium text-sm">{selectedEmergency.subtitle}</p>
                )}
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  O que fazer agora
                </h3>
                <div className="space-y-3">
                  {selectedEmergency.steps.map((step, idx) => (
                    <div key={`emergency-dt-step-${selectedEmergency.id}-${idx}`} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
                      <span className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 font-semibold leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  O que evitar
                </h3>
                <div className="space-y-3">
                  {selectedEmergency.toAvoid.map((item, idx) => (
                    <div key={`emergency-dt-avoid-${selectedEmergency.id}-${idx}`} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
                      <div className="w-2 h-2 bg-rose-300 rounded-full shrink-0 mt-2" />
                      <p className="text-slate-700 font-semibold leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {selectedEmergency.tip && (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm">
                  <p className="text-amber-900 text-sm font-medium leading-relaxed">
                    <span className="font-bold block mb-1 text-amber-600 uppercase text-[10px] tracking-widest">Dica extra:</span>
                    {selectedEmergency.tip}
                  </p>
                </div>
              )}

              {/* INTEGRATED TIMER CARD - ONLY IN CRISIS FLOW */}
              {crisisOrigin === 'crisis' && isTimerRunning && (
                <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 shadow-xl shadow-orange-50/50 flex items-center justify-between mt-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full bg-orange-500 animate-pulse`} />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tempo da Crise</p>
                      <p className="text-2xl font-mono font-bold text-slate-700 leading-none">
                        {formatTime(elapsedTime)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={finalizarCrise}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Finalizar
                  </button>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 mb-6">
                <p className="text-slate-500 text-sm font-bold text-center mb-6">Isso ajudou?</p>
                
                {feedbackAjudou === null ? (
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => setFeedbackAjudou(true)}
                      className="px-10 py-3 bg-white text-slate-600 rounded-full font-bold text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-all active:scale-95 border border-slate-100 hover:border-emerald-200"
                    >
                      Sim
                    </button>
                    <button 
                      onClick={() => setFeedbackAjudou(false)}
                      className="px-10 py-3 bg-white text-slate-600 rounded-full font-bold text-sm hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 border border-slate-100 hover:border-rose-200"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center p-4 rounded-2xl font-bold text-sm ${
                      feedbackAjudou 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {feedbackAjudou 
                      ? "Que bom que ajudou 💙" 
                      : "Obrigado pelo feedback, vamos melhorar 🙏"}
                  </motion.div>
                )}
              </div>

              <div className="space-y-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <button 
                    onClick={() => setCrisisLevel('grave')}
                    className="text-[10px] font-bold text-slate-400 hover:text-orange-400 transition-colors uppercase tracking-widest"
                  >
                    A situação está piorando?
                  </button>
                </div>

                {crisisLevel !== 'leve' && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      {crisisLevel === 'grave' ? <Zap className="w-5 h-5 text-rose-500" /> : <Info className="w-5 h-5 text-orange-400" />}
                      Ajuda externa
                    </h3>
                    <p className={`text-[11px] font-medium mb-3 ${crisisLevel === 'grave' ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                      {crisisLevel === 'grave' ? 'Procure ajuda imediata:' : 'Se precisar de ajuda externa:'}
                    </p>
                    <button
                      onClick={() => {
                        setHospitalClicked(true);
                        window.open('https://www.google.com/maps/search/?api=1&query=hospital+near+me', '_blank');
                      }}
                      className={`w-full p-4 rounded-[14px] text-left transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center gap-3 shadow-sm group border ${
                        crisisLevel === 'grave' 
                        ? 'bg-rose-50 border-rose-200 shadow-rose-50' 
                        : 'bg-[#FFF7ED] border-orange-200 shadow-orange-50'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                        crisisLevel === 'grave' ? 'text-rose-500' : 'text-orange-500'
                      }`}>
                        <span className="text-2xl">{crisisLevel === 'grave' ? '🚑' : '🏥'}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm leading-tight ${crisisLevel === 'grave' ? 'text-rose-900' : 'text-[#9A3412]'}`}>
                          Ir para hospital próximo
                        </p>
                        <p className={`text-[10px] font-medium mt-0.5 ${crisisLevel === 'grave' ? 'text-rose-600/60' : 'text-orange-700/60'}`}>
                          Abrir rota imediata no mapa
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${crisisLevel === 'grave' ? 'text-rose-300' : 'text-orange-300'}`} />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-8 pb-4">
                <button
                  onClick={voltarAoInicio}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Voltar ao início
                </button>
              </div>
            </div>
          </Layout>
        </motion.div>
      )}

      </AnimatePresence>

      {/* Assistant Component - Moved outside AnimatePresence to avoid conflicts with mode="wait" */}
      <Assistant 
        isOpen={isAssistantOpen} 
        userPlan={userPlan} 
        onClose={() => setIsAssistantOpen(false)}
        onUpgrade={() => {
          setIsAssistantOpen(false);
          setCurrentScreen('plans');
        }}
      />

      {/* Floating Assistant Button - Moved outside AnimatePresence to avoid conflicts with mode="wait" */}
      {currentScreen !== 'home' && currentScreen !== 'auth' && currentScreen !== 'plans' && currentScreen !== 'checkout' && currentScreen !== 'success' && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 px-4 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center gap-2 z-[1000] active:scale-95 transition-all group overflow-hidden"
          aria-label="Ajuda rápida"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
          <span className="font-bold text-sm pr-1">Ajuda</span>
        </button>
      )}
    </div>
  );
}
