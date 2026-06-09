import { useState, useEffect, useRef } from 'react';
import { calculateScores } from './quiz-data.js';
import { WelcomeAge, StepSocialProof, StepBodyType, StepBelly, StepProof } from './components/WelcomeSteps.jsx';
import { StepPastAttempts, StepLimitations, StepImpact, StepEmotionalBridge, StepBelief, StepFrustration, StepLoading1, StepBodyChange } from './components/MiddleSteps.jsx';
import { StepDiagnosis, StepSymptoms, StepRoutine, StepHeight, StepWeight, StepAge, StepAcceptance, StepLoading2 } from './components/DiagnosisSteps.jsx';
import { StepProjection, StepName, StepEmail, StepFutureFear, StepCommitment, StepFinalLoading, StepProfile, StepFinal } from './components/FinalSteps.jsx';

// ─── Barra de Progresso (estilo BetterMe) ─────────────────────────────────────
const BLOCKS = [
  { label: 'Seu corpo',  start: 2,  end: 4 },
  { label: 'Sua causa',  start: 5,  end: 11 },
  { label: 'Seu perfil', start: 12, end: 21 },
  { label: 'Seu plano',  start: 22, end: 28 },
];

function QuizProgress({ step }) {
  const ORANGE = '#F37021';
  let active = -1;
  for (let i = 0; i < BLOCKS.length; i++) {
    if (step >= BLOCKS[i].start && step <= BLOCKS[i].end) { active = i; break; }
  }
  if (active === -1 && step >= 2) active = BLOCKS.length - 1;

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#fff',
      padding: '10px 24px 12px',
      textAlign: 'center',
      boxShadow: '0 1px 0 #eeeeee',
    }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 700,
        color: ORANGE,
        margin: '0 0 8px',
        letterSpacing: '0.02em',
      }}>{BLOCKS[active].label}</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        {BLOCKS.map((block, i) => {
          const fill = i < active ? 1
            : i === active ? (step - block.start + 1) / (block.end - block.start + 1)
            : 0;
          return (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: '#E5E7EB', overflow: 'hidden', position: 'relative',
            }}>
              {fill > 0 && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${fill * 100}%`,
                  background: ORANGE,
                  transition: 'width 0.3s ease',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// E1 (WelcomeAge) não conta na barra; steps 1-26 = E1.5 até E23
const TOTAL_STEPS = 28;

const initialAnswers = {
  age: null, bodyType: null, bellyLocation: null,
  pastAttempts: [], limitations: [], emotionalImpact: [],
  belief: null, frustration: null, symptoms: [],
  tempo_mudanca: null,
  routine: null, height: 165, weight: 70, idade: 47,
  acceptance: null, name: '', email: '',
  futureFear: null, commitment: null,
};

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [step]);

  const next = () => setStep(s => s + 1);
  const updateAnswer = (field, value) => setAnswers(prev => ({ ...prev, [field]: value }));
  const toggleMulti = (field, value) => {
    setAnswers(prev => {
      const arr = prev[field];
      const idx = arr.indexOf(value);
      const newArr = idx > -1 ? arr.filter(x => x !== value) : [...arr, value];
      return { ...prev, [field]: newArr };
    });
  };

  // Etapa 5 — atualização atômica de pastAttempts
  const togglePastAttempts = (value) => {
    setAnswers(prev => {
      const current = prev.pastAttempts;
      let newArr;
      if (value === 'nenhuma') {
        newArr = current.includes('nenhuma') ? [] : ['nenhuma'];
      } else {
        const semNenhuma = current.filter(v => v !== 'nenhuma');
        newArr = semNenhuma.includes(value)
          ? semNenhuma.filter(v => v !== value)
          : [...semNenhuma, value];
      }
      return { ...prev, pastAttempts: newArr };
    });
  };

  // Chamado ao fim do Loading 1 (E10) — calcula diagnóstico inicial
  const computeAndAdvance = () => {
    const r = calculateScores(answers);
    setResults(r);
    next();
  };

  return (
    <div className="quiz-app" ref={containerRef}>
      {step >= 2 && <QuizProgress step={step} />}

      {/* E1 */}
      {step === 0  && <WelcomeAge update={updateAnswer} onNext={next} />}
      {/* E1.5 */}
      {step === 1  && <StepSocialProof answers={answers} onNext={next} />}
      {/* E2 */}
      {step === 2  && <StepBodyType update={updateAnswer} onNext={next} />}
      {/* E3 */}
      {step === 3  && <StepBelly answers={answers} update={updateAnswer} onNext={next} />}
      {/* E4 */}
      {step === 4  && <StepProof onNext={next} />}
      {/* E5 */}
      {step === 5  && <StepPastAttempts answers={answers} toggle={togglePastAttempts} onNext={next} />}
      {/* E7 */}
      {step === 6  && <StepImpact toggle={toggleMulti} onNext={next} />}
      {/* E7.2 */}
      {step === 7  && <StepEmotionalBridge onNext={next} />}
      {/* E7.5 */}
      {step === 8  && <StepBodyChange update={updateAnswer} onNext={next} />}
      {/* E8 */}
      {step === 9  && <StepBelief answers={answers} update={updateAnswer} onNext={next} />}
      {/* E9 — sintomas (era E11) */}
      {step === 10 && <StepSymptoms answers={answers} toggle={toggleMulti} onNext={next} />}
      {/* E9.5 — validação (era E9) */}
      {step === 11 && <StepFrustration update={updateAnswer} onNext={next} />}
      {/* E10 */}
      {step === 12 && <StepLoading1 onDone={computeAndAdvance} />}
      {/* E10.1 */}
      {step === 13 && <StepDiagnosis results={results} onNext={next} />}
      {/* E11 — limitações (era E6) */}
      {step === 14 && <StepLimitations answers={answers} toggle={toggleMulti} onNext={next} />}
      {/* E12 */}
      {step === 15 && <StepRoutine update={updateAnswer} onNext={next} />}
      {/* E13 — Altura */}
      {step === 16 && <StepHeight answers={answers} update={updateAnswer} onNext={next} />}
      {/* E14 — Peso + IMC */}
      {step === 17 && <StepWeight answers={answers} update={updateAnswer} onNext={next} />}
      {/* E15 — Idade Exata */}
      {step === 18 && <StepAge answers={answers} update={updateAnswer} onNext={next} />}
      {/* E16 */}
      {step === 19 && <StepAcceptance update={updateAnswer} onNext={next} />}
      {/* E17-loading */}
      {step === 20 && <StepLoading2 answers={answers} setResults={setResults} onNext={next} />}
      {/* E17-projeção */}
      {step === 21 && <StepProjection results={results} answers={answers} onNext={next} />}
      {/* E18 */}
      {step === 22 && <StepName answers={answers} update={updateAnswer} onNext={next} />}
      {/* E19 */}
      {step === 23 && <StepEmail answers={answers} update={updateAnswer} onNext={next} />}
      {/* E20 */}
      {step === 24 && <StepFutureFear answers={answers} update={updateAnswer} onNext={next} />}
      {/* E21 */}
      {step === 25 && <StepCommitment answers={answers} update={updateAnswer} onNext={next} />}
      {/* E21.5 */}
      {step === 26 && <StepFinalLoading answers={answers} onNext={next} />}
      {/* E22 */}
      {step === 27 && <StepProfile answers={answers} results={results} onNext={next} />}
      {/* E23 */}
      {step === 28 && <StepFinal answers={answers} />}
    </div>
  );
}
