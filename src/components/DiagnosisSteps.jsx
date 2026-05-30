import { useState, useEffect, useRef, useMemo } from 'react';
import { calculateScores } from '../quiz-data.js';

// ─── Barra de métrica animada ──────────────────────────────────────────────────
function MetricBar({ label, perc, sufixo, left, right }) {
  return (
    <div className="metric-block">
      <div className="label">{label}</div>
      <div className="value">{Math.round(perc)}{sufixo}</div>
      <div className="metric-bar-container">
        <div className="metric-bar">
          <div className="metric-pointer" style={{ left: `${Math.min(95, Math.max(5, perc))}%` }}>📍</div>
        </div>
      </div>
      <div className="metric-labels"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

const infPercMap = { moderado: 40, elevado: 65, alto: 85 };

// ─── E10.1 — Diagnóstico (3 variações) ────────────────────────────────────────
export function StepDiagnosis({ results, onNext }) {
  if (!results) return null;
  const { variacao, X_metabolismo, Y_cortisol, nivel_inflamacao } = results;
  const infPerc = infPercMap[nivel_inflamacao] ?? 40;

  const configs = {
    A: {
      causa: '🔥 QUEDA HORMONAL ACELERADA\n   travando seu corpo',
      barras: [
        <MetricBar key="m" label="🔻 Metabolismo: funcionando em apenas" perc={X_metabolismo} sufixo="% da capacidade ideal" left="Lento" right="Acelerado" />,
        <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
        <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} sufixo="%" left="Leve" right="Crítico" />,
      ],
      narrativa: (
        <>
          <p>Sua queda hormonal mudou silenciosamente três coisas ao mesmo tempo — seu corpo passou a estocar gordura na barriga, seu metabolismo desacelerou, e sua inflamação aumentou.</p>
          <p>Tudo isso ao mesmo tempo. <br />Em silêncio. <br />Por meses.</p>
          <p>Por isso você sentiu que do nada o corpo virou outro. <br />Não foi você. <br />Foi seu corpo se reorganizando numa nova fase.</p>
        </>
      ),
    },
    B: {
      causa: '🔥 CORTISOL CRÔNICO ELEVADO\n   sabotando seu corpo por dentro',
      barras: [
        <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
        <MetricBar key="m" label="🔻 Metabolismo: funcionando em apenas" perc={X_metabolismo} sufixo="% da capacidade ideal" left="Lento" right="Acelerado" />,
        <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} sufixo="%" left="Leve" right="Crítico" />,
      ],
      narrativa: (
        <>
          <p>Seu cortisol está cronicamente alto — e isso colocou seu corpo em modo de defesa. Ele passou a guardar gordura na barriga como reserva de emergência, travou seu metabolismo, e bloqueou a queima da gordura abdominal.</p>
          <p>Tudo isso ao mesmo tempo.<br />Em silêncio.<br />Por meses.</p>
          <p>E aqui está o que ninguém te explicou: quando o corpo entra em modo de defesa, ele interpreta esforço como AMEAÇA. Treino pesado vira ameaça. Comer pouco vira ameaça. E quanto mais ameaça ele sente, mais ele se protege guardando gordura.</p>
          <p>Não foi você.<br />Foi seu corpo entrando em modo sobrevivência sem você perceber.</p>
        </>
      ),
    },
    C: {
      causa: '🔥 INFLAMAÇÃO CRÔNICA SILENCIOSA\n   inchando seu corpo há meses',
      barras: [
        <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} sufixo="%" left="Leve" right="Crítico" />,
        <MetricBar key="m" label="🔻 Metabolismo: funcionando em apenas" perc={X_metabolismo} sufixo="% da capacidade ideal" left="Lento" right="Acelerado" />,
        <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
      ],
      narrativa: (
        <>
          <p>Boa parte da sua barriga não é gordura — é INFLAMAÇÃO. Seu corpo passou a reter líquido e gás na região abdominal, sua queima de gordura ficou bloqueada, e sua barriga começou a inchar e desinchar ao longo do dia.</p>
          <p>Tudo isso ao mesmo tempo.<br />Em silêncio.<br />Por meses.</p>
          <p>Por isso você acorda menor e dorme maior. Por isso cortou açúcar, cortou farinha — e a barriga continua.</p>
          <p>Não foi você. <br />Foi seu corpo respondendo a uma inflamação que você nem sabia que existia.</p>
        </>
      ),
    },
  };

  const cfg = configs[variacao] || configs.A;
  const boaNoticia = variacao === 'C'
    ? 'Isso é REVERSÍVEL — e responde rápido.\n\nNão com mais esforço. Não cortando mais comida. Não treinando mais pesado.\n\nCom o caminho certo — que desinflama o corpo de dentro pra fora. Desenvolvido para a mulher 40+ nessa fase exata em que você está.'
    : 'Isso é REVERSÍVEL.\n\nNão com mais esforço. Não cortando mais comida. Não treinando mais pesado.\n\nCom o caminho certo — desenvolvido para o corpo da mulher 40+ nessa fase exata em que você está.';

  return (
    <div className="step">
      <div className="diagnosis-alert">🚨 SEU DIAGNÓSTICO ESTÁ PRONTO</div>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', margin: '8px 0 4px' }}>Causa raiz identificada:</p>
      <div style={{ background: '#FFF3F3', border: '1.5px solid #D32F2F', borderRadius: '10px', padding: '14px 16px', margin: '0 0 16px', whiteSpace: 'pre-line', fontWeight: 700, color: '#D32F2F', fontSize: '16px', textAlign: 'center' }}>
        {cfg.causa}
      </div>

      <p style={{ textAlign: 'center', fontSize: '15px', color: '#333', margin: '0 0 16px' }}>
        Respira fundo. <br />Tudo que você sente agora tem nome, tem causa — e tem caminho.
      </p>

      <div className="diagnosis-body" style={{ background: '#F8F8F8', borderRadius: '10px', padding: '14px', margin: '0 0 16px' }}>
        <strong>📊 SEU PAINEL HORMONAL:</strong>
        <div style={{ marginTop: '12px' }}>{cfg.barras}</div>
        <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 0', textAlign: 'center' }}>
          Inflamação: nível <strong>{nivel_inflamacao}</strong>
        </p>
      </div>

      <div className="diagnosis-body">
        <p><strong>O que está acontecendo no seu corpo:</strong></p>
        {cfg.narrativa}
      </div>

      <div className="solution-box" style={{ background: '#F0FAF0', border: '1.5px solid #2E7D32', borderRadius: '10px', padding: '16px', margin: '16px 0', whiteSpace: 'pre-line' }}>
        <strong style={{ color: '#2E7D32' }}>✨ A BOA NOTÍCIA:</strong>
        <br /><br />
        {boaNoticia}
        <br /><br />
        E é exatamente esse caminho que vamos preparar pra você nas próximas telas.
      </div>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', margin: '16px 0 12px' }}>
        AGORA VAMOS PERSONALIZAR SUA SOLUÇÃO 👇
      </p>
      <button className="cta-btn" onClick={onNext}>CONTINUAR PARA MINHA SOLUÇÃO →</button>
    </div>
  );
}

