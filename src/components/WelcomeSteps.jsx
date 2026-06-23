import { microcopies } from '../quiz-data.js';

// ─── E1 — Hook + Segmentação ───────────────────────────────────────────────────
export function WelcomeAge({ update, onNext }) {
  const cards = [
    { value: '40-44', label: '40-44 anos', img: '/imagem/card-1.jpg' },
    { value: '45-49', label: '45-49 anos', img: '/imagem/card-2.jpg' },
    { value: '50-54', label: '50-54 anos', img: '/imagem/card-3.jpg' },
    { value: '55+',   label: '55+ anos',   img: '/imagem/card-4.jpg' },
  ];

  const handle = (value) => {
    update('age', value);
    setTimeout(onNext, 260);
  };

  return (
    <div className="wa-screen">
      <span className="wa-badge">⭐ QUIZ PERSONALIZADO · 2 MINUTOS</span>

      <h1 className="wa-headline">
        🔥 Descubra por que sua barriga apareceu{' '}
        <span className="wa-orange">depois dos 40</span>
        {' '}— mesmo fazendo tudo certo
      </h1>

      <p className="wa-sub">
        Em 2 minutos, descubra o que realmente mudou no seu corpo depois dos 40 — e por que dietas e academia pararam de funcionar.
      </p>

      <p className="wa-select-guide">Selecione sua faixa etária para começar:</p>

      <div className="wa-grid">
        {cards.map(({ value, label, img }) => (
          <button key={value} className="wa-card" onClick={() => handle(value)}>
            <img
              src={img}
              alt={`Mulher na faixa de ${label}`}
              className="wa-card-img"
              loading="eager"
              decoding="sync"
              fetchpriority="high"
              width="520"
              height="520"
              draggable="false"
            />
            <div className="wa-card-tarja">
              <span>{label}</span>
              <span className="wa-arrow">→</span>
            </div>
          </button>
        ))}
      </div>

      <hr className="wa-divider" />

      <div className="wa-social">
        <p className="wa-social-1">
          ✅ <strong>+23.847</strong> mulheres acima de 40 já fizeram este teste
        </p>
        <p className="wa-social-2">
          <span className="wa-stars">⭐⭐⭐⭐⭐</span> 4.9/5
        </p>
      </div>

      <p className="wa-security">🔒 100% gratuito · Sem cadastro inicial</p>
    </div>
  );
}

// ─── E1.5 — Prova Social + Microcopy por Faixa ────────────────────────────────
const socialProofCopy = {
  '40-44': 'Você está na faixa mais estratégica pra agir — o corpo ainda responde rápido quando o caminho é certo.\n\nContinue pra receber seu diagnóstico personalizado.',
  '45-49': 'A fase que você selecionou é justamente onde a barriga "do nada" mais aparece — e onde mais escutamos: "eu não me reconheço mais".\n\nNão é você. É bioquímica. E tem como reverter.\n\nContinue pra receber seu diagnóstico personalizado.',
  '50-54': 'Na fase que você selecionou, o corpo já opera com REGRAS DIFERENTES.\n\nNão é falta de disciplina. É outro corpo, outra fase — e por isso pede outro caminho. Um que funciona exatamente pra essa fase.\n\nContinue pra descobrir qual é o seu.',
  '55+':   'No seu caso, mulheres acima de 55 têm os resultados MAIS CONSISTENTES quando o caminho é adaptado à fase certa.\n\nNão é "depois dos 55 não tem o que fazer". É outro caminho — e a gente vai te mostrar qual.\n\nContinue pra receber seu diagnóstico personalizado.',
};

