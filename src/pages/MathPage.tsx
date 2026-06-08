import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Sparkles, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '../components/Button.tsx';
import { TeacherAvatar, TeacherExpression } from '../components/TeacherAvatar.tsx';
import { useStore } from '../store/store.ts';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin-top: 1rem;
`;

const GameCard = styled(motion.div)`
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadiusFull};
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  border-radius: ${({ theme }) => theme.borderRadiusFull};
`;

const LevelBadge = styled.div`
  background: ${({ theme }) => theme.primary}15;
  color: ${({ theme }) => theme.primary};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadiusFull};
  font-weight: 800;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${({ theme }) => theme.primary}30;
`;

const EquationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  font-size: 3.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.onSurface};
`;

const NumberBox = styled(motion.div)<{ $color?: string; $highlighted?: boolean }>`
  background: ${({ theme, $color }) => $color || theme.surfaceVariant};
  border: 2px solid ${({ theme, $highlighted }) => $highlighted ? '#10b981' : theme.border};
  padding: 0.75rem 1.75rem;
  border-radius: 24px;
  min-width: 110px;
  box-shadow: ${({ $highlighted }) => $highlighted ? '0 0 15px rgba(16, 185, 129, 0.5)' : '0 6px 0 rgba(0,0,0,0.15)'};
  transition: all 0.3s ease;
`;

const VisualAidContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(0,0,0,0.15);
  border-radius: 20px;
  max-width: 600px;
`;

const VisualRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

const VisualItem = styled(motion.div)<{ $color: string; $highlighted?: boolean }>`
  color: ${({ $color }) => $color};
  filter: ${({ $highlighted }) => $highlighted ? 'drop-shadow(0 0 8px #fbbf24)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'};
  transform: ${({ $highlighted }) => $highlighted ? 'scale(1.2)' : 'scale(1)'};
  transition: all 0.3s ease;
`;

const RegoloBlock = styled(motion.div)<{ $length: number; $color: string; $highlighted?: boolean }>`
  height: 32px;
  width: ${({ $length }) => $length * 20}px;
  background: ${({ $color }) => $color};
  border-radius: 8px;
  box-shadow: inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
  border: ${({ $highlighted }) => $highlighted ? '3px solid #fbbf24' : 'none'};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const FeedbackMessage = styled(motion.div)<{ $success: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${({ theme, $success }) => $success ? theme.success : theme.error};
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-' | 'x' | ':';
  answer: number;
  options: number[];
  fractionData?: { numerator: number; denominator: number };
}

