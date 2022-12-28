import { Operator } from '@mathemon/common/models/operation';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useSettingsStore } from '../../../hooks/useStore';
import { InputDirection } from '../../../stores/settingsStore';
import Button from '../../Button';
import { FormCheckboxField } from '../../Form/Checkbox';
import { FormSelectField } from '../../Form/Select';

import styles from './index.module.scss';

const pathToOperator: { [key: string]: Operator } = {
  '/addition': Operator.addition,
  '/subtraction': Operator.subtraction,
  '/multiplication': Operator.multiplication,
};

interface SettingsProps {
  onSave?: () => void;
}

interface SettingsValues {
  inputDirection: InputDirection;
  digits: number;
  carrying: boolean | undefined;
}

const Settings = observer(({ onSave }: SettingsProps) => {
  const settingsStore = useSettingsStore();
  const { pathname } = useLocation();
  const currentSectionSettings = settingsStore.getSection(pathToOperator[pathname]);
  const currentCommonSettings = settingsStore.getCommon();

  const handleSave = useCallback(
    (settings: SettingsValues) => {
      const operator = pathToOperator[pathname];
      settingsStore.saveSettings(operator, {
        common: {
          inputDirection: settings.inputDirection,
        },
        section: {
          digits: settings.digits,
          carrying: settings.carrying,
        },
      });

      onSave && onSave();
    },
    [onSave, pathname, settingsStore],
  );

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          inputDirection: currentCommonSettings.inputDirection,
          digits: currentSectionSettings.digits,
          carrying: currentSectionSettings.carrying,
        }}
        onSubmit={handleSave}
      >
        <Form>
          <FormSelectField<InputDirection>
            label="Dirección de entrada"
            name="inputDirection"
            options={[
              ['Derecha a Izquierda', InputDirection.RTL],
              ['Izquierda a Derecha', InputDirection.LFR],
            ]}
          />
          <FormSelectField<number>
            label="Dígitos"
            name="digits"
            encode={(e) => e.toString()}
            decode={Number.parseInt}
            options={[1, 2, 3, 4, 5]}
          />
          <FormCheckboxField name="carrying" text="Llevando" />
          <Button className={styles.save} type="submit">
            Salvar
          </Button>
        </Form>
      </Formik>
    </div>
  );
});

export default Settings;
