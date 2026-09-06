// Camada de analytics append-only do Quiz VITTALLE.
// Regra de ouro: isto só OBSERVA. Nunca deve lançar exceção nem atrasar o quiz.
// Sem env vars ou com Supabase fora do ar, todas as funções abaixo viram no-op silencioso
// (com console.warn) — o quiz continua funcionando 100% normalmente.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[analytics] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes — analytics em modo no-op.');
    return null;
  }
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  } catch (err) {
    // Nunca deixa uma env var mal formatada derrubar o quiz.
    console.warn('[analytics] falha ao criar client Supabase — analytics em modo no-op.', err);
    return null;
  }
}

const supabase = createSupabaseClient();

// ─── Sessão ──────────────────────────────────────────────────────────────────
const SESSION_KEY = 'vittalle_quiz_session';
const UTMS_KEY = 'vittalle_quiz_utms';
const SESSION_START_SENT_KEY = 'vittalle_quiz_session_start_sent';

let memorySessionId = null;

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (err) {
    if (!memorySessionId) memorySessionId = crypto.randomUUID();
    return memorySessionId;
  }
}

// ─── Captura de UTMs / tracking de origem (1ª carga) ──────────────────────────
// Somente parâmetros de atribuição — NUNCA nome/cm_min/cm_max (esses são de saída, não de entrada).
const ALLOWED_TRACKING_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'src', 'sck', 'vtid',
];

function captureUtms() {
  try {
    const stored = sessionStorage.getItem(UTMS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    // sessionStorage indisponível — segue sem cache, captura direto da URL abaixo
  }

  const utms = {};
  try {
    const params = new URLSearchParams(window.location.search);
    ALLOWED_TRACKING_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) utms[key] = value;
    });
  } catch (err) {
    console.warn('[analytics] falha ao ler UTMs da URL:', err);
  }

  try {
    sessionStorage.setItem(UTMS_KEY, JSON.stringify(utms));
  } catch (err) {
    // ignora — pior caso, recaptura na próxima chamada
  }

  return utms;
}

// ─── Insert genérico ───────────────────────────────────────────────────────────
async function track(eventType, data = {}) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('quiz_events').insert({
      session_id: getSessionId(),
      event_type: eventType,
      ...data,
    });
    if (error) {
      console.warn('[analytics] insert falhou:', eventType, error.message);
    }
  } catch (err) {
    console.warn('[analytics] erro inesperado no insert:', eventType, err);
  }
}

// ─── session_start (idempotente por sessão) ───────────────────────────────────
let sessionStartSent = false;

export function trackSessionStart() {
  if (sessionStartSent) return;
  try {
    if (sessionStorage.getItem(SESSION_START_SENT_KEY)) {
      sessionStartSent = true;
      return;
    }
  } catch (err) {
    // sem sessionStorage — segue só com a flag em memória
  }
  sessionStartSent = true;
  try {
    sessionStorage.setItem(SESSION_START_SENT_KEY, '1');
  } catch (err) {
    // ignora
  }
  track('session_start', { utms: captureUtms() });
}

// ─── step_entered (anti-duplicação por sessão de página) ─────────────────────
const seenSteps = new Set();

export function trackStep(order, name, type) {
  if (seenSteps.has(order)) return;
  seenSteps.add(order);
  track('step_entered', { step_order: order, step_name: name, step_type: type });
}

// ─── answer (com debounce opcional pra slider/texto) ──────────────────────────
const debounceTimers = {};

export function trackAnswer(questionId, questionText, answerValue, answerLabel, debounceMs = 0) {
  const payload = {
    question_id: questionId,
    question_text: questionText,
    answer_value: answerValue,
    answer_label: answerLabel,
  };

  if (debounceMs > 0) {
    if (debounceTimers[questionId]) clearTimeout(debounceTimers[questionId]);
    debounceTimers[questionId] = setTimeout(() => {
      delete debounceTimers[questionId];
      track('answer', payload);
    }, debounceMs);
    return;
  }

  track('answer', payload);
}

