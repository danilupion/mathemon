import { FormCheckboxField } from '../../../Form/Checkbox';
import { FormSelectField } from '../../../Form/Select';

const AdditionSettings = () => {
  return (
    <>
      <FormSelectField<number>
        label="Dígitos"
        name="operator.digits"
        encode={(e) => e.toString()}
        decode={Number.parseInt}
        options={[1, 2, 3]}
      />
      <FormCheckboxField name="operator.carrying" text="Llevando" />
    </>
  );
};

export default AdditionSettings;
