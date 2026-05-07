type StatPillProps = {
  label: string;
  value: number | string;
  tone?: 'orange' | 'purple' | 'blue';
};

export const StatPill = ({ label, value, tone = 'orange' }: StatPillProps) => (
  <div className={`stat-pill stat-pill--${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
