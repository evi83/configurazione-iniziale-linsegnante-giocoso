import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Sparkles, ArrowRight, CheckCircle2, Volume2 } from 'lucide-react';
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

const LevelBadge = styled.div`
  background: ${({ theme }) => theme.secondary}15;
  color: ${({ theme }) => theme.secondary};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadiusFull};
  font-weight: 800;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${({ theme }) => theme.secondary}30;
`;

const WordContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
`;

const LetterBox = styled(motion.div)<{ $empty?: boolean; $filled?: boolean; $highlighted?: boolean }>`
  width: 65px;
  height: 75px;
  background: ${({ theme, $empty }) => $empty ? 'rgba(0,0,0,0.2)' : theme.surfaceVariant};
  border: 2px solid ${({ theme, $filled, $highlighted }) => 
    $highlighted ? '#10b981' : ($filled ? '#7FCFFF' : '#49454F')};
  border-style: ${({ $empty }) => $empty ? 'dashed' : 'solid'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.onSurface};
  box-shadow: ${({ $highlighted }) => $highlighted ? '0 0 15px rgba(16, 185, 129, 0.5)' : '0 6px 0 rgba(0,0,0,0.15)'};
  transition: all 0.3s ease;
`;

const ImageHint = styled.div`
  font-size: 5.5rem;
  margin: 1.5rem 0;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`;

const SentenceContainer = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.onSurface};
  margin: 2rem 0;
  line-height: 1.6;
  background: rgba(0,0,0,0.15);
  padding: 1.5rem;
  border-radius: 20px;
`;

const GrammarWord = styled.span<{ $highlighted: boolean }>`
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  background: ${({ $highlighted, theme }) => $highlighted ? theme.primaryContainer : 'transparent'};
  color: ${({ $highlighted, theme }) => $highlighted ? theme.primary : 'inherit'};
  border: ${({ $highlighted, theme }) => $highlighted ? `2px dashed ${theme.primary}` : 'none'};
`;

const OptionsGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

interface WordPuzzle {
  word?: string;
  missingIndex?: number;
  hintEmoji?: string;
  sentence?: string;
  targetWord?: string;
  questionText?: string;
  options: string[];
  answer: string;
}

const PUZZLES_GRADE_1: WordPuzzle[] = [
  { word: "CANE", missingIndex: 1, hintEmoji: "🐶", options: ["A", "E", "O", "I"], answer: "A" },
  { word: "SOLE", missingIndex: 0, hintEmoji: "☀️", options: ["S", "M", "L", "P"], answer: "S" },
  { word: "MELA", missingIndex: 2, hintEmoji: "🍎", options: ["L", "R", "T", "P"], answer: "L" },
];

const PUZZLES_GRADE_2: WordPuzzle[] = [
  { word: "GATTO", missingIndex: 3, hintEmoji: "🐱", options: ["T", "TT", "P", "PP"], answer: "TT" },
  { word: "PALLA", missingIndex: 3, hintEmoji: "⚽", options: ["L", "LL", "R", "RR"], answer: "LL" },
  { word: "CAVALLO", missingIndex: 4, hintEmoji: "🐎", options: ["L", "LL", "V", "VV"], answer: "LL" },
];

const PUZZLES_GRADE_3: WordPuzzle[] = [
  { sentence: "Ieri io ___ mangiato una mela.", options: ["ho", "o", "ha", "a"], answer: "ho" },
  { sentence: "I bambini ___ sonno.", options: ["hanno", "anno", "ha", "a"], answer: "hanno" },
  { sentence: "Vado ___ scuola con lo zaino.", options: ["a", "ha", "ad", "o"], answer: "a" },
];

const PUZZLES_GRADE_4: WordPuzzle[] = [
  { sentence: "Il gatto corre veloce nel giardino.", targetWord: "gatto", questionText: "Trova il NOME nella frase:", options: ["gatto", "corre", "veloce", "nel"], answer: "gatto" },
  { sentence: "La maestra spiega una lezione bellissima.", targetWord: "spiega", questionText: "Trova il VERBO nella frase:", options: ["maestra", "spiega", "lezione", "bellissima"], answer: "spiega" },
  { sentence: "Oggi il cielo è azzurro.", targetWord: "azzurro", questionText: "Trova l'AGGETTIVO nella frase:", options: ["Oggi", "cielo", "è", "azzurro"], answer: "azzurro" },
];