export function StepSocialProof({ answers, onNext }) {
  const copy = socialProofCopy[answers.age] || socialProofCopy['40-44'];

  return (
    <div className="ssp-screen">
      <h2 className="ssp-headline">✅ Você está em boa companhia</h2>

      <div className="ssp-img-wrap">
        <img
          src="/imagem/mosaico-7-mulheres.png"
          alt="Mosaico de 7 mulheres que usaram o Método Parede"
          className="ssp-img"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
          draggable="false"
        />
      </div>

      <div className="ssp-social">
        <p className="ssp-number">🌿 +23.847 🌿</p>
        <p className="ssp-social-text">
          mulheres acima de 40 já descobriram<br />
          <span className="ssp-highlight">A CAUSA REAL</span> da barriga que não vai embora
        </p>
        <p className="ssp-stars">⭐⭐⭐⭐⭐ <span className="ssp-rating">4.9/5</span></p>
        <p className="ssp-reviews">baseado em 8.213 avaliações</p>
      </div>

      <div className="ssp-microcopy" style={{ whiteSpace: 'pre-line' }}>
        💬 {copy}
      </div>

      <button className="cta-btn ssp-cta" onClick={onNext}>
        CONTINUAR →
      </button>
    </div>
  );
}

// ─── E2 — Auto-categorização do Corpo ─────────────────────────────────────────
// Sem microcopy, sem botão — clique avança automaticamente
export function StepBodyType({ update, onNext }) {
  const opts = [
    ['magra-engordou', '🔥 Sempre fui magra — e do nada engordei'],
    ['curva-anormal',  '🔥 Sempre tive curva, mas a barriga está fora do normal'],
    ['acima-peso',     '🔥 Estou acima do peso há mais tempo'],
    ['so-barriga',     '🔥 Estou bem, só essa barriga me incomoda'],
  ];
  const handle = (v) => { update('bodyType', v); setTimeout(onNext, 200); };
  return (
    <div className="step">
      <h2 className="quiz-title">Como está seu corpo agora?</h2>
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

// ─── E3 — Tipo de Barriga ──────────────────────────────────────────────────────
export function StepBelly({ answers, update, onNext }) {
  const opts = [
    ['alta',    '🎈 Alta, perto do peito ("pansa que apareceu")',   '/imagem/barriga-alta.png'],
    ['gravida', '🤰 Frente, parece que estou grávida',              '/imagem/barriga-frente.png'],
    ['baixa',   '🫃 Baixa, "popozinho na frente"',                  '/imagem/barriga-baixa.png'],
    ['inchada', '🌪️ Tudo inchado, varia durante o dia',             '/imagem/barriga-inchada.png'],
  ];
  return (
    <div className="step">
      <h2 className="quiz-title">Sua barriga está concentrada onde?</h2>
      <div className="quiz-options">
        {opts.map(([v, l, img]) => (
          <button
            key={v}
            className={`option-btn belly-btn ${answers.bellyLocation === v ? 'selected' : ''}`}
            onClick={() => update('bellyLocation', v)}
          >
            <span className="belly-btn-text">{l}</span>
            <img src={img} alt={l} className="belly-btn-img" />
            <span className="check">✓</span>
          </button>
        ))}
      </div>
      {answers.bellyLocation && (
        <>
          <div className="quiz-microcopy" style={{ whiteSpace: 'pre-line' }}>
            💬 {microcopies.bellyLocation[answers.bellyLocation]}
          </div>
          <button className="cta-btn" onClick={onNext}>Continuar →</button>
        </>
      )}
    </div>
  );
}

// ─── E4 — Triângulo Hormonal (educativa) ──────────────────────────────────────
export function StepProof({ onNext }) {
  return (
    <div className="step proof-step">

      <div className="proof-pause-alert">🔥 O que você vai entender agora muda tudo:</div>

      <p className="proof-intro">
        A barriga depois dos 40 não tem <strong>UMA causa</strong>.<br />
        Tem <strong>TRÊS</strong> — e elas se alimentam uma da outra.
      </p>

      <hr className="proof-hr" />

      <div className="proof-tri-label">
        <span className="proof-tri-sublabel">É o que chamamos de</span>
        <span className="proof-tri-name">TRIÂNGULO HORMONAL 40+:</span>
      </div>

      <div className="proof-tri-list">
        <div className="proof-tri-row">
          <span className="proof-tri-num">1️⃣</span>
          <span>Queda hormonal <em>(estrogênio despenca)</em></span>
        </div>
        <div className="proof-tri-row">
          <span className="proof-tri-num">2️⃣</span>
          <span>Metabolismo travado <em>(queima 30-50% menos)</em></span>
        </div>
        <div className="proof-tri-row">
          <span className="proof-tri-num">3️⃣</span>
          <span>Inflamação silenciosa <em>(gordura abdominal "teimosa")</em></span>
        </div>
      </div>

      <hr className="proof-hr" />

      <div className="proof-img-wrap">
        <img
          src="/imagem/triangulo-hormonal.png"
          alt="Triângulo Hormonal 40+: queda hormonal, metabolismo travado e inflamação silenciosa"
          className="proof-img"
          loading="eager"
          draggable="false"
        />
      </div>

      {/* BLOCO 1 */}
      <div style={{ margin: '16px 0' }}>
        <p className="proof-fire-title">🧬 O que ninguém te explicou:</p>
        <p className="proof-body">
          Não é que você comeu demais. Não é preguiça. Depois dos 40, o estrogênio cai e seu corpo faz{' '}
          <strong>o contrário do que sempre fez</strong>: em vez de queimar gordura, ele guarda tudo na barriga.
          Essa gordura inflama e dispara o cortisol, o hormônio que segura a gordura presa. É o mesmo corpo de sempre,{' '}
          <strong>jogando com regras novas</strong>.
        </p>
      </div>

      <hr className="proof-hr" />

      {/* BLOCO 2 */}
      <div style={{ margin: '16px 0' }}>
        <p className="proof-fire-title">🔥 E aqui está o problema:</p>
        <p className="proof-body"><strong>As 3 se alimentam uma da outra.</strong></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', justifyContent: 'center', margin: '12px 0' }}>
          {['Hormônio cai', 'metabolismo trava', 'inflamação sobe', 'hormônio cai ainda mais'].flatMap((s, i, arr) => [
            <span key={`s${i}`} style={{ background: '#FFF0E6', color: '#D84A00', padding: '5px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>{s}</span>,
            i < arr.length - 1 && <span key={`a${i}`} style={{ color: '#F37021', fontWeight: 700, fontSize: '15px' }}>→</span>,
          ]).filter(Boolean)}
        </div>
        <p className="proof-body">
          É um ciclo — por isso <strong>a barriga não vai embora nem com esforço</strong>.
        </p>
      </div>

      <hr className="proof-hr" />

      {/* BLOCO 3 */}
      <div style={{ margin: '16px 0' }}>
        <p className="proof-fire-title">💡 Por isso nada deu certo:</p>
        <p className="proof-body">
          Você cortou comida, puxou treino, fez tudo que um dia funcionou. E a barriga ficou. Porque dieta dura e treino pesado sobem o cortisol — e{' '}
          <strong>quanto mais você forçava, mais o corpo travava</strong>.{' '}
          <strong>Não foi você que falhou. Foi o caminho</strong>, feito pra uma fase que não é a sua.
        </p>
      </div>

      <hr className="proof-hr" />

      {/* BLOCO 4 */}
      <div className="proof-good-box">
        <p className="proof-good-title">🌱 Mas tem uma saída — e ela muda tudo:</p>
        <p className="proof-good-body">
          <strong>O que tem causa, tem volta</strong>. A barriga que apareceu do nada pode sair do mesmo jeito — não fazendo mais, e sim atacando as 3 pontas juntas, do jeito certo pra sua fase. As próximas perguntas revelam{' '}
          <strong>qual das 3 está travando você agora</strong>.
        </p>
      </div>

      <button className="cta-btn proof-cta-pulse" onClick={onNext}>CONTINUAR →</button>
    </div>
  );
}
