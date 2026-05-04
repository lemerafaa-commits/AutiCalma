import { useState, useEffect, useCallback } from 'react';
import { CrisisLevel, CrisisHistoryEvent } from '../types';
import { CRISIS_LEVEL_MAP } from '../constants';

export function useCrisisManager(userId: string | undefined, setCurrentScreen: (s: any) => void) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>('leve');
  const [initialCrisisLevel, setInitialCrisisLevel] = useState<CrisisLevel>('leve');
  const [hospitalClicked, setHospitalClicked] = useState(false);
  const [feedbackAjudou, setFeedbackAjudou] = useState<boolean | null>(null);
  const [hasEndedCrisis, setHasEndedCrisis] = useState(false);
  const [lastCrisisDuration, setLastCrisisDuration] = useState<number | null>(null);
  const [crisisHistory, setCrisisHistory] = useState<CrisisHistoryEvent[]>(() => {
    const saved = localStorage.getItem('historicoCrises');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist history
  useEffect(() => {
    localStorage.setItem('historicoCrises', JSON.stringify(crisisHistory));
  }, [crisisHistory]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          if (next === 300) setCrisisLevel('grave');
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const resetCrisisState = useCallback(() => {
    setIsTimerRunning(false);
    setElapsedTime(0);
    setCrisisLevel('leve');
    setInitialCrisisLevel('leve');
    setHospitalClicked(false);
    setFeedbackAjudou(null);
    setHasEndedCrisis(false);
    setLastCrisisDuration(null);
  }, []);

  const endCrisis = useCallback(() => {
    setIsTimerRunning(false);
    setHasEndedCrisis(true);
    setLastCrisisDuration(elapsedTime);
  }, [elapsedTime]);

  const registrarEventoCrise = useCallback((type: string, observacao?: string) => {
    if (lastCrisisDuration === null) return;

    const event: CrisisHistoryEvent = {
        id: Date.now().toString(),
        data: new Date().toISOString(),
        tipo: type,
        nivelInicial: initialCrisisLevel,
        nivelFinal: crisisLevel,
        tempoTotal: lastCrisisDuration,
        acionouHospital: hospitalClicked,
        feedbackAjudou: feedbackAjudou,
        observacao: observacao,
    };
    
    setCrisisHistory(prev => [...prev, event]);
  }, [lastCrisisDuration, initialCrisisLevel, crisisLevel, hospitalClicked, feedbackAjudou]);

  const sairDaCrise = useCallback(() => {
    resetCrisisState();
    setCurrentScreen('home');
  }, [resetCrisisState, setCurrentScreen]);

  const iniciarCrise = useCallback((situationId: string, categoryId?: string) => {
    resetCrisisState();
    const level = CRISIS_LEVEL_MAP[situationId] || (categoryId ? CRISIS_LEVEL_MAP[categoryId] : 'moderado');
    setCrisisLevel(level);
    setInitialCrisisLevel(level);
    setIsTimerRunning(true);
  }, [resetCrisisState]);

  const clearHistory = useCallback(() => {
    if (confirm('Deseja limpar todo o histórico?')) {
      setCrisisHistory([]);
    }
  }, []);

  return {
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
  };
}
