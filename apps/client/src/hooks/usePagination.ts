import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import useScrollPosition, { ScrollPosition } from './useScrollPosition';

type UsePaginationParams<Data, Meta, DataField extends string, MetaField extends string> = {
  fetcher: (
    page: number,
  ) => Promise<
    DataField extends string
      ? MetaField extends string
        ? { [dataField in DataField]: Data[] } & { [metaField in MetaField]: Meta }
        : { [dataField in DataField]: Data[] }
      : Data[]
  >;
  dataField?: DataField;
  metaField?: MetaField;
  offset?: number;
  direction?: keyof ScrollPosition;
};

const usePagination = <
  Data,
  Meta,
  DataField extends string = 'data',
  MetaField extends string = 'meta',
>({
  fetcher,
  offset = 200,
  dataField = 'data' as DataField,
  metaField = 'meta' as MetaField,
  direction = 'bottom',
}: UsePaginationParams<Data, Meta, DataField, MetaField>): [Data[], Meta | undefined] => {
  const [nextPage, setNextPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const position = useScrollPosition();
  const [data, setData] = useState<Data[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [full, setFull] = useState(false);

  const currentFetch = useRef<number>();

  const valueToCheck = position[direction];

  useEffect(() => {
    if (currentFetch.current !== nextPage) {
      setFetching(true);
      currentFetch.current = nextPage;
      fetcher(nextPage)
        .then((result) => {
          const newData = dataField ? result[dataField] : (result as Data[]);
          const newMeta = dataField && metaField ? result[metaField] : undefined;
          return new Promise<void>((res) => {
            if (newData.length === 0) {
              setFull(true);
            }
            setData((value) => {
              res();
              return [...value, ...newData];
            });
            if (newMeta) {
              setMeta(newMeta);
            }
            setFetching(false);
          });
        })
        .then(() => {
          currentFetch.current = undefined;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage]);

  useLayoutEffect(() => {
    if (!fetching && valueToCheck <= offset && !full) {
      setNextPage((value) => value + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, offset, valueToCheck]);

  return [data, meta];
};

export default usePagination;