// ─── diagnosis (objeto completo de calculateScores) ───────────────────────────
export function trackDiagnosis(results) {
  if (!results) return;
  track('diagnosis', { payload: results, diagnosis_code: results.variacao ?? null });
}

// ─── completed (idempotente) ──────────────────────────────────────────────────
let completedSent = false;

export function trackCompleted() {
  if (completedSent) return;
  completedSent = true;
  track('completed', {});
}

// ─── cta_click — chamado antes do redirect final, com teto de 300ms ──────────
export async function trackCtaClick() {
  if (!supabase) return;
  try {
    await Promise.race([
      track('cta_click', {}),
      new Promise((resolve) => setTimeout(resolve, 300)),
    ]);
  } catch (err) {
    // nunca deve impedir o redirect
  }
}

// ─── Metadados das etapas (pra step_entered) ──────────────────────────────────
// name = componente responsável pelo step; type = categoria pra dashboard.
export const STEP_META = {
  0:  { name: 'WelcomeAge',        type: 'pergunta' },
  1:  { name: 'StepSocialProof',   type: 'conteudo' },
  2:  { name: 'StepBodyType',      type: 'pergunta' },
  3:  { name: 'StepBelly',         type: 'pergunta' },
  4:  { name: 'StepProof',         type: 'conteudo' },
  5:  { name: 'StepPastAttempts',  type: 'pergunta' },
  6:  { name: 'StepImpact',        type: 'pergunta' },
  7:  { name: 'StepEmotionalBridge', type: 'conteudo' },
  8:  { name: 'StepBodyChange',    type: 'pergunta' },
  9:  { name: 'StepBelief',        type: 'pergunta' },
  10: { name: 'StepSymptoms',      type: 'pergunta' },
  11: { name: 'StepFrustration',   type: 'pergunta' },
  12: { name: 'StepLoading1',      type: 'loading' },
  13: { name: 'StepDiagnosis',     type: 'resultado' },
  14: { name: 'StepHeight',        type: 'pergunta' },
  15: { name: 'StepWeight',        type: 'pergunta' },
  16: { name: 'StepAge',           type: 'pergunta' },
  17: { name: 'StepLimitations',   type: 'pergunta' },
  18: { name: 'StepRoutine',       type: 'pergunta' },
  19: { name: 'StepAcceptance',    type: 'pergunta' },
  20: { name: 'StepLoading2',      type: 'loading' },
  21: { name: 'StepProjection',    type: 'resultado' },
  22: { name: 'StepName',          type: 'pergunta' },
  23: { name: 'StepFutureFear',    type: 'pergunta' },
  24: { name: 'StepCommitment',    type: 'pergunta' },
  25: { name: 'StepFinalLoading',  type: 'loading' },
  26: { name: 'StepProfile',       type: 'resultado_cta_final' },
};

