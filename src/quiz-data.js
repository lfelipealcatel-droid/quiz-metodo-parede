// Microcopies do E3 (tipo de barriga) — usadas em WelcomeSteps StepBelly
export const microcopies = {
  bellyLocation: {
    'alta':
      'Barriga alta = sinal clássico de cortisol elevado + metabolismo travado.\n\nVocê não precisa de MAIS exercício. Precisa do OPOSTO — e vamos te mostrar o caminho.',
    'gravida':
      'Esse é o formato mais específico de todos.\n\nÉ também o tipo que responde MAIS RÁPIDO ao caminho certo — porque a barriga reduz visivelmente em dias quando ataca a causa real.',
    'baixa':
      'Padrão típico de queda de estrogênio + enfraquecimento da musculatura que sustenta a barriga.\n\nComum após gestação ou depois dos 45. Existe um caminho específico que reativa essa região SEM impacto.',
    'inchada':
      'Barriga que varia ao longo do dia = INFLAMAÇÃO, não gordura.\n\nIsso muda tudo. Você vai sentir resultado em DIAS, não semanas — quando atacar a causa real.',
  },
};

// ─── Pontuação ─────────────────────────────────────────────────────────────────
export function calculateScores(answers) {
  let QMH = 0, CE = 0, INF = 0;

  // QMH — Queda Metabólico-Hormonal
  const ageMap = { '40-44': 1, '45-49': 2, '50-54': 3, '55+': 4 };
  QMH += ageMap[answers.age] || 0;
  if (answers.bodyType === 'magra-engordou') QMH += 3;
  else if (answers.bodyType === 'curva-anormal') QMH += 2;
  if (answers.tempo_mudanca === 'alguns_meses') QMH += 3;
  if (answers.frustration === 'sim-exatamente') QMH += 2;
  if (answers.symptoms.includes('calorao_fogacho')) QMH += 1;
  if (answers.symptoms.includes('ressecamento_libido')) QMH += 1;

  // CE — Cortisol/Estresse
  if (
    answers.emotionalImpact.includes('isolamento') ||
    answers.emotionalImpact.includes('nao-reconheco')
  ) CE += 2;
  if (answers.tempo_mudanca === 'poucas_semanas') CE += 3;
  else if (answers.tempo_mudanca === 'perdi_nocao') CE += 2;
  if (answers.pastAttempts.includes('musculacao')) CE += 2;
  if (answers.pastAttempts.includes('dieta')) CE += 1;
  if (answers.frustration === 'corpo-virou') CE += 2;
  if (answers.symptoms.includes('insonia')) CE += 1;
  if (answers.symptoms.includes('irritabilidade')) CE += 1;

  // INF — Inflamação
  if (answers.bellyLocation === 'inchada') INF += 4;
  else if (answers.bellyLocation === 'alta') INF += 2;
  if (answers.pastAttempts.includes('acucar') && answers.bellyLocation === 'inchada') INF += 2;
  if (answers.tempo_mudanca === 'mais_um_ano') INF += 3;
  if (answers.symptoms.includes('inchaco_retencao')) INF += 1;
  if (answers.symptoms.includes('cansaco')) INF += 1;

  // Variação de diagnóstico
  let variacao;
  if (INF >= 5 && answers.bellyLocation === 'inchada') {
    variacao = 'C';
  } else if (QMH >= 9 && (
    answers.symptoms.includes('calorao_fogacho') ||
    answers.symptoms.includes('ressecamento_libido')
  )) {
    variacao = 'A';
  } else if (CE >= 6) {
    variacao = 'B';
  } else if (QMH >= 7) {
    variacao = 'A';
  } else {
    if (CE > QMH && CE > INF) variacao = 'B';
    else if (INF > QMH) variacao = 'C';
    else variacao = 'A';
  }

  // Valores derivados do painel hormonal
  let X_metabolismo;
  if (QMH >= 10) X_metabolismo = 25;
  else if (QMH >= 8) X_metabolismo = 32;
  else if (QMH >= 6) X_metabolismo = 40;
  else X_metabolismo = 48;

  let Y_cortisol;
  if (CE >= 6) Y_cortisol = 85;
  else if (CE >= 4) Y_cortisol = 70;
  else if (CE >= 2) Y_cortisol = 55;
  else Y_cortisol = 42;

  let nivel_inflamacao;
  if (INF >= 5) nivel_inflamacao = 'alto';
  else if (INF >= 3) nivel_inflamacao = 'elevado';
  else nivel_inflamacao = 'moderado';

  // IMC
  const altura_m = (answers.height || 165) / 100;
  const peso = answers.weight || 70;
  const imc_valor = +(peso / (altura_m * altura_m)).toFixed(1);
  let imc_classificacao, imc_cor;
  if (imc_valor < 18.5) { imc_classificacao = 'Abaixo do peso'; imc_cor = '#888'; }
  else if (imc_valor < 25) { imc_classificacao = 'Peso saudável'; imc_cor = '#2E7D32'; }
  else if (imc_valor < 30) { imc_classificacao = 'Sobrepeso'; imc_cor = '#F77F00'; }
  else if (imc_valor < 35) { imc_classificacao = 'Obesidade I'; imc_cor = '#E63946'; }
  else if (imc_valor < 40) { imc_classificacao = 'Obesidade II'; imc_cor = '#E63946'; }
  else { imc_classificacao = 'Obesidade III'; imc_cor = '#E63946'; }

  // Fase hormonal pela idade exata
  const idade = answers.idade || 47;
  let fase_hormonal;
  if (idade <= 44) fase_hormonal = 'Pré-menopausa';
  else if (idade <= 52) fase_hormonal = 'Perimenopausa';
  else fase_hormonal = 'Pós-menopausa';

  // Projeção de resultado — base por IMC
  let projectionMin, projectionMax;
  if (imc_valor < 25)      { projectionMin = 3; projectionMax = 5; }
  else if (imc_valor < 30) { projectionMin = 5; projectionMax = 7; }
  else if (imc_valor < 35) { projectionMin = 6; projectionMax = 9; }
  else                     { projectionMin = 7; projectionMax = 10; }

  // Ajuste por barriga inchada/inflamada
  const tipo_barriga = answers.bellyLocation;
  if (tipo_barriga === 'inchada' || INF >= 5) {
    projectionMax = Math.min(projectionMax + 1, 10);
  }

  // Travas de segurança
  projectionMin = Math.max(projectionMin, 3);
  projectionMax = Math.min(projectionMax, 10);
  if (projectionMax < projectionMin) projectionMax = projectionMin + 1;

  return {
    variacao,
    X_metabolismo,
    Y_cortisol,
    nivel_inflamacao,
    imc_valor,
    imc_classificacao,
    imc_cor,
    fase_hormonal,
    projectionMin,
    projectionMax,
    scores: { QMH, CE, INF },
  };
}

// ─── Helpers de label (usados no perfil E22) ───────────────────────────────────
export function getAgeFase(age) {
  if (age === '40-44') return 'Pré-menopausa';
  if (age === '45-49' || age === '50-54') return 'Perimenopausa';
  return 'Pós-menopausa';
}

export function getBellyLabel(loc) {
  const m = {
    alta: 'Alta, perto do peito',
    gravida: 'Frente, formato "grávida"',
    baixa: 'Baixa, abdômen inferior',
    inchada: 'Inchaço variável',
  };
  return m[loc] || '—';
}

export function getLimitLabel(arr) {
  if (!arr || arr.length === 0 || (arr.length === 1 && arr.includes('nenhuma'))) {
    return 'Sem restrições';
  }
  const m = {
    joelho: 'Joelho sensível',
    lombar: 'Dor lombar',
    bursite: 'Bursite no quadril',
    diastase: 'Diástase',
    pes: 'Dor nos pés',
  };
  return arr.filter(x => x !== 'nenhuma').map(x => m[x]).join(', ');
}
