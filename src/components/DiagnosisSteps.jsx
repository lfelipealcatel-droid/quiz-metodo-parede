import { useState, useEffect, useRef, useMemo } from 'react';
import { calculateScores } from '../quiz-data.js';

// ─── Barra de métrica animada ──────────────────────────────────────────────────
function MetricBar({ label, perc, sufixo, valueText, left, right }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <p style={{ fontSize: '16px', color: '#555', margin: '0 0 2px', lineHeight: 1.4 }}>{label}</p>
      <p style={{ fontSize: '20px', fontWeight: 700, color: '#D32F2F', margin: '0 0 8px' }}>
        {valueText ?? `${Math.round(perc)}${sufixo}`}
      </p>
      <div style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'linear-gradient(to right, #4CAF50, #FFC107, #D32F2F)', marginBottom: '6px' }}>
        <span style={{
          position: 'absolute',
          top: '50%',
          left: `${Math.min(92, Math.max(4, perc))}%`,
          transform: 'translate(-50%, -50%)',
          fontSize: '15px',
          color: '#fff',
          textShadow: '0 0 3px rgba(0,0,0,0.8)',
          lineHeight: 1,
        }}>●</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
        <span>{left}</span><span>{right}</span>
      </div>
    </div>
  );
}

const infPercMap = { moderado: 40, elevado: 65, alto: 85 };

