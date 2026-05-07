import { useMemo, useState } from 'react';
import { ProblemCard } from './components/ProblemCard';
import { ProgressBar } from './components/ProgressBar';
import { StatPill } from './components/StatPill';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AnswerState } from './types';
import { generateProblem } from './utils/problemGenerator';

const TOTAL_ROUNDS = 10;
const NEXT_QUESTION_MS = 650;
const WRONG_TRANSITION_MS = 900;

type BestStats = {
  score: number;
  streak: number;
};

export const App = () => {
  const [problem, setProblem] = useState(() => generateProblem());
  const [selectedQuotient, setSelectedQuotient] = useState<number | null>(null);
  const [selectedRemainder, setSelectedRemainder] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [round, setRound] = useState(1);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [legacyBestScore] = useLocalStorage('division-best-score', 0);
  const [bestStats, setBestStats] = useLocalStorage<BestStats>('division-best-stats', {
    score: legacyBestScore,
    streak: 0,
  });

  const completed = round > TOTAL_ROUNDS;
  const progressValue = useMemo(() => Math.min(round - 1, TOTAL_ROUNDS), [round]);
  const visibleBestStats = {
    score: Math.max(bestStats.score, legacyBestScore, score),
    streak: Math.max(bestStats.streak, streak),
  };

  const markWrong = (reset: () => void) => {
    setAnswerState('wrong');
    setStreak(0);
    setMistakes((current) => current + 1);
    window.setTimeout(() => {
      reset();
      setAnswerState('idle');
    }, WRONG_TRANSITION_MS);
  };

  const moveToNextProblem = (nextScore: number) => {
    if (round >= TOTAL_ROUNDS) {
      setRound((current) => current + 1);
      return;
    }

    window.setTimeout(() => {
      setProblem(generateProblem());
      setSelectedQuotient(null);
      setSelectedRemainder(null);
      setAnswerState('idle');
      setRound((current) => current + 1);
    }, NEXT_QUESTION_MS);
  };

  const checkAnswer = (quotient: number, remainder: number) => {
    if (remainder !== problem.remainder) {
      markWrong(() => setSelectedRemainder(null));
      return;
    }

    const nextStreak = streak + 1;
    const nextScore = score + 10 + Math.min(nextStreak, 5) * 2;
    setScore(nextScore);
    setStreak(nextStreak);
    setBestStats((current) => ({
      score: Math.max(current.score, legacyBestScore, nextScore),
      streak: Math.max(current.streak, nextStreak),
    }));
    setAnswerState('correct');
    moveToNextProblem(nextScore);
  };

  const handleQuotientPick = (value: number) => {
    if (answerState !== 'idle') {
      return;
    }

    setSelectedQuotient(value);

    if (value !== problem.quotient) {
      markWrong(() => {
        setSelectedQuotient(null);
        setSelectedRemainder(null);
      });
      return;
    }

    if (selectedRemainder !== null && selectedRemainder === problem.remainder) {
      checkAnswer(value, selectedRemainder);
    }
  };

  const handleRemainderPick = (value: number) => {
    if (answerState !== 'idle') {
      return;
    }

    setSelectedRemainder(value);

    if (selectedQuotient !== null) {
      checkAnswer(selectedQuotient, value);
    }
  };

  const restart = () => {
    setProblem(generateProblem());
    setSelectedQuotient(null);
    setSelectedRemainder(null);
    setScore(0);
    setStreak(0);
    setMistakes(0);
    setRound(1);
    setAnswerState('idle');
  };

  return (
    <main className="app-shell">
      <div className="game-layout">
        <header className="hero-strip">
          <h1>Dělení se zbytkem</h1>
        </header>

        <div className="stats-grid">
          <StatPill label="Skóre" value={score} />
          <StatPill label="Série" value={streak} tone="purple" />
          <StatPill label="Chyby" value={mistakes} tone="red" />
          <StatPill label="Nejlepší" value={`${visibleBestStats.score}/${visibleBestStats.streak}`} tone="blue" />
        </div>

        <ProgressBar value={progressValue} max={TOTAL_ROUNDS} />

        {completed ? (
          <section className="finish-card">
            <p className="eyebrow">Hotovo</p>
            <h2>Máš {score} bodů.</h2>
            <p>
              Chybných odpovědí: {mistakes}. Nejlepší skóre/série: {visibleBestStats.score}/
              {visibleBestStats.streak}.
            </p>
            <button className="primary-button primary-button--wide" type="button" onClick={restart}>
              Hrát znovu
            </button>
          </section>
        ) : (
          <ProblemCard
            problem={problem}
            selectedQuotient={selectedQuotient}
            selectedRemainder={selectedRemainder}
            answerState={answerState}
            round={round}
            totalRounds={TOTAL_ROUNDS}
            onPickQuotient={handleQuotientPick}
            onPickRemainder={handleRemainderPick}
          />
        )}
      </div>
    </main>
  );
};