const PUZZLES_GRADE_5: WordPuzzle[] = [
  { sentence: "Spero che tu ___ presto a trovarmi.", options: ["venga", "vieni", "venissi", "verrai"], answer: "venga" },
  { sentence: "Se io ___ ricco, comprerei un castello.", options: ["fossi", "sarei", "ero", "sia"], answer: "fossi" },
  { sentence: "Ieri noi ___ al parco giochi.", options: ["siamo andati", "andiamo", "andremo", "fossi andato"], answer: "siamo andati" },
];

export const ItalianPage: React.FC = () => {
  const { italianGrade, setItalianGrade } = useStore();
  const [puzzle, setPuzzle] = useState<WordPuzzle | null>(null);
  
  // Stati per la gestione intelligente degli errori
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [teacherMsg, setTeacherMsg] = useState("Ciao piccolo scrittore! Quale lettera manca per completare la parola?");
  const [teacherExpression, setTeacherExpression] = useState<TeacherExpression>("neutral");

  const generatePuzzle = () => {
    setSelectedAnswer(null);
    setIsSolved(false);
    setAttempts(0);
    setWrongAnswers([]);
    setTeacherExpression("neutral");

    let pool: WordPuzzle[] = [];
    switch (italianGrade) {
      case 1: pool = PUZZLES_GRADE_1; break;
      case 2: pool = PUZZLES_GRADE_2; break;
      case 3: pool = PUZZLES_GRADE_3; break;
      case 4: pool = PUZZLES_GRADE_4; break;
      case 5: pool = PUZZLES_GRADE_5; break;
    }

    const randomPuzzle = pool[Math.floor(Math.random() * pool.length)];
    setPuzzle(randomPuzzle);

    if (italianGrade === 1) setTeacherMsg(`Guarda l'immagine del ${randomPuzzle.hintEmoji}! Quale lettera manca?`);
    else if (italianGrade === 2) setTeacherMsg("Attento alle doppie! Ascolta bene il suono della parola. 🔊");
    else if (italianGrade === 3) setTeacherMsg("La sfida dell'H! Scegli la parola corretta per completare la frase.");
    else if (italianGrade === 4) setTeacherMsg("Analisi grammaticale! Trova la categoria corretta nella frase.");
    else if (italianGrade === 5) setTeacherMsg("I verbi misteriosi! Scegli il tempo verbale corretto.");
  };

  useEffect(() => {
    generatePuzzle();
  }, [italianGrade]);

  const handleAnswer = (option: string) => {
    if (isSolved || wrongAnswers.includes(option) || !puzzle) return;

    const correct = option === puzzle.answer;

    if (correct) {
      setSelectedAnswer(option);
      setIsSolved(true);
      setTeacherExpression("happy");

      const pointsEarned = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);

      setTeacherMsg(attempts === 0 
        ? "Incredibile! Risposta esatta al primo colpo! Sei un vero scrittore! 🎉" 
        : "Bravissimo! Hai trovato la parola corretta! Ottimo lavoro! 🌟"
      );
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7FCFFF', '#D0BCFF', '#FFB1C8', '#81C784']
      });
    } else {
      setWrongAnswers(prev => [...prev, option]);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setStreak(0);
      setTeacherExpression("thinking");

      // Indizi intelligenti per l'italiano
      if (italianGrade === 1) {
        if (nextAttempts === 1) {
          setTeacherMsg(`Ci sei quasi! Proviamo a pronunciare la parola ad alta voce. Che suono senti dopo la consonante? 🤔`);
        } else {
          setTeacherExpression("idea");
          setTeacherMsg(`Ascolta bene: "${puzzle.word}". Manca proprio la vocale "${puzzle.answer}"! Prova a selezionarla! 💡`);
        }
      }
      else if (italianGrade === 2) {
        if (nextAttempts === 1) {
          setTeacherMsg(`Ascolta il suono: è un suono forte e lungo o corto? Le doppie rendono il suono più forte! 🔊 🤔`);
        } else {
          setTeacherExpression("idea");
          setTeacherMsg(`Se diciamo "${puzzle.word?.replace(puzzle.answer, puzzle.options.find(o => o !== puzzle.answer) || '')}" suona strano, vero? Serve la doppia "${puzzle.answer}"! 💡`);
        }
      }
      else if (italianGrade === 3) {
        if (nextAttempts === 1) {
          setTeacherMsg(`Ricorda la regola dell'H: si usa "ho", "hai", "ha", "hanno" quando significa "possedere" o "aver fatto qualcosa"! 🤔`);
        } else {
          setTeacherExpression("encouraging");
          setTeacherMsg(`In questa frase, si parla di un'azione compiuta nel passato ("mangiato" o "sonno" come sensazione). Serve l'H! Prova a rileggere con attenzione. 💪`);
        }
      }
      else if (italianGrade === 4) {
        if (nextAttempts === 1) {
          setTeacherMsg(`Ripassiamo: il NOME indica cose, persone o animali. Il VERBO indica un'azione. L'AGGETTIVO descrive come è una cosa! 🤔`);
        } else {
          setTeacherExpression("idea");
          setTeacherMsg(`La parola che cerchiamo risponde alla domanda: "${puzzle.questionText?.includes('NOME') ? 'Chi compie l\'azione?' : puzzle.questionText?.includes('VERBO') ? 'Cosa fa?' : 'Com\'è?'}"? Prova ora! 💡`);
        }
      }
      else if (italianGrade === 5) {
        if (nextAttempts === 1) {
          setTeacherMsg(`Attenzione al modo del verbo! Se c'è "Spero che..." o "Se io...", stiamo esprimendo un desiderio o un'ipotesi. Serve il Congiuntivo! 🤔`);
        } else {
          setTeacherExpression("encouraging");
          setTeacherMsg(`Il Congiuntivo imperfetto di solito finisce con le "doppie S" (es. fossi, volessi). Prova a guardare le opzioni rimaste! 💪`);
        }
      }
    }
  };

  const handleNext = () => {
    generatePuzzle();
  };

  const changeGrade = (grade: number) => {
    setItalianGrade(grade);
    setScore(0);
    setStreak(0);
  };

  const speakWord = () => {
    if (!puzzle) return;
    const textToSpeak = puzzle.word || puzzle.sentence || "";
    const utterance = new SpeechSynthesisUtterance(textToSpeak.toLowerCase());
    utterance.lang = 'it-IT';
    window.speechSynthesis.speak(utterance);
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
            $variant={italianGrade === g ? 'filled' : 'outlined'}
            $size="small"
            style={{ border: 'none' }}
          >
            {g}ª Classe
          </Button>
        ))}
      </div>

      {puzzle && (
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

          {italianGrade <= 2 && puzzle.word && (
            <>
              <ImageHint>{puzzle.hintEmoji}</ImageHint>
              <Button 
                onClick={speakWord} 
                $variant="outlined" 
                $size="small"
                style={{ marginBottom: '1.5rem' }}
              >
                <Volume2 size={18} /> Ascolta la parola
              </Button>
              <WordContainer>
                {puzzle.word.split('').map((char, idx) => {
                  const isMissing = idx === puzzle.missingIndex;
                  return (
                    <LetterBox 
                      key={idx}
                      $empty={isMissing && !isSolved}
                      $filled={isMissing && isSolved}
                      $highlighted={isMissing && isSolved}
                    >
                      {isMissing 
                        ? (isSolved ? puzzle.answer : '?') 
                        : char
                      }
                    </LetterBox>
                  );
                })}
              </WordContainer>
            </>
          )}

          {italianGrade === 3 && puzzle.sentence && (
            <>
              <SentenceContainer>
                {puzzle.sentence.split('___').map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    {part}
                    {idx < arr.length - 1 && (
                      <span style={{ color: '#7FCFFF', borderBottom: '3px dashed #7FCFFF', padding: '0 10px' }}>
                        {isSolved ? puzzle.answer : '___'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </SentenceContainer>
              <Button onClick={speakWord} $variant="outlined" $size="small" style={{ marginBottom: '1.5rem' }}>
                <Volume2 size={18} /> Ascolta la frase
              </Button>
            </>
          )}

          {italianGrade === 4 && puzzle.sentence && (
            <>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#D0BCFF' }}>{puzzle.questionText}</p>
              <SentenceContainer>
                {puzzle.sentence.split(' ').map((word, idx) => {
                  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                  const isTarget = cleanWord.toLowerCase() === puzzle.targetWord?.toLowerCase();
                  return (
                    <GrammarWord key={idx} $highlighted={isSolved && isTarget}>
                      {word}{' '}
                    </GrammarWord>
                  );
                })}
              </SentenceContainer>
            </>
          )}

          {italianGrade === 5 && puzzle.sentence && (
            <>
              <SentenceContainer>
                {puzzle.sentence.split('___').map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    {part}
                    {idx < arr.length - 1 && (
                      <span style={{ color: '#FFB1C8', borderBottom: '3px dashed #FFB1C8', padding: '0 10px' }}>
                        {isSolved ? puzzle.answer : '___'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </SentenceContainer>
            </>
          )}

          <OptionsGrid>
            {puzzle.options.map((option, idx) => {
              const isThisWrong = wrongAnswers.includes(option);
              const isThisCorrect = option === puzzle.answer;

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
                  style={{ fontSize: '1.5rem', minWidth: '100px', height: '60px' }}
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
