import { useState, useEffect, useRef, useMemo } from 'react';
import { getBellyLabel, getLimitLabel } from '../quiz-data.js';
import { trackCtaClick } from '../lib/analytics.js';

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

// ─── Carrossel manual de depoimentos ─────────────────────────────────────────
const CAROUSEL_SLIDES = [
  { img: '/imagem/andreia-cavalcanti-42-2-NOVA.png', name: 'Andreia Cavalcanti, 43 anos', cm: '9 cm'  },
  { img: '/imagem/claudia-martins-45-2-NOVA.png',    name: 'Cláudia Martins, 45 anos',    cm: '11 cm' },
  { img: '/imagem/marcia-carvalho-50-2-NOVA.png',    name: 'Márcia Carvalho, 52 anos',    cm: '13 cm' },
  { img: '/imagem/vanessa-lima-46-2-NOVA.png',        name: 'Vanessa Lima, 46 anos',        cm: '9 cm'  },
];

const ORANGE = '#F37021';
const GAP = 12;
const SLIDE_RATIO = 0.88;

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth * SLIDE_RATIO);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const goTo = (newIdx) => {
    // Forward wraps to first; backward clamps at 0
    const clamped = newIdx >= CAROUSEL_SLIDES.length ? 0 : Math.max(0, newIdx);
    setIdx(clamped);
  };

  const onStart = (x) => { setIsDragging(true); startXRef.current = x; setDragOffset(0); };
  const onMove  = (x) => { if (isDragging) setDragOffset(x - startXRef.current); };
  const onEnd   = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -50) goTo(idx + 1);
    else if (dragOffset > 50) goTo(idx - 1);
    setDragOffset(0);
  };

  const trackX = slideWidth > 0 ? -(idx * (slideWidth + GAP)) + dragOffset : 0;

  return (
    <div>
      <p style={{ fontSize: '11px', color: '#777', textAlign: 'center', margin: '0 0 6px' }}>
        ✓ Imagens autorizadas para divulgação
      </p>
      <div
        ref={containerRef}
        style={{ overflow: 'hidden', touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
        onTouchStart={e => onStart(e.touches[0].clientX)}
        onTouchMove={e => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={e => { e.preventDefault(); onStart(e.clientX); }}
        onMouseMove={e => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        <div style={{
          display: 'flex',
          gap: `${GAP}px`,
          transform: `translateX(${trackX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          willChange: 'transform',
          userSelect: 'none',
        }}>
          {CAROUSEL_SLIDES.map((slide, i) => (
            <div key={i} style={{ flexShrink: 0, width: slideWidth > 0 ? `${slideWidth}px` : '88%' }}>
              <img
                src={slide.img}
                alt=""
                draggable={false}
                onError={e => { console.error('Carousel image not found:', slide.img); e.target.style.display = 'none'; }}
                style={{
                  width: '100%',
                  aspectRatio: '9 / 10',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A1A', margin: '0 0 4px', textAlign: 'center' }}>{slide.name}</p>
                <p style={{ fontWeight: 800, fontSize: '14px', color: '#1A1A1A', margin: 0, textAlign: 'center' }}>
                  🔥 Reduziu <span style={{ color: ORANGE }}>{slide.cm}</span> de barriga
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
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
        <li>✅ Barriga menos inchada e mais firme em 3 a 5 dias</li>
        <li>✅ Corpo respondendo já na primeira semana</li>
        <li>✅ Reduzir <strong>{projectionMin} a {projectionMax} cm de barriga em 21 dias</strong></li>
      </ul>

      <div className="estimate-box">
        <div className="est-label">SUA ESTIMATIVA PERSONALIZADA</div>
        <div className="est-value">{projectionMin} a {projectionMax} cm</div>
        <div style={{ fontSize: '14px', color: '#444', fontWeight: 600, margin: '2px 0 0' }}>de barriga</div>
        <div style={{ fontSize: '14px', color: '#2E7D32', fontWeight: 700, margin: '2px 0 14px' }}>em 21 dias</div>
        <ProjectionChart projectionMin={projectionMin} projectionMax={projectionMax} />
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', margin: '32px 0 12px' }}>
        🔥 Resultados reais de mulheres com perfil parecido com o seu:
      </h3>

      <TestimonialsCarousel />

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

// ─── E21.5 — Loading personalizado por idade ──────────────────────────────────
const TESTIMONIALS_BY_AGE = [
  {
    minAge: 40, maxAge: 44,
    text: '"Eu achava que precisava fechar mais a boca e treinar mais. Descobrir que existia uma forma mais inteligente de lidar com essa barriga depois dos 40 mudou minha visão completamente."',
    name: 'Mariana, 43 anos',
    photo: '/imagem/Mariana-43.png',
  },
  {
    minAge: 45, maxAge: 49,
    text: '"Eu já não me reconhecia mais nas minhas roupas. O que me ajudou foi perceber que meu corpo não precisava de mais cobrança — precisava da estratégia certa para essa fase."',
    name: 'Renata, 47 anos',
    photo: '/imagem/Renata-47.png',
  },
  {
    minAge: 50, maxAge: 54,
    text: '"Depois dos 50 eu já tinha tentado de tudo. Pela primeira vez encontrei uma abordagem que parecia ter sido pensada para mulheres como eu."',
    name: 'Patrícia, 52 anos',
    photo: '/imagem/Patricia-52.png',
  },
  {
    minAge: 55, maxAge: 99,
    text: '"Eu acreditava que era tarde demais para mudar. Descobrir que ainda existia um caminho possível para a minha fase foi o que mais me deu esperança."',
    name: 'Sandra, 57 anos',
    photo: '/imagem/Sandra-57.png',
  },
];

export function StepFinalLoading({ answers, onNext }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; });

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => Math.min(p + 1, 100));
    }, 55); // 55ms × 100 = 5,5s
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(() => onNextRef.current(), 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  const idade = answers?.idade ?? 47;
  const testimonial = useMemo(() =>
    TESTIMONIALS_BY_AGE.find(t => idade >= t.minAge && idade <= t.maxAge)
    ?? TESTIMONIALS_BY_AGE[1],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const R = 52;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - progress / 100);

  return (
    <div className="step" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Textos de contexto */}
      <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>
        Estamos preparando seu protocolo personalizado...
      </p>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.55, margin: '0 0 24px' }}>
        Analisando suas respostas e ajustando os detalhes finais para o seu caso.
      </p>

      {/* Circular loader */}
      <svg width="136" height="136" viewBox="0 0 136 136" style={{ margin: '0 0 28px' }}>
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
          style={{ transition: 'stroke-dashoffset 0.055s linear' }}
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

      {/* Depoimento por idade */}
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: '15px', margin: '0 0 14px' }}>⭐⭐⭐⭐⭐</p>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#1A1A1A', margin: '0 0 10px', fontStyle: 'italic' }}>
          <strong>{testimonial.text}</strong>
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#555', margin: '0 0 16px' }}>
          {testimonial.name}
        </p>
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #F37021',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Prova social */}
      <p style={{ fontSize: '14px', color: '#666', margin: '32px 0 0' }}>
        👩‍🦰 Mais de 23.847 mulheres 40+ já passaram por esta análise personalizada.
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
        <p style={{ margin: '0 0 10px' }}>Você não tem um problema de força de vontade. Você tem um corpo que entrou numa nova fase hormonal — e até agora ninguém tinha te dado o caminho certo pra ela.</p>
        <p style={{ margin: 0 }}><strong>Agora você tem.</strong></p>
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
        <p style={{ fontSize: '22px', fontWeight: 700, color: '#D32F2F', margin: '0 0 4px', lineHeight: 1.2 }}>🔥 <strong>PLANO BARRIGA HORMONAL 40+</strong></p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#666666', margin: 0 }}>O Protocolo de 21 Dias personalizado para o seu perfil hormonal</p>
      </div>

      <div style={{ fontSize: '17px', lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 20px' }}>
        <p style={{ margin: '0 0 8px' }}><strong className="nome-destaque">{name}</strong>, <strong>seu corpo não precisa de mais esforço.</strong></p>
        <p style={{ margin: 0 }}>Precisa do caminho certo pra fase em que você está.</p>
      </div>

      <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 24px', lineHeight: 1.8 }}>
        <p style={{ margin: '4px 0' }}>⏱️ <strong>8 minutos por dia</strong></p>
        <p style={{ margin: '4px 0' }}>📍 Em casa, sem impacto</p>
        <p style={{ margin: '4px 0' }}>🚫 Sem cardio · sem dieta restritiva · sem contar calorias</p>
      </div>

      <div style={{ background: '#F0FAF0', border: '1.5px solid #2E7D32', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
        <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px' }}>🧬 Seu plano age nas 3 causas da sua barriga ao mesmo tempo:</p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.6, margin: '0 0 8px' }}>1. <strong>Movimento Hormonal</strong> — 8 minutos por dia que ativam o que o exercício comum não alcança</p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.6, margin: '0 0 8px' }}>2. <strong>Alimentação Hormonal</strong> — sem cortar nada, sem contar caloria</p>
        <p style={{ fontSize: '16px', color: '#1A1A1A', lineHeight: 1.6, margin: '0 0 14px' }}>3. <strong>Hábitos Hormonais</strong> — 3 âncoras diárias que destravam seu corpo</p>
        <p style={{ fontSize: '15px', fontStyle: 'italic', color: '#555', margin: 0 }}>Cada pilar age numa ponta do seu Triângulo Hormonal — por isso funciona onde o resto falhou.</p>
      </div>

      <div style={{ background: '#FAF7F2', border: '1px solid #E8DCC4', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
        <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px' }}>🎯 Seu protocolo foi ajustado para:</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>
          ✅ <strong>Reduzir {projectionMin} a {projectionMax} cm de barriga em 21 dias</strong>
        </p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ Voltar a vestir suas roupas com conforto</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ Desinchar já na primeira semana</p>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ Recuperar a energia que sumiu nos últimos meses</p>
        {dynamicBenefits.map(b => (
          <p key={b.key} style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 8px' }}>✅ {b.text}</p>
        ))}
      </div>

      <div className="instructor-quote">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '16px' }}>
          <img
            src="/imagem/especialista-renata-vasconcelos.png"
            alt="Renata Vasconcelos"
            className="expert-photo"
          />
          <div style={{ flex: 1, minWidth: '140px' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px', lineHeight: 1.2 }}>Renata Vasconcelos, 47 anos</p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#666666', margin: '0 0 8px', lineHeight: 1.4 }}>Especialista em emagrecimento feminino na menopausa</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#F37021', margin: 0 }}>Criadora do Plano Barriga Hormonal 40+</p>
          </div>
        </div>
        <em style={{ fontSize: '16px', lineHeight: 1.55, color: '#1A1A1A', display: 'block' }}>
          "Há <strong>12 anos</strong> ajudo mulheres 40+ a reduzirem a barriga, voltarem a vestir suas roupas com confiança e recuperarem a sensação de que o próprio corpo responde novamente.
          <br /><br />
          Foi por isso que criei o Plano Barriga Hormonal 40+ — um caminho pensado para essa fase da mulher, feito para trabalhar <strong>a seu favor, e não contra você</strong>."
        </em>
      </div>

      <p style={{ fontSize: '15px', color: '#555555', textAlign: 'center', lineHeight: 1.6, margin: '24px 0 16px' }}>
        <strong>{name}</strong>, esse é o caminho que seu corpo está esperando há meses.<br /><br />
        👇 Veja como começar seus primeiros 21 dias.
      </p>

      <button
        className="cta-btn"
        style={{ marginTop: 0, background: '#16A34A' }}
        onClick={async () => {
          const params = new URLSearchParams({ nome: name, cm_min: projectionMin, cm_max: projectionMax });
          await trackCtaClick();
          window.location.href = `https://planobarrigahormonal.vittalle.com.br/?${params.toString()}`;
        }}
      >
        🔓 QUERO MEU PLANO PERSONALIZADO →
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