export const MathPage: React.FC = () => {
  const { mathGrade, setMathGrade } = useStore();
  const [question, setQuestion] = useState<Question | null>(null);
  
  // Stati per la gestione intelligente degli errori
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [teacherMsg, setTeacherMsg] = useState("Pronto per la sfida dei numeri? Scegli la risposta corretta!");
  const [teacherExpression, setTeacherExpression] = useState<TeacherExpression>("neutral");

  const generateQuestion = () => {
    setSelectedAnswer(null);
    setIsSolved(false);
    setAttempts(0);
    setWrongAnswers([]);
    setTeacherExpression("neutral");
    
    let num1 = 0, num2 = 0, answer = 0;
    let operator: '+' | '-' | 'x' | ':' = '+';
    let fractionData: { numerator: number; denominator: number } | undefined;

    switch (mathGrade) {
      case 1:
        operator = Math.random() > 0.5 ? '+' : '-';
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = operator === '+' ? num1 + num2 : num1 - num2;
        if (operator === '+' && answer > 10) {
          num1 = 5;
          num2 = 3;
          answer = 8;
        }
        break;

      case 2:
        operator = Math.random() > 0.6 ? 'x' : (Math.random() > 0.5 ? '+' : '-');
        if (operator === 'x') {
          num1 = Math.floor(Math.random() * 4) + 2;
          num2 = Math.floor(Math.random() * 5) + 1;
          answer = num1 * num2;
        } else {
          num1 = Math.floor(Math.random() * 15) + 10;
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = operator === '+' ? num1 + num2 : num1 - num2;
        }
        break;

      case 3:
        operator = Math.random() > 0.5 ? 'x' : ':';
        if (operator === 'x') {
          num1 = Math.floor(Math.random() * 8) + 2;
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = num1 * num2;
        } else {
          num2 = Math.floor(Math.random() * 7) + 2;
          answer = Math.floor(Math.random() * 8) + 2;
          num1 = answer * num2;
        }
        break;

      case 4:
        operator = ':';
        num2 = Math.floor(Math.random() * 8) + 3;
        answer = Math.floor(Math.random() * 15) + 5;
        num1 = answer * num2;
        break;

      case 5:
        const denominators = [3, 4, 6, 8];
        const denominator = denominators[Math.floor(Math.random() * denominators.length)];
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        fractionData = { numerator, denominator };
        answer = numerator;
        break;
    }

    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const wrongAns = Math.random() > 0.5 ? answer + offset : Math.max(1, answer - offset);
      optionsSet.add(wrongAns);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setQuestion({ num1, num2, operator, answer, options, fractionData });

    // Messaggio iniziale
    if (mathGrade === 1) setTeacherMsg("Conta le stelline magiche per trovare il risultato! ⭐");
    else if (mathGrade === 2) setTeacherMsg("Usa i regoli colorati per aiutarti con i calcoli! 📏");
    else if (mathGrade === 3) setTeacherMsg("Riesci a completare lo schieramento di palline? 🔴");
    else if (mathGrade === 4) setTeacherMsg("Risolvi la divisione misteriosa! Puoi farcela! 💪");
    else if (mathGrade === 5) setTeacherMsg("Guarda la torta colorata! Quale frazione rappresenta la parte evidenziata? 🍰");
  };

  useEffect(() => {
    generateQuestion();
  }, [mathGrade]);

  // Gestione intelligente dell'errore con indizi progressivi
  const handleAnswer = (option: number) => {
    if (isSolved || wrongAnswers.includes(option)) return;

    const correct = option === question?.answer;

    if (correct) {
      setSelectedAnswer(option);
      setIsSolved(true);
      setTeacherExpression("happy");
      
      // Punteggio bonus se indovinato al primo colpo
      const pointsEarned = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);

      setTeacherMsg(attempts === 0 
        ? "Fantastico! Risposta esatta al primo colpo! Sei un vero genio! 🎉" 
        : "Bravissimo! Hai visto che con un po' di attenzione ci sei riuscito? Ottimo lavoro! 🌟"
      );
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D0BCFF', '#7FCFFF', '#FFB1C8', '#81C784']
      });
    } else {
      // Errore: non blocchiamo il gioco, diamo un indizio!
      setWrongAnswers(prev => [...prev, option]);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setStreak(0);
      setTeacherExpression("thinking");

      // Generazione indizi intelligenti in base alla materia e al numero di errori
      if (question) {
        if (mathGrade === 1) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Ci sei quasi! Proviamo a contare di nuovo. Comincia contando le stelline viola: sono esattamente ${question.num1}! 🤔`);
          } else {
            setTeacherExpression("idea");
            setTeacherMsg(`Facciamo insieme: parti da ${question.num1} e aggiungi ${question.num2} stelline azzurre. Prova a contarle tutte di fila! 💡`);
          }
        } 
        else if (mathGrade === 2) {
          if (question.operator === 'x') {
            if (nextAttempts === 1) {
              setTeacherMsg(`La moltiplicazione è un'addizione ripetuta! Significa sommare il numero ${question.num1} per ${question.num2} volte. Proviamo? 🤔`);
            } else {
              setTeacherExpression("idea");
              setTeacherMsg(`Pensa alle tabelline: quanto fa ${question.num1} preso ${question.num2} volte? Puoi contare i pallini nello schieramento! 💡`);
            }
          } else {
            if (nextAttempts === 1) {
              setTeacherMsg(`Guarda la lunghezza dei regoli! Quello viola è lungo ${question.num1}, quello rosa è lungo ${question.num2}. Somma o sottrai le loro lunghezze! 🤔`);
            } else {
              setTeacherExpression("encouraging");
              setTeacherMsg(`Proviamo a semplificare: se a ${question.num1} togliamo/aggiungiamo prima le unità... Dai, fai un altro tentativo! 💪`);
            }
          }
        }
        else if (mathGrade === 3) {
          if (question.operator === ':') {
            if (nextAttempts === 1) {
              setTeacherMsg(`La divisione è l'incontrario della moltiplicazione! Quale numero moltiplicato per ${question.num2} dà come risultato ${question.num1}? 🤔`);
            } else {
              setTeacherExpression("idea");
              setTeacherMsg(`Se hai ${question.num1} caramelle e le dividi in parti uguali tra ${question.num2} amici, quante ne riceve ognuno? Prova a fare i gruppi! 💡`);
            }
          } else {
            if (nextAttempts === 1) {
              setTeacherMsg(`Conta le righe e le colonne dello schieramento! Ci sono ${question.num1} righe. Quanti pallini ci sono in ogni riga? 🤔`);
            } else {
              setTeacherExpression("encouraging");
              setTeacherMsg(`Dai, conta tutti i pallini rosa uno ad uno se ti aiuta! Sei vicinissimo alla soluzione! 💪`);
            }
          }
        }
        else if (mathGrade === 4) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Le divisioni grandi si fanno un passo alla volta. Quante volte ci sta il ${question.num2} nel ${question.num1}? Proviamo con una stima! 🤔`);
          } else {
            setTeacherExpression("idea");
            setTeacherMsg(`Moltiplica le opzioni rimaste per ${question.num2}. Quale ti dà esattamente ${question.num1}? Questo è un trucco da veri matematici! 💡`);
          }
        }
        else if (mathGrade === 5) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Ricorda: il numero sotto (denominatore) indica le fette totali della torta (${question.fractionData?.denominator}). Quante fette sono colorate di viola? 🤔`);
          } else {
            setTeacherExpression("encouraging");
            setTeacherMsg(`Conta solo gli spicchi viola! Quel numero va sopra nella frazione. Dai, riprova! 💪`);
          }
        }
      }
    }
  };

  const handleNext = () => {
    generateQuestion();
  };

  const changeGrade = (grade: number) => {
    setMathGrade(grade);
    setScore(0);
    setStreak(0);
  };

  const renderVisualAid = () => {
    if (!question) return null;

    if (mathGrade === 1) {
      return (
        <VisualAidContainer>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#D0BCFF' }}>Stelline da contare:</p>
          <VisualRow>
            {Array.from({ length: question.num1 }).map((_, i) => (
              <VisualItem 
                key={`v1-${i}`} 
                $color="#D0BCFF" 
                $highlighted={attempts > 0}
                animate={{ scale: [1, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
              >
                <Star size={24} fill="#D0BCFF" />
              </VisualItem>
            ))}
          </VisualRow>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFB1C8' }}>{question.operator}</div>
          <VisualRow>
            {Array.from({ length: question.num2 }).map((_, i) => (
              <VisualItem 
                key={`v2-${i}`} 
                $color="#7FCFFF" 
                $highlighted={attempts > 1}
                animate={{ scale: [1, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
              >
                <Star size={24} fill="#7FCFFF" />
              </VisualItem>
            ))}
          </VisualRow>
        </VisualAidContainer>
      );
    }

    if (mathGrade === 2) {
      return (
        <VisualAidContainer>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#7FCFFF' }}>Regoli Colorati:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <RegoloBlock 
              $length={question.num1} 
              $color="#D0BCFF" 
              $highlighted={attempts > 0}
              initial={{ width: 0 }} 
              animate={{ width: question.num1 * 15 }}
            >
              {question.num1}
            </RegoloBlock>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{question.operator}</div>
            <RegoloBlock 
              $length={question.num2} 
              $color="#FFB1C8" 
              $highlighted={attempts > 1}
              initial={{ width: 0 }} 
              animate={{ width: question.num2 * 15 }}
            >
              {question.num2}
            </RegoloBlock>
          </div>
        </VisualAidContainer>
      );
    }

    if (mathGrade === 3 && question.operator === 'x') {
      return (
        <VisualAidContainer>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#FFB1C8' }}>Schieramento ({question.num1} righe x {question.num2} colonne):</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${question.num2}, 1fr)`, gap: '6px' }}>
            {Array.from({ length: question.num1 * question.num2 }).map((_, i) => (
              <motion.div
                key={i}
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: attempts > 0 ? '#10b981' : '#FFB1C8',
                  boxShadow: attempts > 0 ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none'
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, delay: (i % question.num2) * 0.1 }}
              />
            ))}
          </div>
        </VisualAidContainer>
      );
    }

    if (mathGrade === 5 && question.fractionData) {
      const { numerator, denominator } = question.fractionData;
      const radius = 50;
      const circumference = 2 * Math.PI * radius;
      
      return (
        <VisualAidContainer>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#D0BCFF' }}>Quale frazione rappresenta la parte colorata?</p>
          <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#49454F" strokeWidth="20" />
            <circle 
              cx="60" 
              cy="60" 
              r={radius} 
              fill="none" 
              stroke={attempts > 0 ? '#10b981' : '#D0BCFF'} 
              strokeWidth="20" 
              strokeDasharray={`${(numerator / denominator) * circumference} ${circumference}`}
              style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease' }}
            />
            {Array.from({ length: denominator }).map((_, i) => {
              const angle = (i * 360) / denominator;
              const x2 = 60 + radius * Math.cos((angle * Math.PI) / 180);
              const y2 = 60 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <line 
                  key={i} 
                  x1="60" 
                  y1="60" 
                  x2={x2} 
                  y2={y2} 
                  stroke="#211F26" 
                  strokeWidth="2" 
                />
              );
            })}
          </svg>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#D0BCFF', marginTop: '1rem' }}>
            <span style={{ borderBottom: '3px solid #D0BCFF', paddingBottom: '2px', display: 'inline-block' }}>?</span>
            <br />
            <span>{denominator}</span>
          </div>
        </VisualAidContainer>
      );
    }

    return null;
  };

  return (
    <PageContainer>
      <TeacherAvatar message={teacherMsg} expression={teacherExpression} />

      {/* Selettore di Classe */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#211F26', padding: '4px', borderRadius: '100px', border: '1px solid #49454F' }}>
        {[1, 2, 3, 4, 5].map((g) => (
          <Button 
            key={g} 
            onClick={() => changeGrade(g)}
            $variant={mathGrade === g ? 'filled' : 'outlined'}
            $size="small"
            style={{ border: 'none' }}
          >
            {g}ª Classe
          </Button>
        ))}
      </div>

      {question && (
        <GameCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <LevelBadge>
              <Star size={20} fill="currentColor" />
              Punti: {score}
            </LevelBadge>
            {streak > 1 && (
              <LevelBadge style={{ borderColor: '#FFB1C8', color: '#FFB1C8', background: 'rgba(255,177,200,0.1)' }}>
                <Sparkles size={20} />
                Combo: {streak} 🔥
              </LevelBadge>
            )}
          </div>

          <ProgressBarContainer>
            <ProgressBar 
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min((streak / 5) * 100, 100)}%` }}
              transition={{ duration: 0.4 }}
            />
          </ProgressBarContainer>

          {mathGrade !== 5 && (
            <EquationContainer>
              <NumberBox 
                whileHover={{ scale: 1.05 }}
                style={{ borderColor: '#D0BCFF' }}
              >
                {question.num1}
              </NumberBox>
              <span style={{ color: '#FFB1C8' }}>{question.operator}</span>
              <NumberBox 
                whileHover={{ scale: 1.05 }}
                style={{ borderColor: '#7FCFFF' }}
              >
                {question.num2}
              </NumberBox>
              <span style={{ color: '#FFB1C8' }}>=</span>
              <NumberBox 
                style={{ borderStyle: 'dashed', borderColor: '#FFB1C8' }}
                $highlighted={isSolved}
              >
                {isSolved ? question.answer : '?'}
              </NumberBox>
            </EquationContainer>
          )}

          {renderVisualAid()}

          <OptionsGrid>
            {question.options.map((option, idx) => {
              const isThisWrong = wrongAnswers.includes(option);
              const isThisCorrect = option === question.answer;
              
              let btnVariant: 'filled' | 'tonal' | 'success' | 'error' = 'tonal';
              if (isSolved && isThisCorrect) {
                btnVariant = 'success';
              } else if (isThisWrong) {
                btnVariant = 'error';
              }

              return (
                <Button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  $variant={btnVariant}
                  disabled={isSolved || isThisWrong}
                  style={{ fontSize: '1.8rem', padding: '1.5rem', height: '70px' }}
                >
                  {mathGrade === 5 ? `${option}/${question.fractionData?.denominator}` : option}
                </Button>
              );
            })}
          </OptionsGrid>

          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FeedbackMessage $success={true}>
                  <CheckCircle2 size={32} />
                  Bravissimo! Risposta Corretta!
                </FeedbackMessage>
                
                <Button 
                  onClick={handleNext} 
                  $variant="filled" 
                  $size="large"
                  style={{ marginTop: '2rem' }}
                >
                  Prossimo Gioco <ArrowRight size={24} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </GameCard>
      )}
    </PageContainer>
  );
};
