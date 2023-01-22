import { Operator } from '@mathemon/common/models/operation';
import { localStorage } from '@mathemon/turbo-client/storage/index';
import { action, computed, makeAutoObservable } from 'mobx';

export enum InputDirection {
  RTL = 'rtl',
  LFR = 'lfr',
}

interface AdditionSettings {
  digits: number;
  carrying: boolean;
}

interface SubtractionSettings {
  digits: number;
  carrying: boolean;
}

interface MultiplicationSettings {
  digits: number;
}

interface DivisionSettings {
  digits: number;
}

export type OperatorSettings =
  | AdditionSettings
  | SubtractionSettings
  | MultiplicationSettings
  | DivisionSettings;

export interface CommonSettings {
  inputDirection: InputDirection;
}

const LOCALSTORAGE_KEY = 'settings';
const COMMON_SETTINGS_KEY = 'common';

const commonDefaults: CommonSettings = {
  inputDirection: InputDirection.RTL,
};

const operatorDefaults: { [key in Operator]: OperatorSettings } = {
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
  [Operator.division]: {
    digits: 1,
  },
};

export class SettingsStore {
  private settings;

  constructor() {
    makeAutoObservable(this);

    try {
      const content = localStorage.getItem(LOCALSTORAGE_KEY);
      this.settings = content ? JSON.parse(content) : {};
    } catch (e) {
      // do nothing
    }
  }

  @computed
  public getOperator(operator: Operator): OperatorSettings {
    return {
      ...operatorDefaults[operator],
      ...this.settings[operator],
    };
  }

  @computed
  public getCommon(): CommonSettings {
    return {
      ...commonDefaults,
      ...this.settings[COMMON_SETTINGS_KEY],
    };
  }

  @action
  public saveOperatorSettings = (operator: Operator, newSettings: OperatorSettings) => {
    this.settings[operator] = newSettings;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.settings));
  };

  @action
  public saveCommonSettings = (newSettings: CommonSettings) => {
    this.settings[COMMON_SETTINGS_KEY] = newSettings;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.settings));
  };
}
