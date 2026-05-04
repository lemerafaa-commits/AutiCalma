import React from 'react';
import { AlertCircle, Users, MessageCircle } from 'lucide-react';
import { Category, CategoryId, EmergencySituation, CrisisLevel } from './types';

export const CRISIS_LEVEL_MAP: Record<string, CrisisLevel> = {
  'crise': 'moderado',
  'sensorial': 'moderado',
  'sensorial_crise': 'moderado',
  'socializacao': 'leve',
  'comunicacao': 'leve',
  'autoagressao': 'grave',
  'autoagressao_crise': 'grave',
  'gritos': 'moderado',
  'publico': 'moderado',
};

export const EMERGENCY_DATA: EmergencySituation[] = [
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
    tip: 'O silêncio é the melhor remédio para a sobrecarga sensorial.'
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

export const APP_DATA: Record<CategoryId, Category> = {
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
        toAvoid: ['Não force the enfrentamento do estímulo', 'Não ache que é teimosia', 'Não fale muito durante a crise'],
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
          'Não segure o rosto para forçar the olhar',
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
          'Não segure o queixo dela para forçar the olhar',
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