// ─── E10.1 — Diagnóstico (3 variações) ────────────────────────────────────────
export function StepDiagnosis({ results, onNext }) {
  if (!results) return null;
  const { variacao, X_metabolismo, Y_cortisol, nivel_inflamacao } = results;
  const infPerc = infPercMap[nivel_inflamacao] ?? 40;

  const RED = '#D32F2F';
  const bodyStyle = { fontSize: '16px', lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 12px' };
  const subheadStyle = { fontSize: '18px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px' };

  const barraA = [
    <MetricBar key="m" label="🔻 Metabolismo: operando em apenas" perc={X_metabolismo} sufixo="% da capacidade" left="Lento" right="Acelerado" />,
    <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
    <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} valueText={nivel_inflamacao} left="Leve" right="Crítico" />,
  ];
  const barraB = [
    <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
    <MetricBar key="m" label="🔻 Metabolismo: operando em apenas" perc={X_metabolismo} sufixo="% da capacidade" left="Lento" right="Acelerado" />,
    <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} valueText={nivel_inflamacao} left="Leve" right="Crítico" />,
  ];
  const barraC = [
    <MetricBar key="i" label="⚠️ Inflamação: nível" perc={infPerc} valueText={nivel_inflamacao} left="Leve" right="Crítico" />,
    <MetricBar key="m" label="🔻 Metabolismo: operando em apenas" perc={X_metabolismo} sufixo="% da capacidade" left="Lento" right="Acelerado" />,
    <MetricBar key="c" label="🔺 Cortisol:" perc={Y_cortisol} sufixo="% acima do ideal" left="Equilibrado" right="Crítico" />,
  ];

  const configs = {
    A: {
      causaTitulo: '🔥 QUEDA HORMONAL',
      causaTexto: <>Não são as três no mesmo nível. No seu caso, é a queda hormonal que <strong style={{ color: RED }}>está no comando</strong> — e é por ela que tudo tem que começar.</>,
      barras: barraA,
      panelTexto: <>Seu corpo entrou em <strong style={{ color: RED }}>modo de economia</strong>: ele queima cada vez menos e <strong style={{ color: RED }}>guarda gordura na barriga</strong> em vez de gastar. Você faz a mesma coisa de sempre e, ainda assim, a barriga só cresce. Mas segura aí — tem o outro lado.</>,
      significa: (
        <>
          <p style={bodyStyle}>Quando a queda hormonal é a raiz, mexer só na comida ou só no treino não chega nem perto — porque o problema nasce mais fundo. Antes de qualquer dieta funcionar, <strong style={{ color: RED }}>o seu corpo precisa ser religado</strong>: voltar a queimar gordura como fazia antes, em vez de guardar tudo na barriga.</p>
          <p style={{ ...bodyStyle, margin: 0 }}>E aqui está o que muda tudo: quando você acerta a causa principal, <strong style={{ color: RED }}>as outras duas caem junto</strong>. Resolver a queda hormonal primeiro já alivia o cortisol e baixa a inflamação — em vez de você brigar com as três ao mesmo tempo.</p>
        </>
      ),
      poucas: (
        <>
          <p style={bodyStyle}>Saber qual é a sua causa principal é o que separa quem tenta no escuro de quem finalmente acerta.</p>
          <p style={{ ...bodyStyle, margin: 0 }}><strong style={{ color: RED }}>Você já tem essa resposta</strong> — agora falta a parte que traz o resultado.</p>
        </>
      ),
    },
    B: {
      causaTitulo: '🔥 CORTISOL ELEVADO',
      causaTexto: <>Não são as três no mesmo nível. No seu caso, é o cortisol que <strong style={{ color: RED }}>está no comando</strong> — e ele funciona de um jeito que muda toda a sua estratégia.</>,
      barras: barraB,
      panelTexto: <>Com o cortisol alto, seu corpo vive em <strong style={{ color: RED }}>estado de alerta</strong> e <strong style={{ color: RED }}>guarda gordura na barriga</strong> como se fosse uma reserva de emergência. Parece exagero, mas segura aí — tem o outro lado.</>,
      significa: (
        <p style={{ ...bodyStyle, margin: 0 }}>Aqui está a armadilha: com o cortisol no comando, <strong style={{ color: RED }}>quanto mais você se cobra, pior fica</strong>. Dieta apertada e treino pesado fazem o cortisol subir ainda mais — e o corpo responde travando a gordura da barriga com mais força. Por isso o seu caminho é o contrário: <strong style={{ color: RED }}>primeiro acalmar o cortisol</strong>. E quando ele baixa, as outras duas causas afrouxam junto.</p>
      ),
      poucas: (
        <>
          <p style={bodyStyle}>Quando o corpo entende que pode parar de se defender, ele reage rápido — e o seu perfil é justamente um dos que mais surpreende nos primeiros dias.</p>
          <p style={{ ...bodyStyle, margin: 0 }}><strong style={{ color: RED }}>Você já tem a sua resposta</strong> — agora falta a parte que vira o jogo.</p>
        </>
      ),
    },
    C: {
      causaTitulo: '🔥 INFLAMAÇÃO SILENCIOSA',
      causaTexto: <>Não são as três no mesmo nível. No seu caso, é a inflamação que <strong style={{ color: RED }}>está no comando</strong> — e ela é a razão de <strong style={{ color: RED }}>a gordura da sua barriga não sair</strong>, por mais que você tente.</>,
      barras: barraC,
      panelTexto: <>A inflamação faz seu corpo reter líquido e travar a queima — então <strong style={{ color: RED }}>a gordura fica presa na barriga</strong>, sem conseguir sair. É por isso que a barriga muda de tamanho ao longo do dia. Mas segura aí — tem o outro lado.</>,
      significa: (
        <>
          <p style={bodyStyle}>Aqui está por que cortar açúcar e farinha nunca foi suficiente: você atacou um pedaço, não a raiz. Com a inflamação no comando, o corpo precisa desinflamar primeiro — porque é a inflamação que está <strong style={{ color: RED }}>segurando a gordura no lugar</strong>.</p>
          <p style={{ ...bodyStyle, margin: 0 }}>E essa é a boa notícia do seu perfil: quando a inflamação baixa, as outras duas afrouxam junto — o cortisol alivia e o metabolismo destrava. Aí <strong style={{ color: RED }}>a gordura, que estava presa, finalmente volta a sair</strong>.</p>
        </>
      ),
      poucas: (
        <>
          <p style={bodyStyle}>De todos os perfis, o seu costuma mostrar <strong style={{ color: RED }}>resultado visível mais cedo</strong> — porque assim que a inflamação cede, a barriga já começa a responder.</p>
          <p style={{ ...bodyStyle, margin: 0 }}><strong style={{ color: RED }}>Você já tem a sua resposta</strong> — agora falta a parte que destrava o resto.</p>
        </>
      ),
    },
  };

  const cfg = configs[variacao] || configs.A;

  return (
    <div className="step">
      <p style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: '24px 0 16px' }}>
        🚨 SEU DIAGNÓSTICO ESTÁ PRONTO
      </p>

      <p style={{ textAlign: 'center', fontSize: '16px', color: '#444', lineHeight: 1.55, margin: '0 0 20px' }}>
        Cruzamos suas respostas com mais de 23 mil perfis. E uma das três causas do seu Triângulo Hormonal apareceu muito mais forte que as outras duas:
      </p>

      <div style={{ background: '#FFF5F5', border: '1px solid #E63946', borderRadius: '12px', padding: '20px', margin: '0 0 28px', textAlign: 'center' }}>
        <p style={{ fontSize: '22px', fontWeight: 700, color: RED, margin: '0 0 4px' }}>{cfg.causaTitulo}</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: RED, margin: '0 0 14px' }}>esta é a sua causa dominante</p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.55, margin: 0, textAlign: 'left' }}>{cfg.causaTexto}</p>
      </div>

      <div style={{ background: '#F8F8F8', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
        <p style={subheadStyle}>📊 O retrato do seu corpo hoje:</p>
        {cfg.barras}
        <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#555', lineHeight: 1.55, margin: 0 }}>
          {cfg.panelTexto}
        </p>
      </div>

      <div style={{ margin: '0 0 24px' }}>
        <p style={subheadStyle}>🎯 O que isso significa PRA VOCÊ:</p>
        {cfg.significa}
      </div>

      <div style={{ background: '#F0FAF0', border: '1.5px solid #2E7D32', borderRadius: '12px', padding: '20px', margin: '0 0 28px' }}>
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#2E7D32', margin: '0 0 12px' }}>🌟 A parte que poucas sabem:</p>
        {cfg.poucas}
      </div>

      <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>AGORA VAMOS PERSONALIZAR SUA SOLUÇÃO</p>

      <button className="cta-btn proof-cta-pulse" onClick={onNext}>👇 CONTINUAR PARA MINHA SOLUÇÃO →</button>
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
      <div style={{
        borderLeft: '5px solid #E05A00',
        background: '#FFE8D6',
        borderRadius: '10px',
        padding: '14px 16px',
        margin: '0 0 24px',
        fontSize: '15px',
        lineHeight: 1.55,
        color: '#444',
      }}>
        🎯 A partir daqui, cada resposta personaliza seu protocolo para a sua fase hormonal exata.
      </div>
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
      <h2>Qual é a sua idade exata?</h2>
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
