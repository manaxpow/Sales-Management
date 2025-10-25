export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
export const parseDateFromString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("/").map(Number);
  console.log(year, month, day);
  return new Date(year, month - 1, day); // chú ý month - 1
};
