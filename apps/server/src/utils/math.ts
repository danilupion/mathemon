export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const divisors = (num: number) => {
  const divisors = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      divisors.push(i);
    }
  }
  return divisors;
};

export const randomElement = <T>(arr: T[]) => {
  return arr[randomInt(0, arr.length - 1)];
};
