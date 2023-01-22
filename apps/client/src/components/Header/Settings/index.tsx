import { Operator } from '@mathemon/common/models/operation';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useSettingsStore } from '../../../hooks/useStore';
import {
  CommonSettings as CommonSettingsValue,
  OperatorSettings as OperatorSettingsValue,
} from '../../../stores/settingsStore';
import Button from '../../Button';

import AdditionSettings from './AdditionSettings';
import CommonSettings from './CommonSettings';
import DivisionSettings from './DivisionSettings';
import MultiplicationSettings from './MultiplicationSettings';
import SubtractionSettings from './SubtractionSettings';
import styles from './index.module.scss';

const pathToOperator: { [key: string]: Operator } = {
  '/addition': Operator.addition,
  '/subtraction': Operator.subtraction,
  '/multiplication': Operator.multiplication,
  '/division': Operator.division,
};

interface SettingsProps {
  onSave?: () => void;
}
const OperatorSettings = ({ operator }: { operator: Operator }) => {
  switch (operator) {
    case Operator.addition:
      return <AdditionSettings />;
    case Operator.subtraction:
      return <SubtractionSettings />;
    case Operator.multiplication:
      return <MultiplicationSettings />;
    case Operator.division:
      return <DivisionSettings />;
  }
};

type SettingsValue = {
  common: CommonSettingsValue;
  operator?: OperatorSettingsValue;
};

const Settings = observer(({ onSave }: SettingsProps) => {
  const settingsStore = useSettingsStore();
  const { pathname } = useLocation();
  const operator: Operator | undefined = pathToOperator[pathname];
  const operatorSettings = operator ? settingsStore.getOperator(operator) : undefined;
  const commonSettings = settingsStore.getCommon();

  const handleSave = useCallback(
    (settings: SettingsValue) => {
      settingsStore.saveCommonSettings(settings.common);

      if (settings.operator && operator) {
        settingsStore.saveOperatorSettings(operator, settings.operator);
      }

      onSave && onSave();
    },
    [onSave, operator, settingsStore],
  );

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          common: commonSettings,
          operator: operatorSettings,
        }}
        onSubmit={handleSave}
      >
        <Form>
          <CommonSettings />
          {operator && <OperatorSettings operator={operator} />}
          <Button className={styles.save} type="submit">
            Salvar
          </Button>
        </Form>
      </Formik>
    </div>
  );
});

export default Settings;
