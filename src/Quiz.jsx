import { useState, useEffect, useRef } from 'react';
import { calculateScores } from './quiz-data.js';
import { WelcomeAge, StepSocialProof, StepBodyType, StepBelly, StepProof } from './components/WelcomeSteps.jsx';
import { StepPastAttempts, StepLimitations, StepImpact, StepBelief, StepFrustration, StepLoading1 } from './components/MiddleSteps.jsx';
import { StepDiagnosis, StepSymptoms, StepRoutine, StepHeight, StepWeight, StepAge, StepAcceptance, StepLoading2 } from './components/DiagnosisSteps.jsx';
import { StepProjection, StepName, StepEmail, StepFutureFear, StepCommitment, StepProfile, StepFinal } from './components/FinalSteps.jsx';

// E1 (WelcomeAge) não conta na barra; steps 1-25 = E1.5 até E23
const TOTAL_STEPS = 25;

const initialAnswers = {
  age: null, bodyType: null, bellyLocation: null,
  pastAttempts: [], limitations: [], emotionalImpact: [],
  belief: null, frustration: null, symptoms: [],
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

  const showProgress = step > 0;

  return (
    <div className="quiz-app" ref={containerRef}>
      <div className="progress-bar">
        {showProgress && (
          <div className="progress-fill" style={{ width: `${Math.min(100, (step / TOTAL_STEPS) * 100)}%` }} />
        )}
      </div>

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
      {/* E6 */}
      {step === 6  && <StepLimitations answers={answers} toggle={toggleMulti} onNext={next} />}
      {/* E7 */}
      {step === 7  && <StepImpact answers={answers} toggle={toggleMulti} onNext={next} />}
      {/* E8 */}
      {step === 8  && <StepBelief answers={answers} update={updateAnswer} onNext={next} />}
      {/* E9 */}
      {step === 9  && <StepFrustration update={updateAnswer} onNext={next} />}
      {/* E10 */}
      {step === 10 && <StepLoading1 onDone={computeAndAdvance} />}
      {/* E10.1 */}
      {step === 11 && <StepDiagnosis results={results} onNext={next} />}
      {/* E11 */}
      {step === 12 && <StepSymptoms answers={answers} toggle={toggleMulti} onNext={next} />}
      {/* E12 */}
      {step === 13 && <StepRoutine update={updateAnswer} onNext={next} />}
      {/* E13 — Altura */}
      {step === 14 && <StepHeight answers={answers} update={updateAnswer} onNext={next} />}
      {/* E14 — Peso + IMC */}
      {step === 15 && <StepWeight answers={answers} update={updateAnswer} onNext={next} />}
      {/* E15 — Idade Exata */}
      {step === 16 && <StepAge answers={answers} update={updateAnswer} onNext={next} />}
      {/* E16 */}
      {step === 17 && <StepAcceptance update={updateAnswer} onNext={next} />}
      {/* E17-loading */}
      {step === 18 && <StepLoading2 answers={answers} setResults={setResults} onNext={next} />}
      {/* E17-projeção */}
      {step === 19 && <StepProjection results={results} answers={answers} onNext={next} />}
      {/* E18 */}
      {step === 20 && <StepName answers={answers} update={updateAnswer} onNext={next} />}
      {/* E19 */}
      {step === 21 && <StepEmail answers={answers} update={updateAnswer} onNext={next} />}
      {/* E20 */}
      {step === 22 && <StepFutureFear answers={answers} update={updateAnswer} onNext={next} />}
      {/* E21 */}
      {step === 23 && <StepCommitment answers={answers} update={updateAnswer} onNext={next} />}
      {/* E22 */}
      {step === 24 && <StepProfile answers={answers} results={results} onNext={next} />}
      {/* E23 */}
      {step === 25 && <StepFinal answers={answers} />}
    </div>
  );
}
