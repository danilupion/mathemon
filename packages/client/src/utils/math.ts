export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const range = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(null)
    .map((_, idx) => start + idx);
};
