import { useState, useEffect, useRef } from 'react';
import { getBellyLabel, getLimitLabel } from '../quiz-data.js';

// ─── Gráfico de projeção animado ──────────────────────────────────────────────
function ProjectionChart({ projectionMin, projectionMax }) {
  const [animated, setAnimated] = useState(false);
  const [fillVisible, setFillVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    const t = setTimeout(() => setFillVisible(true), 750);
    return () => clearTimeout(t);
  }, []);

  const pts = [[24, 86], [112, 62], [210, 34], [296, 14]];
  const labels = ['Hoje', 'Semana 1', 'Semana 2', 'Semana 3'];
  const DASH = 1000;

  const linePath =
    `M ${pts[0][0]},${pts[0][1]} ` +
    `C ${pts[0][0]+26},${pts[0][1]} ${pts[1][0]-26},${pts[1][1]} ${pts[1][0]},${pts[1][1]} ` +
    `C ${pts[1][0]+26},${pts[1][1]} ${pts[2][0]-26},${pts[2][1]} ${pts[2][0]},${pts[2][1]} ` +
    `C ${pts[2][0]+26},${pts[2][1]} ${pts[3][0]-26},${pts[3][1]} ${pts[3][0]},${pts[3][1]}`;

  const fillPath = `${linePath} L ${pts[3][0]},90 L ${pts[0][0]},90 Z`;

  return (
    <div style={{ margin: '12px 0 4px', background: '#fff', borderRadius: '8px' }}>
      <svg viewBox="0 0 320 115" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <path
          d={fillPath}
          fill="#F37021"
          opacity={fillVisible ? 0.10 : 0}
          style={{ transition: 'opacity 0.4s ease' }}
        />
        <path
          d={linePath}
          fill="none"
          stroke="#F37021"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={DASH}
          strokeDashoffset={animated ? 0 : DASH}
          style={{ transition: animated ? 'stroke-dashoffset 0.7s ease-out' : 'none' }}
        />
        {pts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r="5"
            fill="#F37021" stroke="white" strokeWidth="2"
            opacity={animated ? 1 : 0}
            style={{ transition: `opacity 0.2s ease ${0.1 + i * 0.15}s` }}
          />
        ))}
        {pts.map(([x], i) => (
          <text
            key={i}
            x={x} y={110}
            textAnchor="middle"
            fontSize="10"
            fill="#AAAAAA"
            fontFamily="system-ui, sans-serif"
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── E17-projeção — Resultado ──────────────────────────────────────────────────
export function StepProjection({ results, answers, onNext }) {
  if (!results) return null;
  const { projectionMin, projectionMax } = results;

  return (
    <div className="step">
      <div className="diagnosis-alert" style={{ background: '#FFF8E1', borderColor: '#C9A227', color: '#7B5800' }}>
        🎉 SUA PROJEÇÃO DE RESULTADO
      </div>

      <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#1A1A1A', margin: '12px 0' }}>
        Com base no seu perfil exato, ao seguir o método recomendado para você:
      </p>

      <ul style={{ fontSize: '17px', fontWeight: 500, lineHeight: 1.5, color: '#1A1A1A', paddingLeft: '20px', margin: '0 0 16px' }}>
        <li>✅ Reduzir <strong>{projectionMin} a {projectionMax} cm de cintura em 21 dias</strong></li>
        <li>✅ Sentir o corpo respondendo já na primeira semana</li>
        <li>✅ Barriga menos inchada e visualmente mais firme em 3-5 dias</li>
      </ul>

      <div className="estimate-box">
        <div className="est-label">SUA ESTIMATIVA PERSONALIZADA</div>
        <div className="est-value">{projectionMin} a {projectionMax} cm</div>
        <div style={{ fontSize: '14px', color: '#444', fontWeight: 600, margin: '2px 0 0' }}>de cintura</div>
        <div style={{ fontSize: '14px', color: '#2E7D32', fontWeight: 700, margin: '2px 0 14px' }}>em 21 dias</div>
        <ProjectionChart projectionMin={projectionMin} projectionMax={projectionMax} />
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', margin: '32px 0 12px' }}>
        🔥 Resultados reais de mulheres com perfil parecido com o seu:
      </h3>

      <div className="beforeafter">
        <div className="ba-card">
          <img src="/imagem/antes-depois-lucia.jpg" alt="Antes e depois Lúcia" className="ba-img" onError={e => { e.target.style.display = 'none'; }} />
          <strong>-9 cm</strong>
          <small style={{ fontSize: '14px', fontWeight: 500, color: '#444' }}>Lúcia, 51 — perdeu 9 cm em 21 dias</small>
        </div>
        <div className="ba-card">
          <img src="/imagem/antes-depois-beatriz.jpg" alt="Antes e depois Beatriz" className="ba-img" onError={e => { e.target.style.display = 'none'; }} />
          <strong>-7 cm</strong>
          <small style={{ fontSize: '14px', fontWeight: 500, color: '#444' }}>Beatriz, 47 — perdeu 7 cm com hérnia de disco</small>
        </div>
      </div>

      <p className="urgency-question" style={{ margin: '32px 0 8px', fontSize: '18px', fontWeight: 700, color: '#1A1A1A', textAlign: 'center' }}>
        🚨 VOCÊ QUER ATIVAR ESSE RESULTADO EM 21 DIAS?
      </p>
      <button className="cta-btn" onClick={onNext}>→ SIM, EU PRECISO MUITO ←</button>
    </div>
  );
}

// ─── E18 — Nome ────────────────────────────────────────────────────────────────
export function StepName({ answers, update, onNext }) {
  const isValid = answers.name.trim().length >= 2 && !/\d/.test(answers.name);
  return (
    <div className="step">
      <h2>Pra finalizar seu protocolo personalizado, como podemos te chamar?</h2>
      <input
        type="text"
        className="text-input"
        placeholder="Seu primeiro nome"
        value={answers.name}
        onChange={e => update('name', e.target.value)}
        autoFocus
      />
      <button className="cta-btn" onClick={onNext} disabled={!isValid}>Continuar →</button>
    </div>
  );
}

// ─── E19 — Email ───────────────────────────────────────────────────────────────
export function StepEmail({ answers, update, onNext }) {
  const valid = answers.email.includes('@') && answers.email.includes('.');
  return (
    <div className="step">
      <h2>Pra onde devemos enviar seu protocolo personalizado + seus bônus?</h2>
      <input
        type="email"
        className="text-input"
        placeholder="seu@email.com"
        value={answers.email}
        onChange={e => update('email', e.target.value)}
        autoFocus
      />
      <p style={{ fontSize: '12px', color: '#888', margin: '10px 0' }}>🛡 Seus dados estão protegidos. Zero spam.</p>
      <button className="cta-btn" onClick={onNext} disabled={!valid}>Continuar →</button>
    </div>
  );
}

// ─── E20 — Dor Futura ──────────────────────────────────────────────────────────
export function StepFutureFear({ answers, update, onNext }) {
  const name = answers.name || 'você';
  const opts = [
    ['piorar',     '😟 A barriga vai piorar — roupa vai parar de servir'],
    ['saude',      '😰 Saúde vai piorar — mais dor, menos energia'],
    ['triste',     '💔 Vou estar mais triste e isolada'],
    ['sem-reagir', '😔 Vou continuar vendo meu corpo mudar sem conseguir reagir'],
  ];
  const handle = (v) => { update('futureFear', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <h2 className="quiz-title">{name}, se nada mudar nos próximos 6 meses, como você imagina que vai estar?</h2>
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

// ─── E21 — Comprometimento ─────────────────────────────────────────────────────
export function StepCommitment({ answers, update, onNext }) {
  const name = answers.name || 'você';
  const opts = [
    ['sim',    '💪 Sim, preciso muito mudar'],
    ['tentar', '🙏 Estou disposta a tentar de verdade'],
  ];
  const handle = (v) => { update('commitment', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <h2 className="quiz-title">{name}, você está disposta a dedicar apenas 8 minutos por dia nos próximos 21 dias para reverter isso?</h2>
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

// ─── E21.5 — Loading com depoimentos ──────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: '"Achei que minha barriga era só idade. Em 3 semanas minhas roupas já estavam mais folgadas e voltei a me sentir confortável comigo mesma."',
    name: 'Marina, 44 anos',
    min: 0, max: 33,
  },
  {
    text: '"O que mais me surpreendeu foi perceber que eu não precisava fazer mais esforço. Quando entendi o que estava acontecendo com meu corpo, tudo começou a mudar."',
    name: 'Renata, 47 anos',
    min: 34, max: 66,
  },
  {
    text: '"Depois dos 50 eu já tinha perdido a esperança. Hoje me sinto mais leve, menos inchada e voltei a vestir roupas que estavam guardadas há anos."',
    name: 'Patrícia, 54 anos',
    min: 67, max: 100,
  },
];

export function StepFinalLoading({ onNext }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; });

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => Math.min(p + 1, 100));
    }, 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(() => onNextRef.current(), 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  const testimonial = TESTIMONIALS.find(t => progress >= t.min && progress <= t.max)
    ?? TESTIMONIALS[2];

  const R = 52;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - progress / 100);

  return (
    <div className="step" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Circular loader */}
      <svg width="136" height="136" viewBox="0 0 136 136" style={{ margin: '8px 0 28px' }}>
        <circle cx="68" cy="68" r={R} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="68" cy="68" r={R}
          fill="none"
          stroke="#F37021"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 68 68)"
          style={{ transition: 'stroke-dashoffset 0.06s linear' }}
        />
        <text
          x="68" y="68"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="22"
          fontWeight="700"
          fill="#1A1A1A"
          fontFamily="system-ui, sans-serif"
        >
          {progress}%
        </text>
      </svg>

      {/* Depoimento */}
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: '15px', margin: '0 0 14px' }}>⭐⭐⭐⭐⭐</p>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#1A1A1A', margin: '0 0 10px', fontStyle: 'italic' }}>
          {testimonial.text}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#555', margin: '0 0 16px' }}>
          {testimonial.name}
        </p>
        <div style={{
          width: '80px', height: '80px',
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          margin: '0 auto',
        }} />
      </div>

      {/* Rodapé */}
      <p style={{ fontSize: '14px', color: '#666', margin: '32px 0 0' }}>
        👩‍🦰 Mais de 23.847 mulheres já concluíram esta análise.
      </p>
    </div>
  );
}

