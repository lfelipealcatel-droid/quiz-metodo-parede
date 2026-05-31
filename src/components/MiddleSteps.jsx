import { useState, useEffect, useRef } from 'react';

// ─── E5 — O que Já Tentou ──────────────────────────────────────────────────────

const singleMicro = {
  dieta: `Dieta restritiva em mulher 40+ desregula ainda mais os hormônios e desacelera o metabolismo.\n\nPor isso o peso volta multiplicado. Não é sua falta de disciplina — é o corpo se defendendo. Você precisa de outro caminho, não de menos comida.`,
  musculacao: `Agora faz sentido por que não funcionou.\n\nMusculação intensa SOBE cortisol — e cortisol alto trava justamente a queima de gordura abdominal em mulher 40+. Você estava atacando o problema com o que PIORA o problema. Não foi você. Foi estratégia errada pra sua fase.`,
  caminhada: `Caminhada é ótima pra saúde — mas não toca em nenhuma das 3 pontas do triângulo hormonal.\n\nNão reativa o metabolismo, não baixa cortisol, não reduz inflamação na medida certa. Por isso ela isoladamente nunca resolve a barriga depois dos 40.`,
  acucar: `Cortar açúcar e farinha ajuda — mas não resolve sozinho.\n\nA inflamação até reduz, mas seu metabolismo e seus hormônios continuam travados. E enquanto eles continuarem assim, a barriga não cede — não importa o que você tire do prato.`,
  caneta: `Caneta queima MÚSCULO — e mulher 40+ já está perdendo músculo naturalmente (sarcopenia). Resultado: metabolismo cai ainda mais, e quando você para, a barriga volta dobrada.\n\nÉ a solução que ataca o sintoma e piora a causa.`,
  nenhuma: `Boa — você não desperdiçou energia na estratégia errada. Seu resultado tende a ser ainda mais rápido com o caminho certo.`,
};

const linhaCombo = {
  dieta:      'Dieta restritiva desregulou ainda mais seus hormônios e travou seu metabolismo.',
  musculacao: 'Musculação intensa subiu seu cortisol — e cortisol alto trava a queima de gordura abdominal.',
  caminhada:  'Caminhada é boa pra saúde, mas sozinha não reativa o metabolismo nem baixa o cortisol.',
  acucar:     'Cortar açúcar e farinha reduziu parte da inflamação — mas sozinho não ataca hormônio nem metabolismo.',
  caneta:     'Caneta queimou músculo (que você já estava perdendo naturalmente) e quando parou, a barriga voltou dobrada.',
};

function getMicroE5(selected) {
  if (selected.length === 0) return null;
  if (selected.includes('nenhuma')) return singleMicro.nenhuma;
  if (selected.length === 1) return singleMicro[selected[0]] ?? null;

  const headline = selected.length >= 3
    ? 'Agora faz sentido por que nada funcionou.'
    : 'Agora faz sentido por que não funcionou.';
  const lines = selected
    .filter(v => linhaCombo[v])
    .map(v => `→ ${linhaCombo[v]}`)
    .join('\n\n');
  const closing = selected.length >= 3
    ? 'Cada uma sozinha já piora o quadro. Juntas explicam por que seu corpo travou.\n\nNão foi você. Foi estratégia errada pra sua fase.'
    : 'Você atacou só pedaços do problema. Não foi você. Foi estratégia errada pra sua fase.';
  return `${headline}\n\n${lines}\n\n${closing}`;
}

export function StepPastAttempts({ answers, toggle, onNext }) {
  const opts = [
    ['dieta',      'Dieta restritiva'],
    ['musculacao', 'Musculação 3-5x por semana'],
    ['caminhada',  'Caminhada todos os dias'],
    ['acucar',     'Cortar açúcar e farinha'],
    ['caneta',     'Caneta emagrecedora'],
    ['nenhuma',    'Nenhuma das anteriores'],
  ];

  // Microcopy é DERIVADA do estado — recalcula do zero a cada render
  const mc = getMicroE5(answers.pastAttempts);

  return (
    <div className="step">
      <h2 className="quiz-title">O que você JÁ tentou e não funcionou?</h2>
      <p className="quiz-subhead">Pode marcar várias:</p>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <div
            key={v}
            className={`checkbox-row ${answers.pastAttempts.includes(v) ? 'selected' : ''}`}
            onClick={() => toggle(v)}
          >
            <div className="check-box"></div>{l}
          </div>
        ))}
      </div>
      {mc && (
        <div className="quiz-microcopy" style={{ whiteSpace: 'pre-line' }}>💬 {mc}</div>
      )}
      {answers.pastAttempts.length > 0 && (
        <button className="cta-btn" onClick={onNext}>Continuar →</button>
      )}
    </div>
  );
}

