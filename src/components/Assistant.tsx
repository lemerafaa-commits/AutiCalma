import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Bot, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { APP_DATA } from '../constants';
import { Situation, CategoryId } from '../types';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  recommendation?: {
    title: string;
    whatIsHappening: string;
    whatToDo: string[];
    whatToAvoid: string[];
    relatedSituation?: Situation;
    isFallback?: boolean;
  };
  feedback?: 'positive' | 'negative' | null;
}

interface AssistantProps {
  userPlan: 'free' | 'plus' | 'premium';
  onUpgrade: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const Assistant: React.FC<AssistantProps> = ({ userPlan, onUpgrade, onClose, isOpen }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastMatches, setLastMatches] = useState<{ id: string; label: string; priority: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Lógica do Pseudo Agente
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.text,
        recommendation: response.recommendation
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remover acentos
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?!]/g, "") // Remover pontuação
      .replace(/\s{2,}/g, " ") // Limpar espaços duplicados
      .trim();
  };

  const generateResponse = (input: string) => {
    const normalizedInput = normalizeText(input);
    
    // Mapeamento de palavras-chave para IDs de situações reais no APP_DATA
    // Prioridades: 1 (Alta/Risco Físico), 2 (Média/Crise-Desregulação), 3 (Baixa/Frustração-Social)
    const KEYWORD_MAP: { id: string; keywords: string[]; priority: number; label: string }[] = [
      {
        id: 'autoagressao_crise',
        label: 'Autoagressão',
        priority: 1,
        keywords: ['se batendo', 'batendo a cabeca', 'se machucando', 'se bate', 'autoagressao', 'auto agressao', 'se agredindo', 'se jogando', 'batendo em si mesmo', 'se morder', 'se morde']
      },
      {
        id: 'agressividade', // Mapeado para autoagressão como placeholder de risco se não houver agressão a terceiros explícita
        label: 'Agressão',
        priority: 1,
        keywords: ['batendo em mim', 'me batendo', 'agressao', 'agredindo', 'batendo nos outros', 'chutando']
      },
      {
        id: 'sensorial_crise',
        label: 'Crise Sensorial (Sobrecarga)',
        priority: 2,
        keywords: ['barulho', 'muito barulho', 'tampando os ouvidos', 'tapando o ouvido', 'luz forte', 'muita luz', 'som alto', 'sensorial', 'sobrecarga', 'incomodado com som', 'incomodado com luz']
      },
      {
        id: 'gritando',
        label: 'Crise / Gritos',
        priority: 2,
        keywords: ['gritando', 'gritos', 'berrando', 'berro', 'berrando muito', 'gritar']
      },
      {
        id: 'choro',
        label: 'Choro Intenso',
        priority: 2,
        keywords: ['chorando', 'chorando muito', 'nao para de chorar', 'choro', 'chorando sem parar', 'chorando demais']
      },
      {
        id: 'desregulacao', // Mapeado para choro/gritos como desregulação
        label: 'Desregulação Emocional',
        priority: 2,
        keywords: ['nervosa', 'nervoso', 'descontrolado', 'desregulado', 'desregulacao', 'nao para', 'agitado']
      },
      {
        id: 'publico',
        label: 'Crise em Local Público',
        priority: 2,
        keywords: ['mercado', 'shopping', 'rua', 'local publico', 'em publico', 'no mercado', 'no shopping', 'saiu de casa']
      },
      {
        id: 'telas_crise',
        label: 'Retirada de Eletrônicos',
        priority: 2,
        keywords: ['tirou o celular', 'tirou o tablet', 'tirou a tela', 'ficou bravo sem eletronico', 'crise sem celular', 'crise sem tablet']
      },
      {
        id: 'rotina_crise',
        label: 'Mudança de Rotina',
        priority: 3,
        keywords: ['mudou a rotina', 'mudanca de rotina', 'ficou irritado porque mudou', 'nao aceitou mudanca', 'saiu da rotina']
      },
      {
        id: 'frustracao_ativ',
        label: 'Frustração Leve',
        priority: 3,
        keywords: ['ficou frustrado', 'jogou as coisas', 'irritado com atividade', 'nao conseguiu fazer', 'ficou bravo tentando', 'tentando fazer', 'frustrada', 'frustrado']
      },
      {
        id: 'comunicacao',
        label: 'Dificuldade de Comunicação',
        priority: 3,
        keywords: ['nao fala', 'nao responde', 'nao me entende', 'nao consegue se comunicar', 'dificuldade de comunicar', 'ecolalia']
      },
      {
        id: 'socializacao',
        label: 'Dificuldade de Socialização',
        priority: 3,
        keywords: ['nao quer brincar', 'evita pessoas', 'nao quer interagir', 'se isola', 'nao gosta de gente', 'socializacao']
      }
    ];

    // Palavras que indicam continuação/contexto
    const CONTINUATION_WORDS = ['continua', 'segue', 'ainda', 'piorando', 'seguindo', 'mantem', 'está'];
    const isContinuation = CONTINUATION_WORDS.some(word => normalizedInput.includes(word)) && normalizedInput.split(' ').length <= 4;

    // Detectar todos os matches atuais
    let matches = KEYWORD_MAP.filter(item => 
      item.keywords.some(kw => normalizedInput.includes(normalizeText(kw)))
    );

    // Se for uma continuação e não houver novos matches claros, usar a memória
    if (matches.length === 0 && isContinuation && lastMatches.length > 0) {
      matches = lastMatches.map(lm => ({
        id: lm.id,
        label: lm.label,
        priority: lm.priority,
        keywords: [] // não precisamos de keywords aqui
      }));
    }

    // Se houver matches, resolver por prioridade
    if (matches.length > 0) {
      // Ordenar por prioridade (menor número = maior prioridade)
      const sortedMatches = [...matches].sort((a, b) => a.priority - b.priority);
      const uniqueSortedMatches = Array.from(new Set(sortedMatches.map(m => m.id)))
        .map(id => sortedMatches.find(m => m.id === id)!);

      // Atualizar memória
      setLastMatches(uniqueSortedMatches.map(m => ({ id: m.id, label: m.label, priority: m.priority })));

      const principalMatch = uniqueSortedMatches[0];
      const secondaryMatches = uniqueSortedMatches.slice(1);

      // Buscar no APP_DATA a situação correspondente ao principal match
      const allSituations = Object.values(APP_DATA).flatMap(cat => cat.situations);
      
      // Mapeamento específico para casos de agressividade/desregulação que não tem ID direto
      let searchId = principalMatch.id;
      if (searchId === 'agressividade') searchId = 'autoagressao_crise';
      if (searchId === 'desregulacao') searchId = 'choro';

      const foundSituation = allSituations.find(sit => sit.id === searchId);

      if (foundSituation) {
        let introText = "";
        if (principalMatch.priority === 1) {
          introText = `Se a criança está ${principalMatch.label.toLowerCase()}, o foco principal é a segurança física absoluta. `;
        } else {
          introText = `Entendi. Para lidar com ${principalMatch.label.toLowerCase()}, o mais importante é manter a calma. `;
        }

        if (secondaryMatches.length > 0) {
          introText += `\n\nAlém disso, notamos que você mencionou ${secondaryMatches.map(m => m.label.toLowerCase()).join(' e ')}, o que pode indicar um quadro de desregulação.`;
        }

        return {
          text: introText,
          recommendation: {
            title: foundSituation.title,
            whatIsHappening: foundSituation.explanation,
            whatToDo: foundSituation.steps,
            whatToAvoid: foundSituation.toAvoid,
            relatedSituation: foundSituation
          }
        };
      }
    }

    // Fallback absoluto se nada for encontrado nem na memória
    return {
      text: "Não consegui identificar exatamente a situação atual no seu relato, mas tente estas orientações fundamentais de segurança e regulação:",
      recommendation: {
        title: "Orientação Geral de Segurança",
        isFallback: true,
        whatIsHappening: "Em momentos de incerteza ou desregulação não identificada, a prioridade é sempre o bem-estar físico e a redução de estímulos.",
        whatToDo: [
          "Mantenha a calma e respire fundo visivelmente",
          "Reduza estímulos (luz, barulho, pessoas extras)",
          "Garanta que o ambiente não ofereça riscos físicos",
          "Dê espaço e tempo para a autorregulação, permanecendo apenas presente"
        ],
        whatToAvoid: [
          "Não grite ou tente 'educar' no momento do pico",
          "Não force contato físico se houver resistência",
          "Não demonstre pânico ou pressa para resolver a situação"
        ]
      }
    };
  };

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: type } : msg
    ));
    
    // Salvar no localStorage para persistência futura
    const currentHistory = JSON.parse(localStorage.getItem('auticalma_assistant_feedback') || '[]');
    currentHistory.push({ messageId, type, date: new Date().toISOString() });
    localStorage.setItem('auticalma_assistant_feedback', JSON.stringify(currentHistory));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[2000] flex flex-col max-w-md mx-auto bg-slate-50 font-sans"
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-none mb-1">Ajuda rápida</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assistente Virtual</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Access Control Overlay for FREE */}
      {userPlan === 'free' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-500 mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ajuda personalizada disponível no plano Plus</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Descreva o que está acontecendo e receba orientação rápida baseada no momento do seu filho.
          </p>
          <div className="w-full space-y-3">
            <button 
              onClick={onUpgrade}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95"
            >
              Ver planos
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-bold transition-all active:scale-95"
            >
              Agora não
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface for PLUS/PREMIUM */}
      {userPlan !== 'free' && (
        <>
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6"
          >
            {messages.length === 0 && (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mx-auto text-orange-500 shadow-sm">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold">Como posso ajudar agora?</p>
                  <p className="text-slate-400 text-xs px-10">Descreva o comportamento ou situação que está ocorrendo.</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.type === 'user' 
                  ? 'bg-orange-500 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none whitespace-pre-wrap'
                }`}>
                  <p className="text-sm font-medium">{msg.text}</p>
                </div>

                {msg.recommendation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
                  >
                    <div className="p-5 space-y-6">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">O que pode estar acontecendo</h4>
                        <p className="text-sm font-bold text-slate-900 leading-snug">{msg.recommendation.whatIsHappening}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                          <ThumbsUp className="w-3 h-3" /> O que fazer agora
                        </h4>
                        <div className="space-y-2">
                          {msg.recommendation.whatToDo.map((step, i) => (
                            <div key={`rec-todo-${msg.id}-${i}`} className="flex gap-3 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl">
                              <span className="text-emerald-500 text-xs font-bold leading-tight">•</span>
                              <p>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                          <ThumbsDown className="w-3 h-3" /> O que evitar
                        </h4>
                        <div className="space-y-2">
                          {msg.recommendation.whatToAvoid.map((avoid, i) => (
                            <div key={`rec-avoid-${msg.id}-${i}`} className="flex gap-3 text-xs font-semibold text-slate-600 bg-rose-50/30 p-3 rounded-xl border border-rose-50">
                              <span className="text-rose-400 text-xs font-bold leading-tight">•</span>
                              <p>{avoid}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feedback Area */}
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 text-center mb-3">Essa orientação ajudou?</p>
                        <div className="flex gap-3 justify-center">
                          <button 
                            disabled={!!msg.feedback}
                            onClick={() => handleFeedback(msg.id, 'positive')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
                              msg.feedback === 'positive' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-white border-slate-100 text-slate-400 active:scale-95'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-xs font-bold font-sans">Sim</span>
                          </button>
                          <button 
                            disabled={!!msg.feedback}
                            onClick={() => handleFeedback(msg.id, 'negative')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
                              msg.feedback === 'negative' 
                              ? 'bg-rose-50 border-rose-100 text-rose-600' 
                              : 'bg-white border-slate-100 text-slate-400 active:scale-95'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-xs font-bold font-sans tracking-tight">Não</span>
                          </button>
                        </div>
                      </div>

                      {msg.recommendation.isFallback && (
                        <div className="pt-2 px-2 pb-2">
                          <button 
                            onClick={onClose}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all group"
                          >
                            <span className="text-xs font-bold">Ver todos os conteúdos</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-orange-200 transition-colors">
              <input 
                type="text"
                placeholder="Ex: meu filho está gritando..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100 active:scale-95 disabled:grayscale disabled:opacity-30 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {/* 
              No futuro, esta camada será substituída por agente com IA e personalização baseada em histórico e perfil.
              Para o plano PREMIUM, este motor poderá fazer chamadas diretas ao Gemini ou outra LLM.
            */}
          </div>
        </>
      )}
    </motion.div>
  );
};
