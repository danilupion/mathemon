import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Operator } from '../../../models/ArithmeticOperation';
import { quizStore } from '../../../stores/quizStore';
import {
  InputDirection,
  loadCommonSettings,
  loadSectionSettings,
  saveSettings,
} from '../../../utils/settingsManager';

import Checkbox from './checkbox';
import styles from './index.module.scss';
import Select from './select';

const pathToOperator: { [key: string]: Operator } = {
  '/addition': Operator.addition,
  '/subtraction': Operator.subtraction,
  '/multiplication': Operator.multiplication,
};

interface SettingsProps {
  onSave?: () => void;
}

const Settings = ({ onSave }: SettingsProps) => {
  const { pathname } = useLocation();
  const currentSectionSettings = loadSectionSettings(pathToOperator[pathname]);
  const currentCommonSettings = loadCommonSettings();

  const [digits, setDigits] = useState<number>(currentSectionSettings.digits);
  const [carrying, setCarrying] = useState<boolean | undefined>(currentSectionSettings.carrying);
  const [inputDirection, setInputDirection] = useState<InputDirection>(
    currentCommonSettings.inputDirection,
  );

  const handleDigitsChange = useCallback(
    (value: number) => {
      setDigits(value);
    },
    [setDigits],
  );

  const handleCarryingChange = useCallback(
    (value: boolean) => {
      setCarrying(value);
    },
    [setCarrying],
  );

  const handleInputDirectionChange = useCallback(
    (value: InputDirection) => {
      setInputDirection(value);
    },
    [setInputDirection],
  );

  const handleSave = useCallback(() => {
    const operator = pathToOperator[pathname];
    saveSettings(operator, {
      common: {
        inputDirection,
      },
      section: {
        digits,
        carrying,
      },
    });
    quizStore.generateQuiz(operator);
    onSave && onSave();
  }, [onSave, carrying, digits, inputDirection, pathname]);

  useEffect(() => {
    const currentSettings = loadSectionSettings(pathToOperator[pathname]);
    const currentCommonSettings = loadCommonSettings();

    setDigits(currentSettings.digits);
    setCarrying(currentSettings.carrying);
    setInputDirection(currentCommonSettings.inputDirection);
  }, [pathname]);

  return (
    <div className={styles.container}>
      <Select
        label="Dirección de entrada"
        value={inputDirection}
        options={[
          ['Derecha a Izquierda', InputDirection.RTL],
          ['Izquierda a Derecha', InputDirection.LFR],
        ]}
        onChange={handleInputDirectionChange}
      />
      <Select
        label="Dígitos"
        value={digits}
        options={[1, 2, 3, 4, 5]}
        onChange={handleDigitsChange}
        parser={(val: string) => Number.parseInt(val)}
      />
      {carrying !== undefined && (
        <Checkbox label="Llevando" checked={carrying} onChange={handleCarryingChange} />
      )}

      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};

export default Settings;
