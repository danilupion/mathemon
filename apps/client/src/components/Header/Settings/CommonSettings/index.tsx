import { InputDirection } from '../../../../stores/settingsStore';
import { FormSelectField } from '../../../Form/Select';

const CommonSettings = () => {
  return (
    <FormSelectField<InputDirection>
      label="Dirección de entrada"
      name="common.inputDirection"
      options={[
        ['Derecha a Izquierda', InputDirection.RTL],
        ['Izquierda a Derecha', InputDirection.LFR],
      ]}
    />
  );
};

export default CommonSettings;
