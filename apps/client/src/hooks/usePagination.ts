import { useEffect, useLayoutEffect, useState } from 'react';

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
  const [nextPage, setNextPage] = useState({ page: 1 });
  const [fetching, setFetching] = useState(true);
  const position = useScrollPosition();
  const [data, setData] = useState<Data[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [full, setFull] = useState(false);

  const valueToCheck = position[direction];

  useEffect(() => {
    setFetching(false);
    setFull(false);
    setData([]);
    setNextPage({ page: 1 });
  }, [fetcher]);

  useEffect(() => {
    if (!fetching && valueToCheck <= offset && !full) {
      setNextPage(({ page }) => ({ page: page + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, offset, valueToCheck]);

  useLayoutEffect(() => {
    let shouldUpdate = true;

    if (!fetching) {
      setFetching(true);
      fetcher(nextPage.page).then((result) => {
        const newData = dataField ? result[dataField] : (result as Data[]);
        const newMeta = dataField && metaField ? result[metaField] : undefined;
        return new Promise<void>((res) => {
          if (shouldUpdate) {
            try {
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
            } finally {
              setFetching(false);
            }
          }
        });
      });
    }
    return () => {
      shouldUpdate = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage]);

  return [data, meta];
};

export default usePagination;
