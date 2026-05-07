import type { AnswerState, DivisionProblem, GamePhase } from '../types';

type ProblemCardProps = {
  problem: DivisionProblem;
  phase: GamePhase;
  selectedQuotient: number | null;
  selectedRemainder: number | null;
  answerState: AnswerState;
  round: number;
  totalRounds: number;
  onPickQuotient: (value: number) => void;
  onPickRemainder: (value: number) => void;
};

export const ProblemCard = ({
  problem,
  phase,
  selectedQuotient,
  selectedRemainder,
  answerState,
  round,
  totalRounds,
  onPickQuotient,
  onPickRemainder,
}: ProblemCardProps) => {
  const isChecking = answerState !== 'idle';
  const activeOptions = phase === 'quotient' ? problem.quotientOptions : problem.remainderOptions;
  const selectedAnswer = phase === 'quotient' ? selectedQuotient : selectedRemainder;
  const handlePick = phase === 'quotient' ? onPickQuotient : onPickRemainder;
  const quotientClass =
    selectedQuotient === null
      ? 'math-slot--empty'
      : selectedQuotient === problem.quotient
        ? 'math-slot--correct'
        : 'math-slot--wrong';
  const remainderClass =
    selectedRemainder === null
      ? 'math-slot--empty'
      : selectedRemainder === problem.remainder
        ? 'math-slot--correct'
        : 'math-slot--wrong';
  const statusText =
    answerState === 'correct'
      ? 'Správně!'
      : answerState === 'wrong'
        ? 'Zkus to ještě jednou'
        : phase === 'quotient'
          ? 'Nejdříve vyber podíl.'
          : 'Teď vyber zbytek.';

  return (
    <section className="problem-card" aria-live="polite">
      <div className="problem-card__header">
        <span>Příklad {round} z {totalRounds}</span>
        <span>{phase === 'quotient' ? '1. podíl' : '2. zbytek'}</span>
      </div>

      <div className="math-expression">
        <span className="math-slot math-slot--dividend">{problem.dividend}</span>
        <span className="math-operator">÷</span>
        <span className="math-slot math-slot--divisor">{problem.divisor}</span>
        <span className="math-operator">=</span>
        <span className={`math-slot math-slot--quotient ${quotientClass}`}>
          {selectedQuotient ?? '_'}
        </span>
        <span className="math-remainder" aria-label="zbytek">
          (<span className={remainderClass}>{selectedRemainder ?? ' '}</span>)
        </span>
      </div>

      <p className="status-line">{statusText}</p>

      <div className="answer-grid">
        {activeOptions.map((option) => {
          const isSelected = selectedAnswer === option;
          const feedbackClass =
            answerState === 'idle'
              ? ''
              : answerState === 'correct' && isSelected
                ? 'answer-button--correct'
                : answerState === 'wrong' && isSelected
                  ? 'answer-button--wrong'
                  : '';

          return (
            <button
              className={`answer-button ${feedbackClass}`}
              type="button"
              key={option}
              disabled={isChecking}
              onClick={() => handlePick(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
};