// ─── E22 — Perfil Consolidado ──────────────────────────────────────────────────
function ProfileRow({ icon, label, value, highlight }) {
  return (
    <div className="profile-row">
      <span className="key">{icon} {label}</span>
      <span className="val" style={highlight ? { color: '#F37021', fontWeight: 700 } : {}}>{value}</span>
    </div>
  );
}

const DYNAMIC_BENEFITS = [
  { key: 'insonia',             text: 'Dormir melhor e acordar mais descansada' },
  { key: 'irritabilidade',      text: 'Sentir mais equilíbrio emocional e bem-estar' },
  { key: 'calorao_fogacho',     text: 'Atravessar os calorões com mais conforto' },
  { key: 'ressecamento_libido', text: 'Recuperar sua vitalidade feminina' },
];

export function StepProfile({ answers, results, onNext }) {
  if (!results) return null;
  const name = answers.name || 'Você';
  const {
    fase_hormonal, X_metabolismo, Y_cortisol, nivel_inflamacao,
    imc_valor, imc_classificacao, projectionMin, projectionMax,
  } = results;

  const dynamicBenefits = DYNAMIC_BENEFITS
    .filter(b => answers.symptoms.includes(b.key))
    .slice(0, 2);

  return (
    <div className="step">
      <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>🎉 <strong className="nome-destaque">{name}</strong>, seu protocolo está pronto.</h2>

      <div style={{ fontSize: '17px', lineHeight: 1.55, color: '#1A1A1A', margin: '16px 0 20px' }}>
        <p style={{ margin: '0 0 10px' }}>Sua análise foi concluída.</p>
        <p style={{ margin: 0 }}>Identificamos o principal fator que está dificultando a redução da sua barriga depois dos 40 — e a boa notícia é que ele tem solução.</p>
      </div>

      <div className="profile-card">
        <ProfileRow icon="🩸" label="Fase hormonal"   value={fase_hormonal} />
        <ProfileRow icon="🎯" label="Tipo de barriga"  value={getBellyLabel(answers.bellyLocation)} />
        <ProfileRow icon="📊" label="Metabolismo"      value={`${X_metabolismo}% da capacidade`} />
        <ProfileRow icon="⚠️" label="Cortisol"         value={`${Y_cortisol}% acima do ideal`} />
        <ProfileRow icon="🔥" label="Inflamação"       value={`nível ${nivel_inflamacao}`} />
        <ProfileRow icon="📏" label="IMC"              value={`${imc_valor} (${imc_classificacao})`} />
        <ProfileRow icon="🦴" label="Limitações"       value={getLimitLabel(answers.limitations)} />
        <ProfileRow icon="✨" label="Potencial"        value={`-${projectionMin} a -${projectionMax} cm em 21 dias`} highlight />
      </div>

      <div style={{ background: '#FFF8E1', border: '2px solid #C9A227', borderRadius: '12px', padding: '18px 16px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 8px' }}>🎯 Método indicado para o seu caso:</p>
        <p style={{ fontSize: '22px', fontWeight: 700, color: '#D32F2F', margin: '0 0 4px', lineHeight: 1.2 }}>🔥 <strong>MÉTODO PAREDE 40+</strong></p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#666666', margin: 0 }}>O Protocolo Hormonal Personalizado da Barriga 40+</p>
      </div>

      <div style={{ fontSize: '17px', lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 20px' }}>
        <p style={{ margin: '0 0 8px' }}><strong className="nome-destaque">{name}</strong>, <strong>seu corpo não precisa de mais esforço.</strong></p>
        <p style={{ margin: 0 }}>Precisa do caminho certo pra fase em que você está.</p>
      </div>

      <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 24px', lineHeight: 1.8 }}>
        <p style={{ margin: '4px 0' }}>⏱️ <strong>8 minutos por dia</strong></p>
        <p style={{ margin: '4px 0' }}>📍 Em casa, contra uma parede</p>
        <p style={{ margin: '4px 0' }}>🚫 Sem cardio · sem dieta · sem caneta</p>
      </div>

      <div style={{ background: '#FAF7F2', border: '1px solid #E8DCC4', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
        <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px' }}>🎯 Seu protocolo foi ajustado para:</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>
          ✅ <strong>Reduzir {projectionMin} a {projectionMax} cm de cintura em 21 dias</strong>
        </p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ Desinchar e voltar a vestir suas roupas com mais conforto</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ Recuperar energia e disposição</p>
        {dynamicBenefits.map(b => (
          <p key={b.key} style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ {b.text}</p>
        ))}
      </div>

      <div className="instructor-quote" style={{ textAlign: 'left' }}>
        <img
          src="/imagem/instrutora.jpg"
          alt="Instrutora do Método Parede"
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 12px' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', textAlign: 'center', margin: '0 0 4px' }}>Criado por Instrutora, 47 anos</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#666666', textAlign: 'center', margin: '0 0 14px' }}>Especialista em emagrecimento feminino na menopausa · Criadora do Método Parede 40+</p>
        <em style={{ fontSize: '16px', lineHeight: 1.55, color: '#1A1A1A', display: 'block' }}>
          "Há <strong>12 anos</strong> ajudo mulheres 40+ a reduzirem a barriga, voltarem a vestir suas roupas com confiança e recuperarem a sensação de que o próprio corpo responde novamente.
          <br /><br />
          Foi por isso que criei o Método Parede 40+ — um caminho pensado para essa fase da mulher, feito para trabalhar <strong>a seu favor, e não contra você</strong>."
        </em>
      </div>

      <p style={{ fontSize: '15px', color: '#555555', textAlign: 'center', lineHeight: 1.5, margin: '24px 0 16px' }}>
        👇 Veja os próximos passos para começar<br />a reduzir sua barriga de forma personalizada.
      </p>

      <button
        className="cta-btn"
        style={{ marginTop: 0, background: '#16A34A' }}
        onClick={onNext}
      >
        🔓 LIBERAR MEU PROTOCOLO COMPLETO →
      </button>
    </div>
  );
}

// ─── E23 — Ponte para VSL ──────────────────────────────────────────────────────
export function StepFinal({ answers }) {
  const name = answers?.name || 'você';

  const handleVSL = () => {
    const params = new URLSearchParams({
      nome: answers?.name || '',
      email: answers?.email || '',
    });
    window.location.href = `/vsl-metodo-parede-40-plus?${params.toString()}`;
  };

  return (
    <div className="step">
      <div className="diagnosis-alert" style={{ background: '#FFF8E1', borderColor: '#C9A227', color: '#7B5800' }}>
        🎯 {name}, seu Método Parede 40+ personalizado está PRONTO.
      </div>

      <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#333', margin: '16px 0' }}>
        Antes de acessar seu protocolo, assista à apresentação rápida (5 min). Ela vai mostrar:
      </p>

      <ul style={{ fontSize: '14px', lineHeight: 1.9, color: '#333', paddingLeft: '20px', margin: '0 0 20px' }}>
        <li>✓ Como ativar seu metabolismo já na primeira semana</li>
        <li>✓ Por que esse método funciona onde os outros falharam</li>
        <li>✓ Os bônus que vão junto com seu protocolo</li>
      </ul>

      <div className="microcopy" style={{ textAlign: 'center', background: '#FFF3CD', borderColor: '#FFCA28', margin: '0 0 20px' }}>
        ⚠️ O acesso ao Método Parede 40+ é liberado após a apresentação.
      </div>

      <button className="cta-btn" onClick={handleVSL}>
        ▶ ASSISTIR E LIBERAR MEU PROTOCOLO →
      </button>

      <div className="testimonial" style={{ marginTop: '24px' }}>
        <div className="stars">⭐⭐⭐⭐⭐</div>
        <div className="name">Beatriz, 52 anos</div>
        <div className="text">"Achei que era frescura. Funcionou. Em 21 dias minha barriga reduziu 7cm e eu nunca me senti tão eu mesma de novo."</div>
      </div>
    </div>
  );
}
