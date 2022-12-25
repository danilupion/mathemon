export type WithTransformations<Value> = {
  decode: (value: string) => Value;
  encode: (value: Value) => string;
};

export type WithValue<Value> = {
  value: Value;
  onValueChange: (value: Value) => void;
};
