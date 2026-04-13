/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Play
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { ProfilePage } from './pages/Profile';

// --- Types & Data ---

type CategoryId = 'crise' | 'socializacao' | 'comunicacao';

interface Situation {
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

interface EmergencySituation {
  id: string;
  title: string;
  subtitle: string;
  reassurance?: string;
  steps: string[];
  toAvoid: string[];
  tip?: string;
}

interface CrisisLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  notes?: string;
}

interface Category {
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

const EMERGENCY_DATA: EmergencySituation[] = [
  {
    id: 'sensorial',
    title: 'Crise sensorial',
    subtitle: '(barulho, luz, estímulos fortes)',
    reassurance: 'O ambiente está sobrecarregado. Você pode ajudar.',
    steps: [
      'Leve a criança para um local silencioso',
      'Reduza luzes fortes imediatamente',
      'Permita que ela cubra os ouvidos',
      'Fale baixo e de forma previsível'
    ],
    toAvoid: [
      'Não grite ou fale alto',
      'Não pressione para parar agora',
      'Não force contato físico'
    ],
    tip: 'O silêncio é o melhor remédio para a sobrecarga sensorial.'
  },
  {
    id: 'autoagressao',
    title: 'Autoagressão',
    subtitle: '(bater a cabeça ou se machucar)',
    reassurance: 'A segurança física é a prioridade agora.',
    steps: [
      'Proteja a cabeça com almofadas ou suas mãos',
      'Mantenha o ambiente em silêncio absoluto',
      'Reduza estímulos visuais (apague as luzes)',
      'Fique por perto sem conter bruscamente'
    ],
    toAvoid: [
      'Não demonstre pânico ou medo',
      'Não dê broncas ou grite',
      'Não tente segurar com força excessiva'
    ],
    tip: 'Sua calma corporal ajuda a criança a se regular mais rápido.'
  },
  {
    id: 'gritos',
    title: 'Gritos ou choro intenso',
    subtitle: '(descontrole emocional)',
    reassurance: 'Isso vai passar. Respire fundo e mantenha a calma.',
    steps: [
      'Mantenha sua presença calma e silenciosa',
      'Valide o sentimento: "Eu estou aqui com você"',
      'Verifique se há dor ou necessidade física',
      'Espere o pico da crise passar'
    ],
    toAvoid: [
      'Não peça para parar de gritar',
      'Não faça ameaças ou chantagens',
      'Não tente conversar longamente agora'
    ],
    tip: 'Às vezes, apenas estar presente em silêncio é o suficiente.'
  },
  {
    id: 'publico',
    title: 'Crise em local público',
    subtitle: '(julgamento de terceiros)',
    reassurance: 'Ignore os outros. Foque apenas na sua criança.',
    steps: [
      'Procure um local reservado ou o carro',
      'Ignore o olhar e o julgamento de estranhos',
      'Fale baixo e calmo no ouvido da criança',
      'Use fones de ouvido ou objetos de conforto'
    ],
    toAvoid: [
      'Não tente "educar" na frente de estranhos',
      'Não perca a calma com curiosos',
      'Não force a permanência no local'
    ],
    tip: 'Sair do ambiente estressor é um ato de cuidado, não de derrota.'
  }
];

const APP_DATA: Record<CategoryId, Category> = {
  crise: {
    id: 'crise',
    title: 'Crise',
    description: 'Quando a criança está em sobrecarga emocional ou sensorial',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'bg-white border-slate-100 border-l-orange-400',
    bgClass: 'bg-slate-50',
    headerTextClass: 'text-slate-900',
    heartBgClass: 'bg-slate-100',
    heartIconClass: 'text-slate-400',
    itemHoverBorderClass: 'hover:border-orange-200',
    itemHoverBgClass: 'hover:bg-orange-50/30',
    itemHoverTextClass: 'group-hover:text-orange-900',
    itemHoverIconClass: 'group-hover:text-orange-500',
    actionBtnBgClass: 'bg-orange-500',
    actionBtnShadowClass: 'shadow-orange-100',
    situations: [
      {
        id: 'publico',
        title: 'Crise em local público',
        keywords: ['crise em público', 'supermercado', 'shopping', 'rua', 'gritando', 'chorando'],
        explanation: 'A criança começa a gritar ou chorar em um ambiente cheio como supermercado ou shopping.',
        reassurance: 'Isso é comum em locais com muitos estímulos. Você pode ajudar.',
        steps: [
          'Leve a criança para um local mais tranquilo',
          'Fale com voz calma e baixa',
          'Reduza estímulos visuais e sonoros',
          'Dê tempo para a criança se regular'
        ],
        toAvoid: ['Não grite com a criança', 'Não force a parada imediata', 'Não chame atenção para a situação'],
        tip: 'Mantenha-se entre a criança e a multidão para criar um escudo visual.'
      },
      {
        id: 'gritando',
        title: 'Criança gritando',
        keywords: ['criança gritando', 'grito', 'berro', 'barulho', 'irritação'],
        explanation: 'A criança emite gritos agudos e constantes, parecendo estar em sofrimento ou protesto.',
        reassurance: 'O grito é uma forma de comunicação. Mantenha a calma.',
        steps: [
          'Mantenha-se calmo e em silêncio',
          'Verifique estímulos incômodos (som, luz)',
          'Use frases curtas e voz baixa',
          'Ofereça um objeto de conforto'
        ],
        toAvoid: ['Não grite mais alto que a criança', 'Não tente conversar ou dar lições agora', 'Não puna a criança pelo barulho'],
        tip: 'Sua calma é o espelho para a regulação dela. Respire fundo visivelmente.'
      },
      {
        id: 'choro',
        title: 'Criança chorando sem parar',
        keywords: ['criança chorando sem parar', 'choro', 'lágrimas', 'inconsolável', 'tristeza'],
        explanation: 'A criança chora de forma inconsolável por um longo período sem um motivo óbvio.',
        reassurance: 'O choro ajuda a liberar a tensão. Esteja presente.',
        steps: [
          'Esteja presente fisicamente',
          'Ofereça um abraço ou apenas fique perto',
          'Reduza as luzes e o barulho',
          'Espere o pico da emoção passar'
        ],
        toAvoid: ['Não peça para parar de chorar', 'Não demonstre desespero ou impaciência', 'Não use telas para distrair agora'],
        tip: 'Às vezes, o choro é apenas uma descarga necessária. Apenas acompanhe.'
      },
      {
        id: 'sensorial_crise',
        title: 'Crise sensorial',
        keywords: ['crise sensorial', 'luz', 'som', 'cheiro', 'toque', 'sensibilidade'],
        explanation: 'A criança fica agitada ou entra em colapso devido a excesso de barulho, luzes ou texturas.',
        reassurance: 'O ambiente está sobrecarregando os sentidos dela.',
        steps: [
          'Identifique e remova o estímulo incômodo',
          'Ofereça abafadores ou óculos escuros',
          'Leve-a para um local silencioso',
          'Use pressão profunda (cobertor ou abraço)'
        ],
        toAvoid: ['Não force o enfrentamento do estímulo', 'Não ache que é teimosia', 'Não fale muito durante a crise'],
        tip: 'Diminuir a iluminação costuma ter um efeito calmante imediato.'
      },
      {
        id: 'autoagressao_crise',
        title: 'Autoagressão (bater a cabeça)',
        keywords: ['autoagressão', 'bater a cabeça', 'se morder', 'se bater', 'ferir'],
        explanation: 'A criança começa a bater a cabeça na parede, no chão ou a se morder.',
        reassurance: 'Priorize a segurança. Isso vai passar.',
        steps: [
          'Proteja com algo macio (almofada)',
          'Mantenha a calma absoluta',
          'Redirecione para pressão nas mãos',
          'Garanta a segurança física imediata'
        ],
        toAvoid: ['Não segure com força excessiva', 'Não entre em pânico', 'Não dê broncas agora'],
        tip: 'Sua prioridade é a segurança física. Use seu corpo apenas como escudo macio.'
      },
      {
        id: 'rotina_crise',
        title: 'Irritação com mudança de rotina',
        keywords: ['criança se irrita com mudanças de rotina', 'rotina', 'mudança', 'surpresa', 'plano'],
        explanation: 'A criança fica brava ou entra em crise porque um plano mudou ou o caminho foi diferente.',
        reassurance: 'A previsibilidade traz segurança para ela.',
        steps: [
          'Use rotinas visuais claras',
          'Avise com antecedência sobre mudanças',
          'Valide o sentimento da criança',
          'Ofereça previsibilidade no novo plano'
        ],
        toAvoid: ['Não mude as coisas de surpresa', 'Não minimize a importância da rotina', 'Não fique impaciente com a rigidez'],
        tip: 'Tente encontrar um elemento da rotina antiga para levar para a nova situação.'
      },
      {
        id: 'frustracao_ativ',
        title: 'Frustração durante atividades',
        keywords: ['frustração durante atividades', 'erro', 'falha', 'difícil', 'tarefa', 'desistir'],
        explanation: 'A criança se irrita ou joga objetos quando não consegue realizar uma tarefa ou comete um erro.',
        reassurance: 'Aprender algo novo pode ser desafiador.',
        steps: [
          'Divida a tarefa em passos pequenos',
          'Ajude antes da explosão ocorrer',
          'Elogie o esforço, não o resultado',
          'Ensine a pedir ajuda com sinais'
        ],
        toAvoid: ['Não critique o erro', 'Não faça tudo pela criança', 'Não deixe que ela se sinta incapaz'],
        tip: 'Se a frustração subir, faça uma pausa total e mude de assunto por 5 minutos.'
      },
      {
        id: 'banho_crise',
        title: 'Crise na hora do banho',
        keywords: ['crise no banho', 'água', 'chuveiro', 'higiene', 'resistência'],
        explanation: 'A criança chora, grita ou foge quando chega o momento de tomar banho.',
        reassurance: 'O banho envolve muitas sensações táteis intensas.',
        steps: [
          'Verifique temperatura e pressão da água',
          'Use brinquedos interessantes',
          'Avise 5 minutos antes de começar',
          'Tente usar bacia se o chuveiro assustar'
        ],
        toAvoid: ['Não arraste a criança à força', 'Não jogue água no rosto de surpresa', 'Não torne o banho uma batalha'],
        tip: 'Deixe a criança controlar o chuveirinho se possível. O controle reduz o medo.'
      },
      {
        id: 'seletividade_alimentar',
        title: 'Seletividade alimentar',
        keywords: ['criança não quer comer', 'comida', 'prato', 'mesa', 'recusar'],
        explanation: 'A criança se recusa a comer, chora ao ver o prato ou aceita apenas poucos alimentos.',
        reassurance: 'A alimentação é um processo gradual de descoberta.',
        steps: [
          'Apresente novos itens sem obrigar',
          'Deixe-a explorar a textura com as mãos',
          'Mantenha o ambiente calmo na mesa',
          'Respeite as aversões sensoriais'
        ],
        toAvoid: ['Não force a comer tudo', 'Não faça chantagens ou ameaças', 'Não esconda alimentos novos'],
        tip: 'A exposição visual repetida, sem pressão, é o primeiro passo para a aceitação.'
      },
      {
        id: 'telas_crise',
        title: 'Retirada de eletrônicos',
        keywords: ['tirar o celular', 'tablet', 'tv', 'eletrônico', 'tempo'],
        explanation: 'A criança entra em crise profunda quando o tempo de celular ou tablet acaba.',
        reassurance: 'A transição entre o digital e o real é difícil.',
        steps: [
          'Use um cronômetro visual',
          'Avise: "Faltam 5 minutos", "1 minuto"',
          'Ofereça atividade prazerosa em seguida',
          'Estabeleça regras claras antes do uso'
        ],
        toAvoid: ['Não tire o aparelho repentinamente', 'Não use telas como única calma', 'Não devolva o aparelho na crise'],
        tip: 'O cérebro precisa de tempo para "desligar" do estímulo visual. O aviso é vital.'
      }
    ]
  },
  socializacao: {
    id: 'socializacao',
    title: 'Socialização',
    description: 'Dificuldades de interação com outras pessoas',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-white border-slate-100 border-l-violet-400',
    bgClass: 'bg-slate-50',
    headerTextClass: 'text-slate-900',
    heartBgClass: 'bg-slate-100',
    heartIconClass: 'text-slate-400',
    itemHoverBorderClass: 'hover:border-violet-200',
    itemHoverBgClass: 'hover:bg-violet-50/30',
    itemHoverTextClass: 'group-hover:text-violet-900',
    itemHoverIconClass: 'group-hover:text-violet-500',
    actionBtnBgClass: 'bg-violet-500',
    actionBtnShadowClass: 'shadow-violet-100',
    situations: [
      {
        id: 'brincar_junto',
        title: 'Dificuldade em brincar junto',
        keywords: ['dificuldade para brincar com outras crianças', 'parque', 'escola', 'amigos'],
        explanation: 'A criança se afasta ou ignora outras crianças que tentam interagir.',
        reassurance: 'Interação social leva tempo. Respeite o ritmo dele.',
        steps: [
          'Permita o brincar paralelo (perto, mas não junto)',
          'Proponha atividade de alto interesse',
          'Elogie se ele apenas observar os outros',
          'Mantenha a pressão social baixa'
        ],
        toAvoid: [
          'Não empurre a criança para o grupo',
          'Não force interações imediatas',
          'Não rotule como antissocial'
        ],
        tip: 'Ficar perto sem interagir já é um grande passo social.'
      },
      {
        id: 'brincar_sozinho',
        title: 'Preferência por brincar só',
        keywords: ['criança prefere brincar sozinha', 'isolamento', 'canto', 'brinquedo'],
        explanation: 'A criança foca intensamente em um objeto e recusa companhia.',
        reassurance: 'O brincar solitário pode ser uma forma de regulação.',
        steps: [
          'Respeite o tempo de isolamento',
          'Aproxime-se aos poucos, sem invadir',
          'Brinque com algo similar ao lado dele',
          'Valorize o foco e a concentração'
        ],
        toAvoid: [
          'Não tire o brinquedo para forçar contato',
          'Não interrompa o hiperfoco bruscamente',
          'Não force a partilha imediata'
        ],
        tip: 'Brincar ao lado com o mesmo tipo de objeto cria conexão sem pressão.'
      },
      {
        id: 'evita_interacao',
        title: 'Evita novas interações',
        keywords: ['criança evita interação social', 'fugir', 'esconder', 'pessoas', 'visitas'],
        explanation: 'A criança se esconde ou foge quando chegam visitas ou em locais cheios.',
        reassurance: 'Novas pessoas podem ser imprevisíveis e assustadoras.',
        steps: [
          'Crie um espaço seguro para ele ficar',
          'Peça às visitas para não forçarem contato',
          'Deixe ele se aproximar no próprio tempo',
          'Use fones se o barulho incomodar'
        ],
        toAvoid: [
          'Não obrigue a beijar ou abraçar',
          'Não peça desculpas pelo comportamento',
          'Não force a permanência na multidão'
        ],
        tip: 'Permitir que ele observe de um local seguro aumenta a confiança.'
      },
      {
        id: 'compartilhar_social',
        title: 'Dificuldade em compartilhar',
        keywords: ['compartilhar brinquedos', 'dividir', 'meu', 'posse', 'briga'],
        explanation: 'A criança entra em conflito se alguém toca em seus objetos.',
        reassurance: 'O conceito de posse traz segurança emocional.',
        steps: [
          'Use cronômetros para definir turnos',
          'Ensine "minha vez, sua vez" com calma',
          'Treine com objetos de baixo interesse',
          'Garanta que o brinquedo voltará para ele'
        ],
        toAvoid: [
          'Não tire o objeto da mão dele bruscamente',
          'Não chame de egoísta',
          'Não espere entendimento imediato'
        ],
        tip: 'Ter brinquedos que "não precisam ser divididos" reduz a ansiedade.'
      },
      {
        id: 'olhar_olhos_social',
        title: 'Evita contato visual',
        keywords: ['criança não olha nos olhos', 'contato visual', 'olhar', 'encarar'],
        explanation: 'A criança desvia o olhar durante conversas ou interações.',
        reassurance: 'O contato visual pode ser sensorialmente doloroso.',
        steps: [
          'Aceite que o olhar pode ser desconfortável',
          'Foque na interação, não no olho no olho',
          'Sente-se ao lado para diminuir a pressão',
          'Use brinquedos perto do seu rosto'
        ],
        toAvoid: [
          'Não peça: "Olha para mim"',
          'Não segure o rosto para forçar o olhar',
          'Não ache que ele não está ouvindo'
        ],
        tip: 'Muitas crianças autistas ouvem melhor quando não estão olhando.'
      },
      {
        id: 'regras_social',
        title: 'Regras de brincadeiras',
        keywords: ['regras de brincadeiras', 'jogo', 'perder', 'ganhar', 'vez'],
        explanation: 'A criança não entende como jogar um jogo ou fica muito brava quando perde.',
        reassurance: 'Regras sociais e jogos competitivos são complexos.',
        steps: [
          'Use jogos com regras simples e visuais',
          'Explique a regra antes de começar',
          'Treine o "perder" de forma leve em casa',
          'Use o sistema de turnos visuais'
        ],
        toAvoid: [
          'Não mude as regras no meio do jogo',
          'Não ria se ela ficar frustrada ao perder',
          'Não desista de jogar com ela'
        ],
        tip: 'Jogos cooperativos (todos ganham juntos) são ótimos para começar.'
      },
      {
        id: 'festas_social',
        title: 'Isolamento em festas',
        keywords: ['isolamento em festas', 'aniversário', 'barulho', 'muita gente'],
        explanation: 'Em festas de aniversário, a criança fica em um canto ou quer ir embora logo.',
        reassurance: 'Festas são o auge da sobrecarga sensorial e social.',
        steps: [
          'Leve um "kit de sobrevivência" com favoritos',
          'Combine um tempo curto de permanência',
          'Procure um local mais calmo na festa',
          'Respeite se ela quiser apenas observar'
        ],
        toAvoid: [
          'Não force a criança a ir para a pista de dança',
          'Não obrigue a cantar parabéns se o som assustar',
          'Não compare com outras crianças'
        ],
        tip: 'Chegar mais cedo, quando está vazio, ajuda na aclimatação.'
      },
      {
        id: 'esperar_social',
        title: 'Dificuldade em esperar a vez',
        keywords: ['esperar a vez', 'fila', 'turno', 'paciência', 'agora'],
        explanation: 'A criança fica muito ansiosa ou grita quando precisa esperar em filas ou turnos.',
        reassurance: 'O tempo de espera é abstrato e gera ansiedade.',
        steps: [
          'Use suportes visuais (ampulhetas ou relógios)',
          'Ofereça uma distração leve enquanto espera',
          'Elogie cada minuto de espera bem-sucedida',
          'Explique o que vai acontecer após a espera'
        ],
        toAvoid: [
          'Não diga apenas "espera" sem dar previsão',
          'Não fique impaciente com a agitação',
          'Não fure a fila sempre para evitar o treino'
        ],
        tip: 'Ter um "brinquedo de espera" exclusivo ajuda a criar uma associação positiva.'
      },
      {
        id: 'cumprimentos_social',
        title: 'Não responder a cumprimentos',
        keywords: ['não responde a cumprimentos', 'oi', 'tchau', 'educação', 'mão'],
        explanation: 'Alguém diz "oi" ou "tchau" e a criança não responde nem acena.',
        reassurance: 'Responder a cumprimentos exige processamento rápido.',
        steps: [
          'Modele o comportamento acenando você mesmo',
          'Ensine formas alternativas (joinha ou sorriso)',
          'Não pressione por resposta imediata',
          'Explique: "Ele está processando o seu oi"'
        ],
        toAvoid: [
          'Não obrigue a criança a falar ou tocar na pessoa',
          'Não chame de mal-educada',
          'Não demonstre vergonha pela falta de resposta'
        ],
        tip: 'O aceno é um motor mais fácil de executar que a fala sob pressão.'
      },
      {
        id: 'faz_de_conta_social',
        title: 'Brincar de faz de conta',
        keywords: ['brincar de faz de conta', 'imaginação', 'boneco', 'carrinho', 'fingir'],
        explanation: 'A criança tem dificuldade em imaginar que um boneco está comendo ou que um bloco é um carro.',
        reassurance: 'O pensamento abstrato se desenvolve de forma diferente.',
        steps: [
          'Demonstre a brincadeira de forma bem clara',
          'Use objetos reais no início (comida de verdade)',
          'Siga o interesse da criança na brincadeira',
          'Use sons e expressões exageradas'
        ],
        toAvoid: [
          'Não critique se ela usar o brinquedo de forma "errada"',
          'Não force uma imaginação que ela ainda não tem',
          'Não ache que ela não tem criatividade'
        ],
        tip: 'Brincar de "imitar a vida real" é a base para o faz-de-conta futuro.'
      }
    ]
  },
  comunicacao: {
    id: 'comunicacao',
    title: 'Comunicação',
    description: 'Quando é difícil se entender ou dar instruções',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'bg-white border-slate-100 border-l-emerald-400',
    bgClass: 'bg-slate-50',
    headerTextClass: 'text-slate-900',
    heartBgClass: 'bg-slate-100',
    heartIconClass: 'text-slate-400',
    itemHoverBorderClass: 'hover:border-emerald-200',
    itemHoverBgClass: 'hover:bg-emerald-50/30',
    itemHoverTextClass: 'group-hover:text-emerald-900',
    itemHoverIconClass: 'group-hover:text-emerald-500',
    actionBtnBgClass: 'bg-emerald-500',
    actionBtnShadowClass: 'shadow-emerald-100',
    situations: [
      {
        id: 'nao_responde',
        title: 'Não responde ao chamado',
        keywords: ['criança não responde quando chamada', 'nome', 'atenção', 'surda', 'foco'],
        explanation: 'A criança parece não ouvir ou ignora quando chamada pelo nome.',
        reassurance: 'O foco intenso pode dificultar a resposta. Aproxime-se.',
        steps: [
          'Aproxime-se e fique na altura dos olhos',
          'Toque suavemente no ombro para chamar',
          'Use frases curtas e objetivas',
          'Espere alguns segundos para o processamento'
        ],
        toAvoid: [
          'Não grite de longe',
          'Não ache que é desobediência proposital',
          'Não repita o nome sem se aproximar'
        ],
        tip: 'O contato físico leve ajuda a quebrar o hiperfoco e traz a atenção.'
      },
      {
        id: 'ecolalia_com',
        title: 'Repetição de falas (Ecolalia)',
        keywords: ['ecolalia', 'repetir palavras', 'eco', 'fala', 'frase'],
        explanation: 'A criança repete frases de desenhos ou o que você acabou de dizer.',
        reassurance: 'A repetição é uma ferramenta de processamento da fala.',
        steps: [
          'Entenda que a repetição ajuda no processamento',
          'Tente identificar a emoção por trás da fala',
          'Responda ao que ele parece estar sentindo',
          'Modele a frase correta naturalmente'
        ],
        toAvoid: [
          'Não peça para parar de repetir',
          'Não zombe da repetição',
          'Não corrija a fala de forma rígida'
        ],
        tip: 'Validar a intenção comunicativa é mais importante que a forma da frase.'
      },
      {
        id: 'nao_fala',
        title: 'Dificuldade na fala verbal',
        keywords: ['criança não consegue falar', 'atraso na fala', 'muda', 'expressão', 'comunicação'],
        explanation: 'A criança tem dificuldade em articular palavras ou não usa a fala verbal.',
        reassurance: 'Comunicação vai muito além das palavras faladas.',
        steps: [
          'Use cartões de comunicação visual (PECS)',
          'Incentive gestos e o ato de apontar',
          'Narre o que vocês estão fazendo juntos',
          'Dê tempo para tentativas de sons'
        ],
        toAvoid: [
          'Não pressione para falar "direito"',
          'Não compare com outras crianças',
          'Não finja que não entende os gestos'
        ],
        tip: 'Valorize qualquer tentativa de comunicação, seja um som ou um olhar.'
      },
      {
        id: 'literal',
        title: 'Entendimento literal',
        keywords: ['entendimento literal', 'ironia', 'piada', 'metáfora', 'confusão'],
        explanation: 'A criança não entende ironias, sarcasmo ou expressões figuradas.',
        reassurance: 'O cérebro autista processa informações de forma direta.',
        steps: [
          'Seja literal nas instruções',
          'Evite sarcasmo ou piadas de duplo sentido',
          'Explique o significado real se usar metáforas',
          'Use imagens para ilustrar conceitos abstratos'
        ],
        toAvoid: [
          'Não fique bravo se ele não entender a piada',
          'Não use frases figuradas no dia a dia',
          'Não ache que ele está sendo difícil'
        ],
        tip: 'Instruções diretas reduzem a confusão e a ansiedade.'
      },
      {
        id: 'pedidos',
        title: 'Dificuldade em pedir',
        keywords: ['dificuldade em pedir coisas', 'querer', 'água', 'comida', 'apontar'],
        explanation: 'A criança chora ou fica brava porque quer algo, mas não sabe pedir.',
        reassurance: 'A frustração de não ser compreendido é muito grande.',
        steps: [
          'Ofereça duas opções visuais para escolha',
          'Ensine a apontar para o que deseja',
          'Use sinais simples (como o de "comer")',
          'Diga o nome do objeto ao entregá-lo'
        ],
        toAvoid: [
          'Não tente adivinhar sem dar opções',
          'Não ignore o choro sem tentar entender',
          'Não dê tudo na mão sem tentativa de pedido'
        ],
        tip: 'Colocar objetos desejados à vista, mas fora de alcance, incentiva o pedido.'
      },
      {
        id: 'instrucoes_com',
        title: 'Dificuldade com instruções longas',
        keywords: ['dificuldade com instruções', 'ordens', 'tarefa', 'esquecer', 'confusão'],
        explanation: 'Se você pede "pegue o sapato e guarde no armário", ela só faz a primeira parte ou se perde.',
        reassurance: 'Processar múltiplas ordens exige muito da memória de trabalho.',
        steps: [
          'Dê uma instrução de cada vez',
          'Espere ela terminar antes de pedir outra',
          'Use apoio visual com fotos das tarefas',
          'Elogie cada pequeno passo concluído'
        ],
        toAvoid: [
          'Não dê várias ordens seguidas rapidamente',
          'Não grite se ela esquecer o pedido',
          'Não ache que ela está ignorando você'
        ],
        tip: 'O contato visual ou um toque leve antes da instrução garante que ela ouviu.'
      },
      {
        id: 'contato_visual_com',
        title: 'Evitar contato visual ao falar',
        keywords: ['evitar contato visual', 'olhar', 'conversa', 'rosto', 'fala'],
        explanation: 'A criança fala com você mas olha para o chão ou para o lado.',
        reassurance: 'Olhar e falar ao mesmo tempo pode ser exaustivo.',
        steps: [
          'Não exija que ela olhe nos olhos para falar',
          'Foque no que ela diz, não para onde olha',
          'Fique ao lado dela para uma conversa relaxada',
          'Valorize a tentativa de comunicação verbal'
        ],
        toAvoid: [
          'Não interrompa a fala para pedir o olhar',
          'Não segure o queixo dela para forçar o olhar',
          'Não ache que a falta de olhar significa mentira'
        ],
        tip: 'Muitas crianças se sentem mais seguras conversando enquanto fazem outra atividade.'
      },
      {
        id: 'assunto_unico',
        title: 'Falar apenas de um assunto',
        keywords: ['falar apenas de um assunto', 'hiperfoco', 'repetitivo', 'interesse', 'monotema'],
        explanation: 'A criança só quer falar sobre dinossauros ou trens, o tempo todo.',
        reassurance: 'O hiperfoco é uma fonte de prazer e segurança.',
        steps: [
          'Use o interesse dela para ensinar coisas novas',
          'Estabeleça momentos para falar do tema',
          'Mostre interesse genuíno no que ela sabe',
          'Tente fazer pontes suaves para outros assuntos'
        ],
        toAvoid: [
          'Não diga que o assunto é chato',
          'Não proíba a criança de falar sobre o tema',
          'Não ignore a fala dela sobre o interesse'
        ],
        tip: 'O hiperfoco é a melhor porta de entrada para novos aprendizados.'
      },
      {
        id: 'volume_voz',
        title: 'Dificuldade em controlar o volume',
        keywords: ['volume da voz', 'gritar', 'falar baixo', 'tom', 'barulho'],
        explanation: 'A criança fala muito alto em locais silenciosos ou muito baixo quando precisa ser ouvida.',
        reassurance: 'A percepção do próprio volume de voz pode estar alterada.',
        steps: [
          'Use sinais visuais para "alto" e "baixo"',
          'Modele o volume de voz que você deseja',
          'Brinque de "falar como leão" e "como gatinho"',
          'Explique sobre os volumes de cada ambiente'
        ],
        toAvoid: [
          'Não grite "fala baixo!" (você estará gritando)',
          'Não sinta vergonha se ela falar alto em público',
          'Não puna por um descontrole sensorial'
        ],
        tip: 'Um termômetro visual de volume ajuda a criança a entender o conceito abstrato.'
      },
      {
        id: 'sentimentos_com',
        title: 'Dificuldade em expressar sentimentos',
        keywords: ['expressar sentimentos', 'dor', 'tristeza', 'raiva', 'emoção'],
        explanation: 'A criança não consegue dizer se está com dor, triste ou brava, apenas demonstra agitação.',
        reassurance: 'Identificar emoções internas é um desafio complexo.',
        steps: [
          'Use um "termômetro das emoções" com desenhos',
          'Ajude-a a nomear o que parece estar sentindo',
          'Valide a emoção: "Parece que você está bravo"',
          'Use cores para representar sentimentos'
        ],
        toAvoid: [
          'Não diga "não foi nada" ou "pare com isso"',
          'Não ignore os sinais físicos de desconforto',
          'Não pressione por resposta verbal complexa'
        ],
        tip: 'Associar emoções a sensações físicas (ex: "coração batendo rápido") ajuda na identificação.'
      }
    ]
  }
};

// --- Components ---

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

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, loading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'list' | 'detail' | 'emergency' | 'emergencyDetail' | 'diary' | 'dashboard' | 'auth' | 'profile'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencySituation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastCrisisDuration, setLastCrisisDuration] = useState<number | null>(null);
  const [hasEndedCrisis, setHasEndedCrisis] = useState(false);

  // Diary State
  const [logs, setLogs] = useState<CrisisLog[]>(() => {
    const saved = localStorage.getItem('auticalma_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const getCrisisMessage = (seconds: number) => {
    if (seconds < 30) return "Respire. Você está aqui, isso já ajuda.";
    if (seconds < 60) return "Fique perto. Sua presença já acalma.";
    if (seconds < 120) return "Reduza estímulos. Menos luz, menos som.";
    if (seconds < 180) return "Evite falar muito. O silêncio ajuda a regular.";
    if (seconds < 300) return "A crise vai passar. Continue presente.";
    return "Você está fazendo o melhor possível. Continue.";
  };

  useEffect(() => {
    localStorage.setItem('auticalma_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-start timer when entering emergency screen
  useEffect(() => {
    if (currentScreen === 'emergency' && !isTimerRunning && elapsedTime === 0 && !lastCrisisDuration && !hasEndedCrisis) {
      setIsTimerRunning(true);
    }
  }, [currentScreen, isTimerRunning, elapsedTime, lastCrisisDuration, hasEndedCrisis]);

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
    return <DashboardPage onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'profile' && user) {
    return <ProfilePage onBack={() => setCurrentScreen('home')} />;
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
      />
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pauseTimer = () => setIsTimerRunning(false);
  const resumeTimer = () => setIsTimerRunning(true);
  
  const endCrisis = () => {
    setLastCrisisDuration(elapsedTime);
    setIsTimerRunning(false);
    setElapsedTime(0);
    setHasEndedCrisis(true);
  };

  const saveLog = (type: string = 'Não especificado') => {
    if (lastCrisisDuration === null) return;
    
    const newLog: CrisisLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('pt-BR'),
      type,
      duration: lastCrisisDuration
    };
    
    setLogs([newLog, ...logs]);
    setLastCrisisDuration(null);
  };

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
  };

  const handleSituationSelect = (situation: Situation, catId?: CategoryId) => {
    const categoryId = catId || selectedCategory;
    if (categoryId) setSelectedCategory(categoryId);
    setSelectedSituation(situation);
    setCurrentScreen('detail');
    setSearchTerm('');
  };

  const goBack = () => {
    if (currentScreen === 'detail') setCurrentScreen('list');
    else if (currentScreen === 'list') setCurrentScreen('home');
    else if (currentScreen === 'emergency') setCurrentScreen('home');
    else if (currentScreen === 'emergencyDetail') setCurrentScreen('emergency');
    else if (currentScreen === 'diary') setCurrentScreen('home');
    else if (currentScreen === 'profile') setCurrentScreen('home');
  };

  const reset = () => {
    setCurrentScreen('home');
    setSelectedCategory(null);
    setSelectedSituation(null);
    setSelectedEmergency(null);
  };

  return (
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
                <p className="text-slate-500 text-lg font-medium">
                  Como posso ajudar hoje?
                </p>
              </div>
              <div className="flex gap-2">
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
                        setCurrentScreen('home');
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
              onClick={() => {
                setElapsedTime(0);
                setLastCrisisDuration(null);
                setIsTimerRunning(false);
                setHasEndedCrisis(false);
                setCurrentScreen('emergency');
              }}
              className="w-full mb-6 p-6 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl shadow-md shadow-orange-50 flex items-center justify-center gap-4 transition-all active:scale-[0.98] group"
            >
              <Zap className="w-6 h-6 fill-current" />
              <span className="text-xl font-bold">Meu filho está em crise agora</span>
            </button>

            <button
              onClick={() => setCurrentScreen('diary')}
              className="w-full mb-14 p-4 text-slate-400 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:text-slate-500"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">Ver histórico de crises</span>
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
                      {filteredResults.map((result) => (
                        <button
                          key={result.id}
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
              {(Object.keys(APP_DATA) as CategoryId[]).map((key) => {
                const cat = APP_DATA[key];
                const accentColor = key === 'crise' ? 'text-orange-500' : key === 'socializacao' ? 'text-violet-500' : 'text-emerald-500';
                const accentBg = key === 'crise' ? 'bg-orange-50' : key === 'socializacao' ? 'bg-violet-50' : 'bg-emerald-50';
                
                return (
                  <button
                    key={cat.id}
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
                {APP_DATA[selectedCategory].situations.map((sit) => {
                  const isSelected = selectedSituation?.id === sit.id;
                  const category = APP_DATA[selectedCategory];
                  
                  return (
                    <button
                      key={sit.id}
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
                      <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
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
                      <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
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

                <div className="pt-8 border-t border-slate-100">
                  <p className="text-slate-500 text-sm font-bold text-center mb-6">Isso ajudou?</p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => alert('Obrigado pelo feedback!')}
                      className="px-10 py-3 bg-slate-50 text-slate-600 rounded-full font-bold text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-all active:scale-95"
                    >
                      Sim
                    </button>
                    <button 
                      onClick={() => alert('Obrigado pelo feedback! Vamos melhorar.')}
                      className="px-10 py-3 bg-slate-50 text-slate-600 rounded-full font-bold text-sm hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95"
                    >
                      Não
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={goBack}
                    className={`w-full py-5 rounded-2xl font-bold text-lg text-white shadow-lg transition-all active:scale-[0.98] ${selectedCategory ? APP_DATA[selectedCategory].actionBtnBgClass : 'bg-slate-800'}`}
                  >
                    Marcar como resolvido
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
                      <div key={i} className="flex gap-4 items-start">
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

                  {/* 4. TIMER (POR ÚLTIMO) */}
                  <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200 text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                      Crise em andamento
                    </p>
                    <div className="text-3xl font-mono font-bold text-slate-700 mb-4">
                      {formatTime(isTimerRunning || elapsedTime > 0 ? elapsedTime : (lastCrisisDuration || 0))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={isTimerRunning ? pauseTimer : resumeTimer}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                          isTimerRunning 
                          ? 'bg-white border-slate-200 text-slate-600' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {isTimerRunning ? 'Pausar' : 'Retomar'}
                      </button>
                      <button
                        onClick={endCrisis}
                        className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Encerrar crise
                      </button>
                    </div>
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
                  </div>

                  {lastCrisisDuration !== null && (
                    <div className="w-full p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Duração Total</p>
                        <p className="text-4xl font-bold text-slate-700">{formatTime(lastCrisisDuration)}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Salvar no diário como:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {EMERGENCY_DATA.map(item => (
                            <button
                              key={item.id}
                              onClick={() => saveLog(item.title)}
                              className="p-3 text-[10px] font-bold bg-slate-50 text-slate-600 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all"
                            >
                              {item.title}
                            </button>
                          ))}
                          <button
                            onClick={() => saveLog()}
                            className="p-3 text-[10px] font-bold bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all col-span-2"
                          >
                            Outro / Não especificado
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="w-full py-5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-base shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Voltar para início
                  </button>
                </motion.div>
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
          <Layout title="Diário de Crises" onBack={goBack}>
            <div className="space-y-6">
              {logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{log.date}</p>
                        <h4 className="font-bold text-slate-700">{log.type}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Duração</p>
                        <p className="text-lg font-bold text-orange-500">{formatTime(log.duration)}</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      if(confirm('Deseja limpar todo o histórico?')) setLogs([]);
                    }}
                    className="w-full py-6 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-rose-400 transition-colors"
                  >
                    Limpar histórico
                  </button>
                </div>
              ) : (
                <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">Nenhuma crise registrada.</p>
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
                    <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
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
                    <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm items-start">
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

              <div className="pt-6">
                <button
                  onClick={() => setCurrentScreen('emergency')}
                  className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 active:scale-[0.98] transition-all"
                >
                  Marcar como resolvido
                </button>
              </div>

              {/* Timer for Detail View - Moved to bottom and made less prominent */}
              {(isTimerRunning || elapsedTime > 0) && (
                <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between mt-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`} />
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {isTimerRunning ? 'Crise em andamento' : 'Timer pausado'}
                      </p>
                      <p className="text-xl font-mono font-bold text-slate-700 leading-none">
                        {formatTime(elapsedTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={isTimerRunning ? pauseTimer : resumeTimer}
                      className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        endCrisis();
                        setCurrentScreen('emergency');
                      }}
                      className="p-2 bg-orange-500 text-white rounded-lg shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
