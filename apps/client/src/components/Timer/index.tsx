import { useEffect, useState } from 'react';

import Progress from '../Progress';

interface TimerProps {
  ms: number;
  updateMs?: number;
}
const Timer = ({ ms, updateMs = 1000 }: TimerProps) => {
  const [value, setValue] = useState(ms);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        const newValue = Math.max(0, prev - updateMs);
        if (newValue === 0) {
          clearInterval(interval);
        }
        return newValue;
      });
    }, updateMs);

    return () => clearInterval(interval);
  }, [updateMs, ms]);

  return <Progress value={value} max={ms} />;
};

export default Timer;
