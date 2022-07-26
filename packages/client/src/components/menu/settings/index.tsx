import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Operator } from '../../../models/ArithmeticOperation';
import { quizStore } from '../../../stores/quizStore';
import { loadCurrentSettings, saveSettings } from '../../../utils/settingsManager';

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
  const currentSettings = loadCurrentSettings(pathToOperator[pathname]);

  const [digits, setDigits] = useState<number>(currentSettings.digits);
  const [carrying, setCarrying] = useState<boolean | undefined>(currentSettings.carrying);

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

  const handleSave = useCallback(() => {
    const operator = pathToOperator[pathname];
    saveSettings(operator, {
      digits,
      carrying,
    });
    quizStore.generateQuiz(operator);
    onSave && onSave();
  }, [onSave, carrying, digits, pathname]);

  useEffect(() => {
    const currentSettings = loadCurrentSettings(pathToOperator[pathname]);
    setDigits(currentSettings.digits);
    setCarrying(currentSettings.carrying);
  }, [pathname]);

  return (
    <div className={styles.container}>
      <Select
        label="Dígitos"
        value={digits}
        options={[1, 2, 3, 4, 5]}
        onChange={handleDigitsChange}
      />
      {carrying !== undefined && (
        <Checkbox label="Llevando" checked={carrying} onChange={handleCarryingChange} />
      )}

      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};

export default Settings;