// ─── E11 — Sintomas Hormonais ──────────────────────────────────────────────────
export function StepSymptoms({ answers, toggle, onNext }) {
  const opts = [
    ['calorao',        '🔥 Calorão / fogacho'],
    ['cansaco',        '😴 Cansaço que não passa'],
    ['insonia',        '🌙 Insônia ou acordar de madrugada'],
    ['irritabilidade', '😡 Irritabilidade fora do comum'],
    ['ressecamento',   '💧 Ressecamento / libido baixo'],
    ['nevoa',          '🧠 Esquecimento / névoa mental'],
  ];
  return (
    <div className="step">
      <p className="proof-fire-title" style={{ marginBottom: '8px' }}>🔥 Agora vamos personalizar seu protocolo.</p>
      <h2>Quais desses sintomas você sente HOJE?</h2>
      <p className="sub">Marque todos que aplicam — quanto mais preciso, mais personalizado seu plano:</p>
      {opts.map(([v, l]) => (
        <div key={v} className={`checkbox-row ${answers.symptoms.includes(v) ? 'selected' : ''}`} onClick={() => toggle('symptoms', v)}>
          <div className="check-box"></div>{l}
        </div>
      ))}
      {answers.symptoms.length > 0 && (
        <>
          <div className="microcopy">
            💬 Cada sintoma marcado é mais uma confirmação do seu diagnóstico.<br /><br />
            Seu protocolo já está sendo ajustado.
          </div>
          <button className="cta-btn" onClick={onNext}>Continuar →</button>
        </>
      )}
    </div>
  );
}

