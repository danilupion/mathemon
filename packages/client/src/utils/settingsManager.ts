import { Operator } from '../models/ArithmeticOperation';

interface OperatorSettings {
  digits: number;
  carrying?: boolean;
}

const defaults: { [key in Operator]: OperatorSettings } = {
  [Operator.addition]: {
    digits: 2,
    carrying: false,
  },
  [Operator.subtraction]: {
    digits: 2,
    carrying: false,
  },
  [Operator.multiplication]: {
    digits: 1,
  },
};

const LOCALSTORAGE_KEY = 'operatorSettings';

const getCurrentSettings = () => {
  try {
    const content = localStorage.getItem(LOCALSTORAGE_KEY);
    if (content) {
      return JSON.parse(content);
    }
  } catch (e) {
    // do nothing
  }

  return {};
};

export const loadCurrentSettings = (operator: Operator): OperatorSettings => {
  const settings = getCurrentSettings();

  return {
    ...defaults[operator],
    ...settings[operator],
  };
};

export const saveSettings = (operator: Operator, newSettings: OperatorSettings) => {
  const settings = getCurrentSettings();
  settings[operator] = newSettings;

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(settings));
};
