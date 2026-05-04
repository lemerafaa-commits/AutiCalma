import React from 'react';

export type CategoryId = 'crise' | 'socializacao' | 'comunicacao';

export interface Situation {
  id: string;
  title: string;
  explanation: string;
  steps: string[];
  toAvoid: string[];
  keywords: string[];
  reassurance?: string;
  tip?: string;
  categoria?: string;
  titulo?: string;
  situacao?: string;
  o_que_fazer?: string[];
  o_que_evitar?: string[];
}

export interface EmergencySituation {
  id: string;
  title: string;
  subtitle: string;
  reassurance?: string;
  steps: string[];
  toAvoid: string[];
  tip?: string;
}

export interface CrisisLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  notes?: string;
}

export interface CrisisHistoryEvent {
  id: string;
  data: string;
  tipo: string;
  nivelInicial: CrisisLevel;
  nivelFinal: CrisisLevel;
  tempoTotal: number;
  acionouHospital: boolean;
  feedbackAjudou?: boolean | null;
  observacao?: string;
}

export type CrisisLevel = 'leve' | 'moderado' | 'grave';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
  headerTextClass: string;
  heartBgClass: string;
  heartIconClass: string;
  itemHoverBorderClass: string;
  itemHoverBgClass: string;
  itemHoverTextClass: string;
  itemHoverIconClass: string;
  actionBtnBgClass: string;
  actionBtnShadowClass: string;
  situations: Situation[];
}
