type ProgressBarProps = {
  value: number;
  max: number;
};

export const ProgressBar = ({ value, max }: ProgressBarProps) => {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="progress" aria-label={`Postup ${percent} procent`}>
      <div className="progress__track">
        <div className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
      <span>{percent}%</span>
    </div>
  );
};
