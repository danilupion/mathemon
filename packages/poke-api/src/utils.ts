export const promiseStore = <T, ID>(fetcher: (id: ID) => Promise<T>) => {
  const store = new Map<ID, Promise<T>>();

  return async (id: ID): Promise<T> => {
    if (store.has(id)) {
      return store.get(id)!;
    }

    const promise = fetcher(id);

    store.set(id, promise);

    return promise;
  };
};