// ─── E6 — Limitações Físicas ───────────────────────────────────────────────────
export function StepLimitations({ answers, toggle, onNext }) {
  const opts = [
    ['joelho',   'Joelho com dor ou artrose'],
    ['lombar',   'Dor lombar ou coluna sensível'],
    ['bursite',  'Bursite no quadril'],
    ['diastase', 'Diástase abdominal'],
    ['pes',      'Dor nos pés ou tornozelos'],
    ['nenhuma',  'Nenhuma'],
  ];
  return (
    <div className="step">
      <h2>Você tem alguma dessas limitações?</h2>
      <p className="sub">Pode marcar várias:</p>
      {opts.map(([v, l]) => (
        <div key={v} className={`checkbox-row ${answers.limitations.includes(v) ? 'selected' : ''}`} onClick={() => toggle('limitations', v)}>
          <div className="check-box"></div>{l}
        </div>
      ))}
      {answers.limitations.length > 0 && (
        <>
          <div className="microcopy">
            💬 Não se preocupe. Suas limitações foram registradas — seu protocolo vai ser personalizado pra respeitá-las.
            <br /><br />
            Você não vai ficar de fora.
          </div>
          <button className="cta-btn" onClick={onNext}>Continuar →</button>
        </>
      )}
    </div>
  );
}

// ─── E7 — Impacto Emocional ────────────────────────────────────────────────────
export function StepImpact({ answers, toggle, onNext }) {
  const opts = [
    ['fotos',        '😔 Estou evitando aparecer em fotos'],
    ['roupas',       '👗 Tem roupas que não fecham mais'],
    ['gravida-perg', '🙈 Já perguntaram se eu estou grávida'],
    ['nao-reconheco','💔 Não me reconheço mais no espelho'],
    ['isolamento',   '😩 Estou me isolando socialmente'],
  ];
  return (
    <div className="step">
      <h2 className="quiz-title">Como essa barriga tem afetado sua vida?</h2>
      <p className="quiz-subhead">Pode marcar várias:</p>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <div key={v} className={`checkbox-row ${answers.emotionalImpact.includes(v) ? 'selected' : ''}`} onClick={() => toggle('emotionalImpact', v)}>
            <div className="check-box"></div>{l}
          </div>
        ))}
      </div>
      {answers.emotionalImpact.length > 0 && (
        <>
          <div className="quiz-microcopy">
            💬 Você não está sozinha.<br /><br />
            A maioria das mulheres que faz esse teste também marca mais de uma dessas opções. Isso não é frescura. Não é vaidade.<br /><br />
            É um corpo que mudou silenciosamente — mas isso não significa que seu corpo vai ficar assim para sempre.<br /><br />
            Existe um caminho certo para essa fase — e é isso que vamos identificar agora no seu diagnóstico.
          </div>
          <button className="cta-btn" onClick={onNext}>Continuar →</button>
        </>
      )}
    </div>
  );
}