// ─── Metadados das perguntas (pra answer) ─────────────────────────────────────
// Chave = campo em `answers` no Quiz.jsx. questionText copiado literalmente do componente-fonte.
// answers = null para texto livre / slider (o valor bruto já é o label, formatado abaixo).
// debounce = true para slider/texto (agrupa digitação/arraste antes de gravar).
export const QUESTION_LABELS = {
  age: {
    questionText: 'Selecione sua faixa etária para começar:',
    answers: { '40-44': '40–44 anos', '45-49': '45–49 anos', '50-54': '50–54 anos', '55+': '55 anos ou mais' },
  },
  bodyType: {
    questionText: 'Como está seu corpo agora?',
    answers: {
      'magra-engordou': 'Era magra e engordou',
      'curva-anormal': 'Curva anormal',
      'acima-peso': 'Acima do peso',
      'so-barriga': 'Só a barriga',
    },
  },
  bellyLocation: {
    questionText: 'Sua barriga está concentrada onde?',
    answers: { alta: 'Barriga alta', gravida: 'Formato grávida', baixa: 'Barriga baixa', inchada: 'Inchada' },
  },
  pastAttempts: {
    questionText: 'O que você JÁ tentou e não funcionou?',
    answers: {
      dieta: 'Dieta', musculacao: 'Musculação', caminhada: 'Caminhada',
      acucar: 'Cortar açúcar', caneta: 'Caneta emagrecedora', nenhuma: 'Nenhuma',
    },
  },
  emotionalImpact: {
    questionText: 'Como essa barriga tem afetado sua vida?',
    answers: {
      fotos: 'Evita fotos', roupas: 'Roupas não servem', 'gravida-perg': 'Perguntam se está grávida',
      'nao-reconheco': 'Não me reconheço', isolamento: 'Isolamento',
    },
  },
  tempo_mudanca: {
    questionText: 'Em quanto tempo você sentiu que seu corpo mudou?',
    answers: {
      poucas_semanas: 'Poucas semanas', alguns_meses: 'Alguns meses',
      mais_um_ano: 'Mais de um ano', perdi_nocao: 'Perdi a noção',
    },
  },
  belief: {
    questionText: 'Você acredita que pra perder a barriga depois dos 40 você precisa:',
    answers: { carboidrato: 'Cortar carboidrato', cardio: 'Fazer cardio', caneta: 'Caneta', nenhuma: 'Nenhuma' },
  },
  symptoms: {
    questionText: 'Quais desses sintomas você sente HOJE?',
    answers: {
      calorao_fogacho: 'Calorão/fogacho', cansaco: 'Cansaço', insonia: 'Insônia',
      irritabilidade: 'Irritabilidade', ressecamento_libido: 'Ressecamento/libido', inchaco_retencao: 'Inchaço/retenção',
    },
  },
  frustration: {
    questionText: 'Você sente que mesmo se esforçando, seu corpo deixou de responder como antes?',
    answers: { 'sim-exatamente': 'Sim, exatamente', 'mais-ou-menos': 'Mais ou menos', 'corpo-virou': 'Meu corpo virou outro' },
  },
  height: {
    questionText: 'Qual é a sua altura?',
    answers: null,
    debounce: true,
    formatLabel: (v) => `${v} cm`,
  },
  weight: {
    questionText: 'E qual é o seu peso atual?',
    answers: null,
    debounce: true,
    formatLabel: (v) => `${v} kg`,
  },
  idade: {
    questionText: 'Qual é a sua idade exata?',
    answers: null,
    debounce: true,
    formatLabel: (v) => `${v} anos`,
  },
  limitations: {
    questionText: 'Você tem alguma dessas limitações?',
    answers: { joelho: 'Joelho', lombar: 'Lombar', bursite: 'Bursite', diastase: 'Diástase', pes: 'Pés', nenhuma: 'Nenhuma' },
  },
  routine: {
    questionText: 'Como é seu dia a dia hoje?',
    answers: { fora: 'Trabalha fora', casa: 'Trabalha em casa', familia: 'Cuida da família', aposentada: 'Aposentada' },
  },
  acceptance: {
    questionText: 'Você está pronta para ver o que esse protocolo pode fazer pelo seu corpo?',
    answers: { sim: 'Sim', testar: 'Quero testar', topo: 'Topo' },
  },
  name: {
    questionText: 'Pra finalizar seu protocolo personalizado, como podemos te chamar?',
    answers: null,
    debounce: true,
  },
  futureFear: {
    questionText: 'Se nada mudar nos próximos 6 meses, como você imagina que vai estar?',
    answers: { piorar: 'Vai piorar', saude: 'Medo pela saúde', triste: 'Triste', 'sem-reagir': 'Sem reagir' },
  },
  commitment: {
    questionText: 'Você está disposta a dedicar apenas 8 minutos por dia nos próximos 21 dias para reverter isso?',
    answers: { sim: 'Sim', tentar: 'Vou tentar' },
  },
};

export function resolveAnswerLabel(field, value) {
  const meta = QUESTION_LABELS[field];
  if (!meta) return value;
  if (meta.formatLabel) return meta.formatLabel(value);
  if (meta.answers) return meta.answers[value] ?? value;
  return value;
}
