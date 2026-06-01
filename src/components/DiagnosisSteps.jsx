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
          <p>Sua <strong style={{ color: '#D32F2F' }}>queda hormonal</strong> travou três coisas ao mesmo tempo — seu corpo passou a <strong style={{ color: '#D32F2F' }}>estocar gordura na barriga</strong>, seu metabolismo desacelerou, e sua inflamação aumentou.</p>
          <p>Aconteceu <strong style={{ color: '#D32F2F' }}>em silêncio. Por meses.</strong></p>
          <p><strong style={{ color: '#D32F2F' }}>Não foi você.</strong><br />Foi seu corpo entrando em uma nova fase.</p>
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
          <p>Seu <strong style={{ color: '#D32F2F' }}>cortisol está cronicamente alto</strong> — e isso colocou seu corpo em <strong style={{ color: '#D32F2F' }}>modo de defesa</strong>.</p>
          <p>Ele guarda gordura como reserva de emergência, trava seu metabolismo e bloqueia a queima abdominal.</p>
          <p>E aqui está o que ninguém te explicou: em modo defesa, seu corpo lê <strong style={{ color: '#D32F2F' }}>esforço como AMEAÇA</strong>. Quanto mais você tenta, mais ele se protege.</p>
          <p><strong style={{ color: '#D32F2F' }}>Não foi você.</strong><br />Foi seu corpo em modo sobrevivência.</p>
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
          <p>Boa parte da sua barriga <strong style={{ color: '#D32F2F' }}>não é gordura — é INFLAMAÇÃO</strong>.</p>
          <p>Seu corpo retém líquido e gás na região abdominal, a queima de gordura travou, e a barriga incha e desincha ao longo do dia.</p>
          <p>Por isso você <strong style={{ color: '#D32F2F' }}>acorda menor e dorme maior</strong>. Por isso cortou açúcar, cortou farinha — e a barriga continua.</p>
          <p><strong style={{ color: '#D32F2F' }}>Não foi você.</strong><br />Foi uma inflamação que estava trabalhando contra você o tempo todo.</p>
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
      <p style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: '32px 0 24px' }}>🚨 SEU DIAGNÓSTICO ESTÁ PRONTO</p>

      <p style={{ textAlign: 'center', fontSize: '16px', color: '#444', margin: '0 0 16px' }}>Causa raiz identificada:</p>
      <div style={{ background: '#FFF5F5', border: '1px solid #E63946', borderRadius: '12px', padding: '16px', margin: '0 0 32px', textAlign: 'center' }}>
        {cfg.causa.split('\n').map((line, i) => (
          <p key={i} style={i === 0
            ? { fontSize: '20px', fontWeight: 700, color: '#D32F2F', margin: '0 0 4px' }
            : { fontSize: '16px', fontWeight: 500, color: '#D32F2F', margin: 0 }}>
            {line.trim()}
          </p>
        ))}
      </div>

      <p style={{ textAlign: 'center', lineHeight: 1.55, margin: '0 0 32px' }}>
        <span style={{ fontSize: '18px', color: '#333' }}>Respira fundo.</span><br />
        <span style={{ fontSize: '17px', color: '#333' }}>Tudo que você sente agora tem nome, tem causa — e tem caminho.</span>
      </p>

      <div className="diagnosis-body" style={{ background: '#F8F8F8', borderRadius: '10px', padding: '14px', margin: '0 0 16px' }}>
        <strong style={{ fontSize: '18px' }}>📊 SEU PAINEL HORMONAL:</strong>
        <div style={{ marginTop: '16px' }}>{cfg.barras}</div>
        <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 0', textAlign: 'center' }}>
          Inflamação: nível <strong>{nivel_inflamacao}</strong>
        </p>
      </div>

      <div className="diagnosis-body">
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>O que está acontecendo no seu corpo:</p>
        <div style={{ fontSize: '18px', lineHeight: 1.55 }}>{cfg.narrativa}</div>
      </div>

      <div className="solution-box" style={{ background: '#F0FAF0', border: '1.5px solid #2E7D32', borderRadius: '10px', padding: '16px', margin: '16px 0' }}>
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#2E7D32', margin: '0 0 12px' }}>✨ A BOA NOTÍCIA:</p>
        {boaNoticia.split('\n\n').map((para, i) => (
          <p key={i} style={i === 0
            ? { fontSize: '17px', fontWeight: 700, color: '#2E7D32', lineHeight: 1.55, margin: '0 0 12px' }
            : { fontSize: '16px', color: '#1A1A1A', lineHeight: 1.55, margin: '0 0 12px' }}>
            {para}
          </p>
        ))}
        <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.55, margin: 0 }}>E é exatamente esse caminho que vamos preparar pra você nas próximas telas.</p>
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
    ['calorao_fogacho',    '🔥 Calorão / fogacho'],
    ['cansaco',            '😴 Cansaço que não passa'],
    ['insonia',            '🌙 Insônia ou acordar de madrugada'],
    ['irritabilidade',     '😡 Irritabilidade fora do comum'],
    ['ressecamento_libido','💧 Ressecamento / libido baixo'],
    ['inchaco_retencao',   '🎈 Inchaço ou retenção de líquido'],
  ];
  return (
    <div className="step">
      <h2 className="quiz-title">Quais desses sintomas você sente HOJE?</h2>
      <p className="quiz-subhead">Marque todos que aplicam:</p>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <div key={v} className={`checkbox-row ${answers.symptoms.includes(v) ? 'selected' : ''}`} onClick={() => toggle('symptoms', v)}>
            <div className="check-box"></div>{l}
          </div>
        ))}
      </div>
      {answers.symptoms.length > 0 && (
        <>
          <div className="quiz-microcopy">
            💬 Cada sintoma marcado refina seu diagnóstico. Estamos cruzando todos os dados agora.
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
      <h2 className="quiz-title">Como é seu dia a dia hoje?</h2>
      <div className="quiz-options">
        {opts.map(([v, l]) => (
          <button key={v} className={`option-btn ${selected === v ? 'selected' : ''}`} onClick={() => handle(v)}>
            {l} <span className="check">✓</span>
          </button>
        ))}
      </div>
      {selected && (
        <>
          <div className="quiz-microcopy">💬 Registrado. Seu protocolo vai encaixar naturalmente na sua rotina.</div>
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
      <h2 className="quiz-title">Qual é a sua altura?</h2>
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
      <h2 className="quiz-title">E qual é o seu peso atual?</h2>
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
        <div style={{ fontSize: '16px', lineHeight: 1.55, color: '#1A1A1A', whiteSpace: 'pre-line' }}>💬 {micro}</div>
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
      <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.55, margin: '0 0 16px', textAlign: 'center' }}>Existe um protocolo desenvolvido pra mulher 40+ na sua fase exata — 8 minutos por dia, em pé, apoiada contra uma parede. Sem academia, sem dieta, sem caneta.</p>
      <hr className="proof-hr" />
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '20px', margin: '12px 0', color: '#1A1A1A' }}>Faz sentido pra você?</p>
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
      <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>Calculando sua projeção de resultado...</h3>
      {LOADING2_LINES.map((text, i) => (
        <div key={i} style={{ marginBottom: '16px', opacity: i > lineIndex ? 0.25 : 1 }}>
          <p style={{ fontSize: '17px', fontWeight: 500, color: '#2E7D32', margin: '0 0 4px', textAlign: 'left' }}>{text}</p>
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
