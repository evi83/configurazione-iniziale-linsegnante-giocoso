import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Sparkles, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
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
  box-sizing: border-box;
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

const VisualAidContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  max-width: 500px;
  border: 1px solid ${({ theme }) => theme.border};
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

const GridOverlay = styled.div`
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 20px 20px;
  border: 2px dashed ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface GeometryQuestion {
  questionText: string;
  visualType: 'shape' | 'sides' | 'angle' | 'perimeter' | 'area';
  shapeType: 'triangle' | 'square' | 'circle' | 'rectangle' | 'pentagon' | 'hexagon';
  angleType?: 'acuto' | 'retto' | 'ottuso' | 'piatto';
  dimensions?: { width: number; height: number; side?: number; base?: number };
  answer: string | number;
  options: (string | number)[];
}

export const GeometryPage: React.FC = () => {
  const { geometryGrade, setGeometryGrade } = useStore();
  const [question, setQuestion] = useState<GeometryQuestion | null>(null);
  
  // Stati per la gestione intelligente degli errori
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<(string | number)[]>([]);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [teacherMsg, setTeacherMsg] = useState("Benvenuto nel magico mondo della Geometria! Esploriamo le forme insieme!");
  const [teacherExpression, setTeacherExpression] = useState<TeacherExpression>("neutral");

  const generateQuestion = () => {
    setSelectedAnswer(null);
    setIsSolved(false);
    setAttempts(0);
    setWrongAnswers([]);
    setTeacherExpression("neutral");

    let newQuestion: GeometryQuestion;

    switch (geometryGrade) {
      case 1: {
        const shapes: ('triangle' | 'square' | 'circle' | 'rectangle')[] = ['triangle', 'square', 'circle', 'rectangle'];
        const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
        const names = {
          triangle: 'Triangolo 🔺',
          square: 'Quadrato 🟩',
          circle: 'Cerchio 🟡',
          rectangle: 'Rettangolo 🟦'
        };

        newQuestion = {
          questionText: `Quale forma geometrica vedi qui sotto?`,
          visualType: 'shape',
          shapeType: chosenShape,
          answer: names[chosenShape],
          options: Object.values(names).sort(() => Math.random() - 0.5)
        };
        setTeacherMsg("Guarda bene la figura colorata! Che forma ti sembra? ✨");
        break;
      }

      case 2: {
        const shapes: ('triangle' | 'square' | 'rectangle' | 'pentagon' | 'hexagon')[] = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon'];
        const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
        const isAskingSides = Math.random() > 0.5;

        const data = {
          triangle: { sides: 3, vertices: 3, name: 'Triangolo' },
          square: { sides: 4, vertices: 4, name: 'Quadrato' },
          rectangle: { sides: 4, vertices: 4, name: 'Rettangolo' },
          pentagon: { sides: 5, vertices: 5, name: 'Pentagono' },
          hexagon: { sides: 6, vertices: 6, name: 'Esagono' }
        };

        const answer = isAskingSides ? data[chosenShape].sides : data[chosenShape].vertices;
        const options = [3, 4, 5, 6].sort(() => Math.random() - 0.5);

        newQuestion = {
          questionText: `Quanti ${isAskingSides ? 'lati' : 'vertici (punte)'} ha questo ${data[chosenShape].name}?`,
          visualType: 'sides',
          shapeType: chosenShape,
          answer,
          options
        };
        setTeacherMsg(isAskingSides ? "Conta le linee dritte che formano il contorno! 📏" : "Conta le punte o gli angoli della figura! 📍");
        break;
      }

      case 3: {
        const angles: ('acuto' | 'retto' | 'ottuso' | 'piatto')[] = ['acuto', 'retto', 'ottuso', 'piatto'];
        const chosenAngle = angles[Math.floor(Math.random() * angles.length)];
        const names = {
          acuto: 'Angolo Acuto (piccolo e stretto) 📐',
          retto: 'Angolo Retto (come un quadrato) 🧱',
          ottuso: 'Angolo Ottuso (largo e aperto) 📖',
          piatto: 'Angolo Piatto (una linea dritta) ➖'
        };

        newQuestion = {
          questionText: `Che tipo di angolo è questo evidenziato in rosa?`,
          visualType: 'angle',
          shapeType: 'triangle',
          angleType: chosenAngle,
          answer: names[chosenAngle],
          options: Object.values(names).sort(() => Math.random() - 0.5)
        };
        setTeacherMsg("Osserva l'apertura delle due linee. È stretta, a forma di L, o molto larga? 🔍");
        break;
      }

      case 4: {
        const isRectangle = Math.random() > 0.5;
        let width = 0, height = 0, answer = 0, text = "";

        if (isRectangle) {
          width = Math.floor(Math.random() * 4) + 4;
          height = Math.floor(Math.random() * 3) + 2;
          answer = 2 * (width + height);
          text = `Calcola il perimetro di questo rettangolo (Base = ${width} cm, Altezza = ${height} cm)`;
        } else {
          width = Math.floor(Math.random() * 4) + 3;
          height = width;
          answer = width * 4;
          text = `Calcola il perimetro di questo quadrato (Lato = ${width} cm)`;
        }

        const optionsSet = new Set<number>([answer]);
        while (optionsSet.size < 4) {
          optionsSet.add(answer + (Math.floor(Math.random() * 6) - 3) * 2);
        }

        newQuestion = {
          questionText: text,
          visualType: 'perimeter',
          shapeType: isRectangle ? 'rectangle' : 'square',
          dimensions: { width, height },
          answer,
          options: Array.from(optionsSet).sort(() => Math.random() - 0.5)
        };
        setTeacherMsg("Il perimetro è la somma di tutti i lati! Fai il giro completo della figura! 🏃‍♂️");
        break;
      }

      case 5: {
        const isTriangle = Math.random() > 0.5;
        let base = 0, height = 0, answer = 0, text = "";

        if (isTriangle) {
          base = (Math.floor(Math.random() * 3) + 2) * 2;
          height = Math.floor(Math.random() * 3) + 3;
          answer = (base * height) / 2;
          text = `Calcola l'area di questo triangolo (Base = ${base} cm, Altezza = ${height} cm)`;
        } else {
          base = Math.floor(Math.random() * 4) + 4;
          height = Math.floor(Math.random() * 3) + 2;
          answer = base * height;
          text = `Calcola l'area di questo rettangolo (Base = ${base} cm, Altezza = ${height} cm)`;
        }

        const optionsSet = new Set<number>([answer]);
        while (optionsSet.size < 4) {
          optionsSet.add(Math.max(2, answer + (Math.floor(Math.random() * 8) - 4)));
        }

        newQuestion = {
          questionText: text,
          visualType: 'area',
          shapeType: isTriangle ? 'triangle' : 'rectangle',
          dimensions: { width: base, height },
          answer,
          options: Array.from(optionsSet).sort(() => Math.random() - 0.5)
        };
        setTeacherMsg(isTriangle ? "Per il triangolo fai: (Base × Altezza) diviso 2! 📐" : "Moltiplica la base per l'altezza per trovare lo spazio interno! 🟩");
        break;
      }
    }

    setQuestion(newQuestion);
  };

  useEffect(() => {
    generateQuestion();
  }, [geometryGrade]);

  const handleAnswer = (option: string | number) => {
    if (isSolved || wrongAnswers.includes(option)) return;

    const correct = option === question?.answer;

    if (correct) {
      setSelectedAnswer(option);
      setIsSolved(true);
      setTeacherExpression("happy");

      const pointsEarned = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);

      setTeacherMsg(attempts === 0 
        ? "Incredibile! Risposta esatta al primo colpo! Sei un vero geometra spaziale! 🚀📐" 
        : "Bravissimo! Hai trovato la risposta corretta! Ottimo lavoro! 🌟"
      );
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFB1C8', '#D0BCFF', '#7FCFFF', '#FFD8E4']
      });
    } else {
      setWrongAnswers(prev => [...prev, option]);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setStreak(0);
      setTeacherExpression("thinking");

      // Indizi intelligenti per la geometria
      if (question) {
        if (geometryGrade === 1) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Ci sei quasi! Guarda bene i lati: quanti ne ha? Se non ha angoli ed è tutto tondo, che forma è? 🤔`);
          } else {
            setTeacherExpression("idea");
            setTeacherMsg(`Questa figura ha esattamente ${question.shapeType === 'triangle' ? '3 lati (un triangolo!)' : question.shapeType === 'circle' ? '0 lati (un cerchio!)' : '4 lati!'}. Prova ora! 💡`);
          }
        }
        else if (geometryGrade === 2) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Proviamo a contare insieme. Tocca con il dito ogni lato o ogni punta della figura! 🤔`);
          } else {
            setTeacherExpression("idea");
            setTeacherMsg(`Un ${question.shapeType === 'triangle' ? 'Triangolo ha 3' : question.shapeType === 'square' || question.shapeType === 'rectangle' ? 'Quadrato/Rettangolo ha 4' : question.shapeType === 'pentagon' ? 'Pentagono ha 5' : 'Esagono ha 6'} lati e vertici! 💡`);
          }
        }
        else if (geometryGrade === 3) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Guarda l'angolo: se forma una L perfetta come l'angolo di un quaderno, è un angolo RETTO. Se è più stretto è ACUTO, se è più largo è OTTUSO! 🤔`);
          } else {
            setTeacherExpression("encouraging");
            setTeacherMsg(`Questo angolo è ${question.angleType === 'acuto' ? 'molto stretto e piccolo' : question.angleType === 'retto' ? 'perfetto a forma di L' : question.angleType === 'ottuso' ? 'molto largo e aperto' : 'completamente piatto'}. Dai, riprova! 💪`);
          }
        }
        else if (geometryGrade === 4) {
          if (nextAttempts === 1) {
            setTeacherMsg(`Il perimetro è la somma di TUTTI i lati. Se è un rettangolo, ha due basi da ${question.dimensions?.width} cm e due altezze da ${question.dimensions?.height} cm! 🤔`);
          } else {
            setTeacherExpression("idea");
            setTeacherMsg(`Fai questa operazione: ${question.dimensions?.width} + ${question.dimensions?.width} + ${question.dimensions?.height} + ${question.dimensions?.height}. Quale risultato ottieni? 💡`);
          }
        }
        else if (geometryGrade === 5) {
          if (nextAttempts === 1) {
            if (question.shapeType === 'triangle') {
              setTeacherMsg(`Per l'area del triangolo: moltiplica la base (${question.dimensions?.width}) per l'altezza (${question.dimensions?.height}) e poi dividi il risultato a metà! 🤔`);
            } else {
              setTeacherMsg(`Per l'area del rettangolo: basta moltiplicare la base (${question.dimensions?.width}) per l'altezza (${question.dimensions?.height})! 🤔`);
            }
          } else {
            setTeacherExpression("encouraging");
            const calcolo = question.shapeType === 'triangle' 
              ? `(${question.dimensions?.width} × ${question.dimensions?.height}) ÷ 2`
              : `${question.dimensions?.width} × ${question.dimensions?.height}`;
            setTeacherMsg(`Fai il calcolo: ${calcolo}. Dai, il risultato è uno dei numeri rimasti! 💪`);
          }
        }
      }
    }
  };

  const handleNext = () => {
    generateQuestion();
  };

  const changeGrade = (grade: number) => {
    setGeometryGrade(grade);
    setScore(0);
    setStreak(0);
  };

  const renderVisualAid = () => {
    if (!question) return null;

    const primaryColor = "#FFB1C8";
    const secondaryColor = "#7FCFFF";

    if (question.visualType === 'shape' || question.visualType === 'sides') {
      return (
        <VisualAidContainer>
          <svg width="180" height="180" viewBox="0 0 120 120">
            {question.shapeType === 'circle' && (
              <motion.circle 
                cx="60" cy="60" r="45" 
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            )}
            {question.shapeType === 'square' && (
              <motion.rect 
                x="20" y="20" width="80" height="80" rx="8"
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            )}
            {question.shapeType === 'rectangle' && (
              <motion.rect 
                x="10" y="30" width="100" height="60" rx="8"
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
                animate={{ y: [30, 33, 30] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            )}
            {question.shapeType === 'triangle' && (
              <motion.polygon 
                points="60,15 15,100 105,100" 
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            )}
            {question.shapeType === 'pentagon' && (
              <motion.polygon 
                points="60,15 105,50 90,105 30,105 15,50" 
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
              />
            )}
            {question.shapeType === 'hexagon' && (
              <motion.polygon 
                points="60,15 100,38 100,82 60,105 20,82 20,38" 
                fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="4"
              />
            )}
          </svg>
        </VisualAidContainer>
      );
    }

    if (question.visualType === 'angle') {
      let points = "20,100 100,100";
      let line2 = "20,100 100,100";

      if (question.angleType === 'retto') {
        line2 = "20,100 20,20";
      } else if (question.angleType === 'acuto') {
        line2 = "20,100 80,40";
      } else if (question.angleType === 'ottuso') {
        points = "50,100 110,100";
        line2 = "50,100 10,50";
      } else if (question.angleType === 'piatto') {
        points = "10,100 60,100";
        line2 = "60,100 110,100";
      }

      return (
        <VisualAidContainer>
          <svg width="180" height="180" viewBox="0 0 120 120">
            {question.angleType === 'retto' && (
              <rect x="20" y="80" width="20" height="20" fill="none" stroke={secondaryColor} strokeWidth="2" />
            )}
            {question.angleType === 'acuto' && (
              <path d="M 40 100 A 20 20 0 0 0 35 85" fill="none" stroke={secondaryColor} strokeWidth="3" />
            )}
            {question.angleType === 'ottuso' && (
              <path d="M 70 100 A 20 20 0 0 0 38 88" fill="none" stroke={secondaryColor} strokeWidth="3" />
            )}
            {question.angleType === 'piatto' && (
              <path d="M 70 100 A 10 10 0 0 0 50 100" fill="none" stroke={secondaryColor} strokeWidth="3" />
            )}

            <line x1={points.split(' ')[0].split(',')[0]} y1={points.split(' ')[0].split(',')[1]} x2={points.split(' ')[1].split(',')[0]} y2={points.split(' ')[1].split(',')[1]} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            <line x1={line2.split(' ')[0].split(',')[0]} y1={line2.split(' ')[0].split(',')[1]} x2={line2.split(' ')[1].split(',')[0]} y2={line2.split(' ')[1].split(',')[1]} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            
            <circle cx={line2.split(' ')[0].split(',')[0]} cy={line2.split(' ')[0].split(',')[1]} r="6" fill={secondaryColor} />
          </svg>
        </VisualAidContainer>
      );
    }

    if (question.visualType === 'perimeter' || question.visualType === 'area') {
      const w = question.dimensions?.width || 4;
      const h = question.dimensions?.height || 4;
      const scale = 25;

      return (
        <VisualAidContainer>
          <GridOverlay>
            <svg width={w * scale + 40} height={h * scale + 40} viewBox={`0 0 ${w * scale + 40} ${h * scale + 40}`}>
              {Array.from({ length: w + 1 }).map((_, i) => (
                <line key={`g-x-${i}`} x1={20 + i * scale} y1="10" x2={20 + i * scale} y2={h * scale + 30} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              ))}
              {Array.from({ length: h + 1 }).map((_, i) => (
                <line key={`g-y-${i}`} x1="10" y1={20 + i * scale} x2={w * scale + 30} y2={20 + i * scale} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              ))}

              {question.shapeType === 'triangle' ? (
                <polygon 
                  points={`20,${h * scale + 20} ${w * scale + 20},${h * scale + 20} ${w * scale / 2 + 20},20`}
                  fill={`${primaryColor}25`} stroke={primaryColor} strokeWidth="4"
                />
              ) : (
                <rect 
                  x="20" y="20" width={w * scale} height={h * scale}
                  fill={`${primaryColor}25`} stroke={primaryColor} strokeWidth="4"
                  rx="4"
                />
              )}

              <text x={w * scale / 2 + 20} y={h * scale + 38} fill={secondaryColor} fontWeight="bold" textAnchor="middle" fontSize="12">
                {w} cm
              </text>
              <text x="12" y={h * scale / 2 + 24} fill={secondaryColor} fontWeight="bold" textAnchor="end" fontSize="12" style={{ transform: `rotate(-90deg) translate(-${h * scale / 2 + 24}px, 12px)` }}>
                {h} cm
              </text>
            </svg>
          </GridOverlay>
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
            $variant={geometryGrade === g ? 'filled' : 'outlined'}
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
              <Compass size={20} />
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

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '1rem 0', color: '#E6E1E5' }}>
            {question.questionText}
          </h2>

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
                  style={{ fontSize: '1.2rem', padding: '1rem', minHeight: '60px' }}
                >
                  {option}
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
                  Bravissimo! Risposta Esatta!
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