// ─── E7.5 — Tempo de Mudança ───────────────────────────────────────────────────
export function StepBodyChange({ update, onNext }) {
  const opts = [
    ['poucas_semanas', '⚡ Em poucas semanas — foi do nada, sem aviso'],
    ['alguns_meses',   '📅 Em alguns meses — fui percebendo aos poucos'],
    ['mais_um_ano',    '🕐 Há mais de um ano — tem se acumulado'],
    ['perdi_nocao',    '🌀 Sinceramente, perdi a noção — parece que sempre foi assim'],
  ];
  const handle = (v) => { update('tempo_mudanca', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600 }}>Em quanto tempo você sentiu que seu corpo mudou?</h2>
      {opts.map(([v, l]) => (
        <button key={v} className="option-btn" onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
    </div>
  );
}

// ─── E8 — Quebra de Crença ─────────────────────────────────────────────────────
export function StepBelief({ answers, update, onNext }) {
  const opts = [
    ['carboidrato', 'Cortar carboidrato'],
    ['cardio',      'Fazer mais cardio'],
    ['caneta',      'Tomar caneta'],
    ['nenhuma',     'Nenhuma dessas — não é sobre isso'],
  ];
  return (
    <div className="step">
      <h2>Você acredita que pra perder a barriga depois dos 40 você precisa:</h2>
      {opts.map(([v, l]) => (
        <button key={v} className={`option-btn ${answers.belief === v ? 'selected' : ''}`} onClick={() => update('belief', v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
      {answers.belief && (
        <>
          <div className="educational-box">
            {answers.belief === 'nenhuma' ? (
              <>
                🟢 Exato. O problema não é cortar mais comida, fazer mais cardio ou buscar soluções extremas. A barriga depois dos 40 responde a um caminho completamente diferente — específico para a fase hormonal da mulher 40+.
                <br /><br />
                Seu diagnóstico está pronto.
              </>
            ) : (
              <>
                <strong style={{ color: '#D32F2F' }}>🔴 PARE. Isso é o que MAIS atrapalha mulheres 40+.</strong>
                <br /><br />
                Cortar carboidrato ataca SÓ inflamação.<br />
                Cardio intenso PIORA o cortisol.<br />
                Caneta queima MÚSCULO.<br /><br />
                A única coisa que resolve é atacar as 3 ao mesmo tempo — com um caminho específico pra sua fase.<br /><br />
                Seu diagnóstico está pronto.
              </>
            )}
          </div>
          <button className="cta-btn" onClick={onNext}>VER MEU DIAGNÓSTICO →</button>
        </>
      )}
    </div>
  );
}

// ─── E9 — Validação ────────────────────────────────────────────────────────────
export function StepFrustration({ update, onNext }) {
  const opts = [
    ['sim-exatamente', '😩 Sim, é exatamente isso'],
    ['mais-ou-menos',  '😔 Mais ou menos — responde, mas muito devagar'],
    ['corpo-virou',    '😤 Sim, parece que meu corpo virou contra mim'],
  ];
  const handle = (v) => { update('frustration', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <p className="proof-fire-title" style={{ marginBottom: '8px' }}>🔥 Última pergunta antes do seu diagnóstico:</p>
      <h2>Você sente que mesmo se esforçando, seu corpo deixou de responder como antes?</h2>
      {opts.map(([v, l]) => (
        <button key={v} className="option-btn" onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
    </div>
  );
}

// ─── E10 — Loading antes do Diagnóstico ───────────────────────────────────────
const LOADING1_LINES = [
  '✓ Cruzando suas respostas com 23.847 perfis',
  '✓ Identificando sua causa raiz dominante',
  '✓ Calibrando para sua fase específica',
];

export function StepLoading1({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    if (lineIndex >= LOADING1_LINES.length) return;
    setLineProgress(0);
    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      setLineProgress(Math.min(100, ticks));
      if (ticks >= 100) {
        clearInterval(interval);
        if (lineIndex < LOADING1_LINES.length - 1) {
          setLineIndex(i => i + 1);
        } else if (!doneRef.current) {
          doneRef.current = true;
          setTimeout(() => onDoneRef.current(), 400);
        }
      }
    }, 20);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex]);

  return (
    <div className="loading-box">
      <h3>Analisando seu perfil hormonal, metabólico e inflamatório...</h3>
      {LOADING1_LINES.map((text, i) => (
        <div key={i} style={{ marginBottom: '16px', opacity: i > lineIndex ? 0.25 : 1 }}>
          <p style={{ fontSize: '13px', color: '#2E7D32', margin: '0 0 4px', textAlign: 'left' }}>
            {i < lineIndex ? text : i === lineIndex ? text : text}
          </p>
          <div className="loading-track">
            <div
              className="fill"
              style={{
                width: i < lineIndex ? '100%' : i === lineIndex ? `${lineProgress}%` : '0%',
                background: '#2E7D32',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
