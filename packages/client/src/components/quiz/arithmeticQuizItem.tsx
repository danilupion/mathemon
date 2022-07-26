import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import ArithmeticOperation from '../../models/ArithmeticOperation';
import { QuizResult, Review } from '../../stores/quizStore';

import styles from './arithmeticQuizItem.module.scss';

interface ArithmeticQuizItemProps {
  operation: ArithmeticOperation;
  value: QuizResult;
  onSetValue: (result: QuizResult) => void;
  isCorrect?: Review;
}

const ArithmeticQuizItem = ({
  operation,
  value,
  onSetValue,
  isCorrect,
}: ArithmeticQuizItemProps) => {
  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const inputValue = ev.target.value.trim();
      if (inputValue === '') {
        onSetValue(undefined);
      } else {
        const newValue = Number(inputValue);

        if (!Number.isNaN(newValue)) {
          onSetValue(newValue);
        }
      }
    },
    [onSetValue],
  );

  return (
    <div
      className={classNames(styles.quizItem, {
        [styles.right]: isCorrect,
        [styles.wrong]: isCorrect === false,
      })}
    >
      <div className={styles.operation}>
        <div>{operation.operator} &nbsp;&nbsp;</div>
        <div>
          {operation.operands.map((operand, index) => (
            <div key={`${operand}-${index}`}>{operand}</div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <input
          contentEditable={true}
          value={value === undefined ? '' : value}
          size={1}
          onChange={handleOnChange}
          maxLength={operation.maxDigits() + 1}
        />
      </div>
    </div>
  );
};

export default ArithmeticQuizItem;
