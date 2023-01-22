import { FormSelectField } from '../../../Form/Select';

const DivisionSettings = () => {
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

export default DivisionSettings;
