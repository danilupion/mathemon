import { Operator } from '@mathemon/common/models/operation';
import { localStorage } from '@mathemon/turbo-client/storage/index';
import { action, computed, makeAutoObservable } from 'mobx';

export enum InputDirection {
  RTL = 'rtl',
  LFR = 'lfr',
}
interface OperatorSettings {
  digits: number;
  carrying?: boolean;
}

interface CommonSettings {
  inputDirection: InputDirection;
}

type Settings = {
  common: CommonSettings;
  section: OperatorSettings;
};

const LOCALSTORAGE_KEY = 'operatorSettings';
const COMMON_SETTINGS_KEY = 'common';

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
  public getSection(operator: Operator): OperatorSettings {
    return {
      ...sectionDefaults[operator],
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
  public saveSettings = (operator: Operator, newSettings: Settings) => {
    this.settings[operator] = newSettings.section;
    this.settings[COMMON_SETTINGS_KEY] = newSettings.common;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.settings));
  };
}
