export type RequiredFields<Type, RequiredFields extends keyof Type> = Type & {
  [Filed in RequiredFields]-?: Type[Filed];
};
