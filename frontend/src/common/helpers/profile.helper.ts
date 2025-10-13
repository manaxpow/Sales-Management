export const computeStrength = (pw: string): number => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
};

export const strengthLabel = (score: number): string => {
  if (score >= 4) return "Mạnh";
  if (score === 3) return "Khá";
  if (score === 2) return "Trung bình";
  if (score === 1) return "Yếu";
  return "Rất yếu";
};
