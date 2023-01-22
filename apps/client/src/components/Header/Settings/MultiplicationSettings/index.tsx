import { FormSelectField } from '../../../Form/Select';

const MultiplicationSettings = () => {
  return (
    <>
      <FormSelectField<number>
        label="Dígitos"
        name="operator.digits"
        encode={(e) => e.toString()}
        decode={Number.parseInt}
        options={[1, 2, 3]}
      />
    </>
  );
};

export default MultiplicationSettings;
