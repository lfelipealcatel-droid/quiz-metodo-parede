import { getBellyLabel, getLimitLabel } from '../quiz-data.js';

// ─── E17-projeção — Resultado ──────────────────────────────────────────────────
export function StepProjection({ results, answers, onNext }) {
  if (!results) return null;
  const { projectionMin, projectionMax } = results;

  return (
    <div className="step">
      <div className="diagnosis-alert" style={{ background: '#FFF8E1', borderColor: '#C9A227', color: '#7B5800' }}>
        🎉 SUA PROJEÇÃO DE RESULTADO
      </div>

      <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#333', margin: '12px 0' }}>
        Com base no seu perfil exato, ao seguir o método recomendado para você:
      </p>

      <ul style={{ fontSize: '14px', lineHeight: 1.8, color: '#333', paddingLeft: '20px', margin: '0 0 16px' }}>
        <li>✅ Reduzir <strong>{projectionMin} a {projectionMax} cm de cintura em 21 dias</strong></li>
        <li>✅ Sentir o corpo respondendo já na primeira semana</li>
        <li>✅ Barriga menos inchada e visualmente mais firme em 3-5 dias</li>
      </ul>

      <div className="estimate-box">
        <div className="est-label">SUA ESTIMATIVA PERSONALIZADA</div>
        <div className="est-value">{projectionMin} a {projectionMax} cm</div>
        <div style={{ fontSize: '14px', color: '#444', fontWeight: 600, margin: '2px 0 0' }}>de cintura</div>
        <div style={{ fontSize: '14px', color: '#2E7D32', fontWeight: 700, margin: '2px 0 14px' }}>em 21 dias</div>
        <div style={{ position: 'relative', background: '#E0E0E0', borderRadius: '6px', height: '8px' }}>
          <div style={{ background: 'linear-gradient(to right, #F37021, #FFA040)', borderRadius: '6px', height: '8px', width: '70%' }} />
          <div style={{ position: 'absolute', left: '30%', top: '-7px', fontSize: '15px', transform: 'translateX(-50%)' }}>📍</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', marginTop: '6px' }}>
          <span>{projectionMin}cm</span><span>{projectionMax}cm</span>
        </div>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '20px 0 12px' }}>
        🔥 Resultados reais de mulheres com perfil parecido com o seu:
      </h3>

      <div className="beforeafter">
        <div className="ba-card">
          <img src="/imagem/antes-depois-lucia.jpg" alt="Antes e depois Lúcia" className="ba-img" onError={e => { e.target.style.display = 'none'; }} />
          <strong>-9 cm</strong>
          <small>Lúcia, 51 — perdeu 9 cm em 21 dias</small>
        </div>
        <div className="ba-card">
          <img src="/imagem/antes-depois-beatriz.jpg" alt="Antes e depois Beatriz" className="ba-img" onError={e => { e.target.style.display = 'none'; }} />
          <strong>-7 cm</strong>
          <small>Beatriz, 47 — perdeu 7 cm com hérnia de disco</small>
        </div>
      </div>

      <p className="urgency-question" style={{ margin: '24px 0 8px' }}>
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
      <h2>{name}, se nada mudar nos próximos 6 meses, como você imagina que vai estar?</h2>
      {opts.map(([v, l]) => (
        <button key={v} className="option-btn" onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
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
      <h2>{name}, você está disposta a dedicar apenas 8 minutos por dia nos próximos 21 dias para reverter isso?</h2>
      {opts.map(([v, l]) => (
        <button key={v} className="option-btn" onClick={() => handle(v)}>
          {l} <span className="check">✓</span>
        </button>
      ))}
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

export function StepProfile({ answers, results, onNext }) {
  if (!results) return null;
  const name = answers.name || 'Você';
  const {
    fase_hormonal, X_metabolismo, Y_cortisol, nivel_inflamacao,
    imc_valor, imc_classificacao, projectionMin, projectionMax,
  } = results;

  return (
    <div className="step">
      <h2 style={{ textAlign: 'center' }}>🔥 {name}, aqui está seu perfil completo:</h2>

      <div className="profile-card">
        <ProfileRow icon="🩸" label="Fase hormonal"   value={fase_hormonal} />
        <ProfileRow icon="🎯" label="Tipo de barriga"  value={getBellyLabel(answers.bellyLocation)} />
        <ProfileRow icon="📊" label="Metabolismo"      value={`${X_metabolismo}% da capacidade`} />
        <ProfileRow icon="⚠️" label="Cortisol"         value={`${Y_cortisol}% acima do ideal`} />
        <ProfileRow icon="🔥" label="Inflamação"       value={`nível ${nivel_inflamacao}`} />
        <ProfileRow icon="📏" label="IMC"              value={`${imc_valor} (${imc_classificacao})`} />
        <ProfileRow icon="🦴" label="Limitações"       value={getLimitLabel(answers.limitations)} />
        <ProfileRow icon="✨" label="Potencial"        value={`-${projectionMin} a -${projectionMax} cm em 21 dias`} />
      </div>

      <div style={{ background: '#FFF8E1', border: '2px solid #C9A227', borderRadius: '12px', padding: '18px 16px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#7B5800', margin: '0 0 8px' }}>🎯 Método personalizado para você:</p>
        <p style={{ fontSize: '20px', fontWeight: 900, color: '#D32F2F', margin: '0 0 4px', lineHeight: 1.2 }}>🔥 MÉTODO PAREDE 40+</p>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: 0 }}>O Protocolo Hormonal Personalizado da Barriga 40+</p>
        <hr style={{ border: 'none', borderTop: '1px solid #DDD', margin: '12px 0' }} />
        <p style={{ fontSize: '13px', color: '#333', margin: '4px 0' }}>⏱️ <strong>8 minutos por dia</strong></p>
        <p style={{ fontSize: '13px', color: '#333', margin: '4px 0' }}>📍 Na sua casa, apoiada contra uma parede</p>
        <p style={{ fontSize: '13px', color: '#333', margin: '4px 0' }}>🚫 Sem academia · sem dieta · sem impacto</p>
      </div>

      <div className="instructor-quote">
        <img
          src="/imagem/instrutora.jpg"
          alt="Instrutora do Método Parede"
          style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 10px' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <em>
          "Esse é EXATAMENTE o tipo de caso para o qual desenvolvi o Método Parede.{' '}
          {name}, você está no perfil ideal para resultado rápido."
        </em>
        <span className="instructor-name">— Instrutora, 47 anos · Especialista em treino hormonal feminino</span>
      </div>

      <button className="cta-btn" style={{ marginTop: '20px' }} onClick={onNext}>
        🔓 LIBERAR MEU MÉTODO PAREDE 40+ →
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
