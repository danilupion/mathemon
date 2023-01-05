import { debounce } from 'lodash';
import { MutableRefObject, useLayoutEffect, useState } from 'react';

export interface ScrollPosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const getScrollPosition = <T extends Element>(element?: T | null) => {
  if (element) {
    return {
      top: element.scrollTop,
      bottom: element.scrollHeight - element.clientHeight - element.scrollTop,
      left: element.scrollLeft,
      right: element.scrollWidth - element.clientWidth - element.scrollLeft,
    };
  }
  return { top: 0, bottom: 0, left: 0, right: 0 };
};

interface ScrollPositionHookParameters<T extends HTMLElement> {
  element?: MutableRefObject<T | null>;
  debounce?: number | false;
}

const useScrollPosition = <T extends HTMLElement>({
  element,
  debounce: debounceTime = 50,
}: ScrollPositionHookParameters<T> = {}): ScrollPosition => {
  const [position, setPosition] = useState(
    getScrollPosition((element && element.current) || window.document.scrollingElement),
  );

  useLayoutEffect(() => {
    const target = (element && element.current) || window.document;
    setPosition(
      getScrollPosition((element && element.current) || window.document.scrollingElement),
    );

    const handleScroll = () => {
      setPosition(
        getScrollPosition((element && element.current) || window.document.scrollingElement),
      );
    };

    const handleScrollToUse = debounceTime
      ? debounce(handleScroll, debounceTime, {
          leading: false,
          trailing: true,
        })
      : handleScroll;

    target?.addEventListener('scroll', handleScrollToUse, { passive: true });
    target?.addEventListener('resize', handleScrollToUse, { passive: true });

    return () => {
      target?.removeEventListener('scroll', handleScrollToUse);
      target?.removeEventListener('resize', handleScrollToUse);
    };
  }, [debounceTime, element]);

  return position;
};

export default useScrollPosition;
