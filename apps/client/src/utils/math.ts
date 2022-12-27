export const range = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(null)
    .map((_, idx) => start + idx);
};

export const maxDigits = (numbers: number[]) =>
  Math.max(...numbers.map((number) => number.toString().length));
