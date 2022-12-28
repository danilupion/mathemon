import { Operator } from '@mathemon/common/models/operation';

interface OperatorSettings {
  digits: number;
  carrying?: boolean;
}

export enum InputDirection {
  RTL = 'rtl',
  LFR = 'lfr',
}

interface CommonSettings {
  inputDirection: InputDirection;
}

const commonDefaults: CommonSettings = {
  inputDirection: InputDirection.RTL,
};

const sectionDefaults: { [key in Operator]: OperatorSettings } = {
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
const COMMON_SETTINGS_KEY = 'common';

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

type Settings = {
  common: CommonSettings;
  section: OperatorSettings;
};

export const loadSectionSettings = (operator: Operator): OperatorSettings => {
  const settings = getCurrentSettings();

  return {
    ...sectionDefaults[operator],
    ...settings[operator],
  };
};

export const loadCommonSettings = (): CommonSettings => {
  const settings = getCurrentSettings();

  return {
    ...commonDefaults,
    ...settings[COMMON_SETTINGS_KEY],
  };
};

export const saveSettings = (operator: Operator, newSettings: Settings) => {
  const settings = getCurrentSettings();
  settings[operator] = newSettings.section;
  settings[COMMON_SETTINGS_KEY] = newSettings.common;

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(settings));
};