// ─── E12 — Rotina ──────────────────────────────────────────────────────────────
export function StepRoutine({ update, onNext }) {
  const [selected, setSelected] = useState(null);
  const opts = [
    ['fora',        '🚗 Trabalho fora, rotina corrida'],
    ['casa',        '🏠 Trabalho em casa, mais flexível'],
    ['familia',     '👨‍👩‍👧 Cuido da família, sem rotina fixa'],
    ['aposentada',  '🌴 Aposentada / tempo livre'],
  ];
  const handle = (v) => { update('routine', v); setSelected(v); };
  return (
    <div className="step">
      <h2>Como é seu dia a dia hoje?</h2>
      {opts.map(([v, l]) => (
        <button key={v} className={`option-btn ${selected === v ? 'selected' : ''}`} onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
      {selected && (
        <>
          <div className="microcopy">💬 Registrado. Seu protocolo vai encaixar naturalmente na sua rotina.</div>
          <button className="cta-btn" onClick={onNext}>Continuar →</button>
        </>
      )}
    </div>
  );
}

// ─── E13 — Altura ──────────────────────────────────────────────────────────────
export function StepHeight({ answers, update, onNext }) {
  const [unit, setUnit] = useState('cm');
  const displayValue = unit === 'cm' ? answers.height : Math.round(answers.height * 0.393701);
  const min = unit === 'cm' ? 140 : 55;
  const max = unit === 'cm' ? 200 : 79;

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    update('height', unit === 'cm' ? val : Math.round(val / 0.393701));
  };

  return (
    <div className="step">
      <h2>Qual é a sua altura?</h2>
      <p className="sub">Isso é importante para calcular seu IMC corrigido — uma das variáveis-chave para personalizar a intensidade do seu protocolo.</p>
      <div className="slider-container">
        <div className="slider-value">{displayValue}<span className="unit">{unit === 'cm' ? 'cm' : 'pol'}</span></div>
        <input type="range" min={min} max={max} step="1" value={displayValue} onChange={handleChange} />
        <div className="unit-toggle">
          <button className={`unit-btn ${unit === 'cm' ? 'active' : ''}`} onClick={() => setUnit('cm')}>cm</button>
          <button className={`unit-btn ${unit === 'pol' ? 'active' : ''}`} onClick={() => setUnit('pol')}>pol</button>
        </div>
      </div>
      <button className="cta-btn" onClick={onNext}>Continuar →</button>
    </div>
  );
}

// IMC microcopies para E14
const imcMicro = (imc) => {
  if (imc < 25) return 'Seu peso está saudável — o que significa que sua barriga é hormonal, não calórica.\n\nIsso muda o caminho do seu protocolo. Você não precisa perder peso. Precisa reverter o que está causando a barriga.';
  if (imc < 30) return 'Seu IMC indica sobrepeso leve — típico da fase hormonal em que você está.\n\nVamos ajustar seu protocolo para atacar a gordura abdominal com prioridade — sem dieta restritiva e sem treino que sobe cortisol.';
  if (imc < 35) return 'Seu IMC indica obesidade grau I.\n\nIsso não é defeito seu — é o resultado direto da queda hormonal travando seu metabolismo. Seu protocolo será ajustado em intensidade progressiva, respeitando o ritmo do seu corpo.';
  if (imc < 40) return 'Seu IMC indica obesidade grau II.\n\nIsso exige um protocolo cuidadosamente ajustado — com intensidade progressiva e foco em destravar o metabolismo antes de qualquer coisa. Bom que você chegou aqui agora.';
  return 'Seu caso exige cuidado redobrado — e o protocolo será adaptado em ritmo progressivo, sem nenhum tipo de impacto ou esforço excessivo.\n\nMulheres no seu perfil costumam ter resultados ainda mais expressivos porque o corpo está respondendo a QUALQUER ajuste hormonal correto.';
};

const imcClassif = (imc) => {
  if (imc < 18.5) return { label: 'Abaixo do peso', cor: '#888' };
  if (imc < 25)   return { label: 'Peso saudável',   cor: '#2E7D32' };
  if (imc < 30)   return { label: 'Sobrepeso',        cor: '#F77F00' };
  if (imc < 35)   return { label: 'Obesidade I',      cor: '#E63946' };
  if (imc < 40)   return { label: 'Obesidade II',     cor: '#E63946' };
  return               { label: 'Obesidade III',      cor: '#E63946' };
};

// ─── E14 — Peso + IMC (tempo real) ────────────────────────────────────────────
export function StepWeight({ answers, update, onNext }) {
  const [unit, setUnit] = useState('kg');
  const displayValue = unit === 'kg' ? answers.weight : Math.round(answers.weight * 2.20462);
  const min = unit === 'kg' ? 40 : 88;
  const max = unit === 'kg' ? 200 : 440;

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    update('weight', unit === 'kg' ? val : Math.round(val / 2.20462));
  };

  const imc = useMemo(() => {
    const h = (answers.height || 165) / 100;
    return +(answers.weight / (h * h)).toFixed(1);
  }, [answers.height, answers.weight]);

  const { label: imcLabel, cor: imcCor } = imcClassif(imc);
  const micro = imcMicro(imc);

  return (
    <div className="step">
      <h2>E qual é o seu peso atual?</h2>
      <p className="sub">Com altura e peso, vamos calcular seu IMC e ajustar a intensidade do protocolo exatamente para o seu caso.</p>
      <div className="slider-container">
        <div className="slider-value">{displayValue}<span className="unit">{unit}</span></div>
        <input type="range" min={min} max={max} step="1" value={displayValue} onChange={handleChange} />
        <div className="unit-toggle">
          <button className={`unit-btn ${unit === 'kg' ? 'active' : ''}`} onClick={() => setUnit('kg')}>kg</button>
          <button className={`unit-btn ${unit === 'lb' ? 'active' : ''}`} onClick={() => setUnit('lb')}>lb</button>
        </div>
      </div>

      <div style={{ background: '#F8F8F8', borderRadius: '10px', padding: '14px 16px', margin: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>📊 SEU IMC: <span style={{ color: imcCor }}>{imc}</span></span>
          <span style={{ fontWeight: 600, color: imcCor, fontSize: '14px' }}>{imcLabel}</span>
        </div>
        <div style={{ background: '#E0E0E0', borderRadius: '4px', height: '8px', position: 'relative', marginBottom: '12px' }}>
          <div style={{ background: imcCor, borderRadius: '4px', height: '8px', width: `${Math.min(100, Math.max(5, ((imc - 15) / 25) * 100))}%`, transition: 'width 0.3s' }} />
        </div>
        <div className="microcopy" style={{ whiteSpace: 'pre-line', margin: 0 }}>💬 {micro}</div>
      </div>

      <button className="cta-btn" onClick={onNext}>Continuar →</button>
    </div>
  );
}

// ─── E15 — Idade Exata ─────────────────────────────────────────────────────────
export function StepAge({ answers, update, onNext }) {
  const idade = answers.idade || 47;
  let fase;
  if (idade <= 44) fase = 'Pré-menopausa';
  else if (idade <= 52) fase = 'Perimenopausa';
  else fase = 'Pós-menopausa';

  return (
    <div className="step">
      <h2>Por último — qual é a sua idade exata?</h2>
      <p className="sub">Sua idade exata permite calibrar o protocolo pra fase hormonal ESPECÍFICA em que você está.</p>
      <div className="slider-container">
        <div className="slider-value">{idade}<span className="unit">anos</span></div>
        <input
          type="range"
          min={38}
          max={70}
          step="1"
          value={idade}
          onChange={e => update('idade', parseInt(e.target.value))}
        />
      </div>
      <button className="cta-btn" onClick={onNext}>Continuar →</button>
    </div>
  );
}

// ─── E16 — Aceitação da Solução ────────────────────────────────────────────────
export function StepAcceptance({ update, onNext }) {
  const opts = [
    ['sim',    '😃 Sim, é exatamente o que faz sentido pra mim'],
    ['testar', '🤔 Quero testar, parece diferente'],
    ['topo',   '💪 Topo qualquer coisa que respeite minhas limitações'],
  ];
  const handle = (v) => { update('acceptance', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <p className="proof-fire-title" style={{ marginBottom: '8px' }}>🔥 Antes de calcularmos sua projeção de resultado:</p>
      <h2>Existe um protocolo desenvolvido pra mulher 40+ na sua fase exata — 8 minutos por dia, em pé, apoiada contra uma parede. Sem academia, sem dieta, sem caneta.</h2>
      <hr className="proof-hr" />
      <p style={{ textAlign: 'center', fontWeight: 600, fontSize: '16px', margin: '12px 0' }}>Faz sentido pra você?</p>
      {opts.map(([v, l]) => (
        <button key={v} className="option-btn" onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
    </div>
  );
}

// ─── E17-loading — Loading + Projeção ─────────────────────────────────────────
const LOADING2_LINES = [
  '✓ Cruzando seu perfil com 23.847 mulheres',
  '✓ Aplicando seu IMC e fase hormonal exata',
  '✓ Calibrando para suas limitações físicas',
  '✓ Definindo sua faixa de resultado esperado',
];

export function StepLoading2({ answers, setResults, onNext }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const doneRef = useRef(false);
  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; });

  const scoresRef = useRef(null);
  useEffect(() => {
    scoresRef.current = calculateScores(answers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lineIndex >= LOADING2_LINES.length) return;
    setLineProgress(0);
    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      setLineProgress(Math.min(100, ticks));
      if (ticks >= 100) {
        clearInterval(interval);
        if (lineIndex < LOADING2_LINES.length - 1) {
          setLineIndex(i => i + 1);
        } else if (!doneRef.current) {
          doneRef.current = true;
          setResults(scoresRef.current);
          setTimeout(() => onNextRef.current(), 400);
        }
      }
    }, 15);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex]);

  return (
    <div className="loading-box">
      <h3>Calculando sua projeção de resultado...</h3>
      {LOADING2_LINES.map((text, i) => (
        <div key={i} style={{ marginBottom: '16px', opacity: i > lineIndex ? 0.25 : 1 }}>
          <p style={{ fontSize: '13px', color: '#2E7D32', margin: '0 0 4px', textAlign: 'left' }}>{text}</p>
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
