import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import ArithmeticOperation from '../../../models/ArithmeticOperation';
import { QuizResult, Review } from '../../../stores/quizStore';
import { InputDirection } from '../../../utils/settingsManager';

import styles from './index.module.scss';

interface ArithmeticQuizItemProps {
  operation: ArithmeticOperation;
  inputDirection: InputDirection;
  value: QuizResult;
  onSetValue: (result: QuizResult) => void;
  isCorrect?: Review;
}

const Index = ({
  operation,
  inputDirection,
  value,
  onSetValue,
  isCorrect,
}: ArithmeticQuizItemProps) => {
  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const inputValue = ev.target.value.trim();
      if (inputDirection === InputDirection.RTL) {
        ev.currentTarget.selectionStart = Math.max(
          ev.currentTarget.selectionStart !== null ? ev.currentTarget.selectionStart - 1 : 0,
          0,
        );
        ev.currentTarget.selectionEnd = Math.max(
          ev.currentTarget.selectionEnd !== null ? ev.currentTarget.selectionEnd - 1 : 0,
          0,
        );
      }
      if (inputValue === '') {
        onSetValue(undefined);
      } else {
        const newValue = Number(inputValue);

        if (!Number.isNaN(newValue)) {
          onSetValue(newValue);
        }
      }
    },
    [inputDirection, onSetValue],
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
          type="text"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default Index;
