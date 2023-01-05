import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import useScrollPosition, { ScrollPosition } from './useScrollPosition';

type UsePaginationParams<T> = {
  fetcher: (page: number) => Promise<T[]>;
  offset?: number;
  direction?: keyof ScrollPosition;
};

const usePagination = <T>({
  fetcher,
  offset = 200,
  direction = 'bottom',
}: UsePaginationParams<T>) => {
  const [nextPage, setNextPage] = useState(1);
  const position = useScrollPosition();
  const [data, setData] = useState<T[]>([]);
  const [full, setFull] = useState(false);

  const currentFetch = useRef<number>();

  const valueToCheck = position[direction];

  useEffect(() => {
    if (currentFetch.current !== nextPage) {
      currentFetch.current = nextPage;
      fetcher(nextPage)
        .then(
          (newData) =>
            new Promise<void>((res) => {
              if (newData.length === 0) {
                setFull(true);
              }
              setData((value) => {
                res();
                return [...value, ...newData];
              });
            }),
        )
        .then(() => {
          currentFetch.current = undefined;
        });
    }
  }, [fetcher, nextPage]);

  useLayoutEffect(() => {
    if (valueToCheck <= offset && !full) {
      setNextPage((value) => value + 1);
    }
  }, [full, offset, valueToCheck]);

  return data;
};

export default usePagination;
