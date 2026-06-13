import { useState, useEffect, useRef } from 'react';

// ─── E5 — O que Já Tentou ──────────────────────────────────────────────────────

const singleMicro = {
  dieta: `Dieta restritiva desregula hormônio e trava metabolismo — duas das três pontas do triângulo. Por isso a barriga voltou.`,
  musculacao: `Musculação intensa sobe cortisol — e cortisol alto é o que bloqueia a queima abdominal depois dos 40.`,
  caminhada: `Caminhada não toca em nenhuma das três pontas do triângulo. Boa pra saúde — mas invisível pra barriga hormonal.`,
  acucar: `Cortar açúcar ataca só a inflamação. Hormônio e metabolismo continuam travados. Com duas pontas abertas, a barriga não cede.`,
  caneta: `Caneta queima músculo — que você já está perdendo naturalmente depois dos 40. Quando para, a barriga volta dobrada.`,
  nenhuma: `Você não desperdiçou energia na estratégia errada. Seu resultado tende a ser mais rápido com o caminho certo.`,
};


function getMicroE5(selected) {
  if (selected.length === 0) return null;
  if (selected.includes('nenhuma')) return singleMicro.nenhuma;
  if (selected.length === 1) return singleMicro[selected[0]] ?? null;
  return `Você tentou de tudo. Colocou esforço de verdade. E mesmo assim a barriga ficou. Não foi falta de disciplina — foi que nenhuma dessas estratégias foi feita para o seu corpo nessa fase.`;
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
    ['joelho',   'Joelho com dor ou artrose',       '/imagem/limitacao-joelho.png'],
    ['lombar',   'Dor lombar ou coluna sensível',   '/imagem/limitacao-lombar.png'],
    ['bursite',  'Bursite no quadril',               '/imagem/limitacao-quadril.png'],
    ['diastase', 'Diástase abdominal',               '/imagem/limitacao-diastase.png'],
    ['pes',      'Dor nos pés ou tornozelos',        '/imagem/limitacao-pes.png'],
    ['nenhuma',  'Nenhuma',                          '/imagem/limitacao-nenhuma.png'],
  ];
  return (
    <div className="step">
      <h2 className="quiz-title">Você tem alguma dessas limitações?</h2>
      <p className="quiz-subhead">Pode marcar várias:</p>
      <div className="quiz-options">
        {opts.map(([v, l, img]) => (
          <div key={v} className={`checkbox-row ${answers.limitations.includes(v) ? 'selected' : ''}`} onClick={() => toggle('limitations', v)}>
            <div className="check-box"></div>
            <span style={{ flex: 1 }}>{l}</span>
            <img src={img} alt="" className="limit-img" />
          </div>
        ))}
      </div>
      {answers.limitations.length > 0 && (
        <>
          <div className="quiz-microcopy">
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
export function StepImpact({ toggle, onNext }) {
  const opts = [
    ['fotos',        '😔 Estou evitando aparecer em fotos'],
    ['roupas',       '👗 Tem roupas que não fecham mais'],
    ['gravida-perg', '🙈 Já perguntaram se eu estou grávida'],
    ['nao-reconheco','💔 Não me reconheço mais no espelho'],
    ['isolamento',   '😩 Estou me isolando socialmente'],
  ];
  const handle = (v) => { toggle('emotionalImpact', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <h2 className="quiz-title">Como essa barriga tem afetado sua vida?</h2>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <button key={v} className="option-btn" onClick={() => handle(v)}>
            {l} <span className="check">✓</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── E7.2 — Ponte Emocional (sem pergunta, sem variável) ──────────────────────
export function StepEmotionalBridge({ onNext }) {
  return (
    <div className="step" style={{ background: '#F7F4EF' }}>

      {/* Topo */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img
          src="/imagem/mulheres-nao-esta-sozinha.jpg"
          alt=""
          className="emotional-bridge-img"
        />
      </div>

      {/* Meio */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '22px', fontWeight: 800, color: '#123C35', margin: '0 0 12px' }}>
          Você não está sozinha.
        </p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0 0 16px' }}>
          A maioria das mulheres que chega até aqui marca mais de uma dessas opções.
        </p>
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>
          Isso não é frescura. Nem vaidade.
        </p>
        <p style={{ fontSize: '16px', color: '#555555', margin: 0 }}>
          É o seu corpo pedindo um caminho diferente.
        </p>
      </div>

      {/* Base */}
      <div style={{
        background: '#F0FAF0',
        border: '1px solid #2E7D32',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <p style={{ fontWeight: 700, color: '#2E7D32', margin: '0 0 12px' }}>✨ A boa notícia:</p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0 0 10px' }}>
          Seu corpo mudou — mas isso não significa que ele vai ficar assim para sempre.
        </p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0 0 10px' }}>
          Cada resposta que você deu até aqui está construindo o seu diagnóstico.
        </p>
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Sua análise está quase pronta.
        </p>
      </div>

      <button className="cta-btn" onClick={onNext}>CONTINUAR →</button>
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
      <h2 className="quiz-title">Em quanto tempo você sentiu que seu corpo mudou?</h2>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <button key={v} className="option-btn" onClick={() => handle(v)}>
            {l} <span className="check">✓</span>
          </button>
        ))}
      </div>
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
      <h2 className="quiz-title">Você acredita que pra perder a barriga depois dos 40 você precisa:</h2>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <button key={v} className={`option-btn ${answers.belief === v ? 'selected' : ''}`} onClick={() => update('belief', v)}>
            {l} <span className="check">✓</span>
          </button>
        ))}
      </div>
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
                <strong style={{ color: '#D32F2F', fontSize: '18px' }}>🔴 PARE. Isso é o que MAIS atrapalha mulheres 40+.</strong>
                <br /><br />
                <span style={{ fontSize: '17px', fontWeight: 500 }}>
                  Cortar carboidrato ataca SÓ inflamação.<br />
                  Cardio intenso PIORA o cortisol.<br />
                  Caneta queima MÚSCULO.
                </span><br /><br />
                A única coisa que resolve é atacar as 3 ao mesmo tempo — com um caminho específico pra sua fase.
              </>
            )}
          </div>
          <button className="cta-btn" onClick={onNext}>CONTINUAR →</button>
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
      <p className="proof-fire-title" style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 500 }}>🔥 Última pergunta antes do seu diagnóstico:</p>
      <h2 className="quiz-title">Você sente que mesmo se esforçando, seu corpo deixou de responder como antes?</h2>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <button key={v} className="option-btn" onClick={() => handle(v)}>
            {l} <span className="check">✓</span>
          </button>
        ))}
      </div>
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
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>Analisando seu perfil hormonal, metabólico e inflamatório...</h3>
      {LOADING1_LINES.map((text, i) => (
        <div key={i} style={{ marginBottom: '16px', opacity: i > lineIndex ? 0.25 : 1 }}>
          <p style={{ fontSize: '17px', fontWeight: 500, color: '#2E7D32', margin: '0 0 4px', textAlign: 'left' }}>
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
