import type { AnswerState, DivisionProblem } from '../types';

type ProblemCardProps = {
  problem: DivisionProblem;
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
  selectedQuotient,
  selectedRemainder,
  answerState,
  round,
  totalRounds,
  onPickQuotient,
  onPickRemainder,
}: ProblemCardProps) => {
  const isChecking = answerState !== 'idle';
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
        : selectedQuotient === null && selectedRemainder === null
          ? 'Vyber podíl vlevo a zbytek vpravo.'
          : selectedQuotient === null
            ? 'Ještě vyber podíl.'
            : selectedRemainder === null
              ? 'Podíl sedí, teď vyber zbytek.'
              : 'Kontroluji odpověď.';

  return (
    <section className="problem-card" aria-live="polite">
      <div className="problem-card__header">
        <span>Příklad {round} z {totalRounds}</span>
        <span>Podíl a zbytek</span>
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

      <div className="answer-columns">
        <div className="answer-group answer-group--quotient">
          <p className="answer-group__label">Podíl</p>
          <div className="answer-grid answer-grid--compact">
            {problem.quotientOptions.map((option) => {
              const isSelected = selectedQuotient === option;
              const feedbackClass =
                answerState === 'idle'
                  ? isSelected
                    ? 'answer-button--selected'
                    : ''
                  : answerState === 'correct' && isSelected
                    ? 'answer-button--correct'
                    : answerState === 'wrong' && isSelected
                      ? 'answer-button--wrong'
                      : '';

              return (
                <button
                  className={`answer-button answer-button--quotient ${feedbackClass}`}
                  type="button"
                  key={option}
                  disabled={isChecking}
                  aria-pressed={isSelected}
                  onClick={() => onPickQuotient(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="answer-group answer-group--remainder">
          <p className="answer-group__label">Zbytek</p>
          <div className="answer-grid answer-grid--compact">
            {problem.remainderOptions.map((option) => {
              const isSelected = selectedRemainder === option;
              const feedbackClass =
                answerState === 'idle'
                  ? isSelected
                    ? 'answer-button--selected'
                    : ''
                  : answerState === 'correct' && isSelected
                    ? 'answer-button--correct'
                    : answerState === 'wrong' && isSelected
                      ? 'answer-button--wrong'
                      : '';

              return (
                <button
                  className={`answer-button answer-button--remainder ${feedbackClass}`}
                  type="button"
                  key={option}
                  disabled={isChecking}
                  aria-pressed={isSelected}
                  onClick={() => onPickRemainder(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
