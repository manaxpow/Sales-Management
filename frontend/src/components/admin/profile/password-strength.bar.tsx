interface StrengthProps {
  score: number;
}
export const PasswordStrengthBar: React.FC<StrengthProps> = ({ score }) => {
  const width = `${(score / 5) * 100}%`;
  const color =
    score >= 4
      ? "bg-green-500"
      : score === 3
      ? "bg-yellow-400"
      : score === 2
      ? "bg-orange-400"
      : "bg-red-400";
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width }}
      />
    </div>
  );
};
