export const promiseStore = <T, ID>(fetcher: (id: ID) => Promise<T>) => {
  const store = new Map<ID, Promise<T>>();

  return async (id: ID): Promise<T> => {
    if (store.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return store.get(id)!;
    }

    const promise = fetcher(id);

    store.set(id, promise);

    return promise;
  };
};
