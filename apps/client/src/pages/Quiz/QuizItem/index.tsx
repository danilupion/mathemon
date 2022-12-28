import { Operation } from '@mathemon/common/models/operation';
import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import { maxDigits } from '../../../utils/math';
import { InputDirection } from '../../../utils/settingsManager';

import styles from './index.module.scss';

interface QuizItemProps {
  operation: Operation;
  inputDirection: InputDirection;
  solution: number | undefined;
  onSetValue: (result: number | undefined) => void;
  isCorrect?: boolean;
}

const QuizItem = ({
  operation,
  inputDirection,
  solution,
  onSetValue,
  isCorrect,
}: QuizItemProps) => {
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
          value={solution === undefined ? '' : solution}
          size={1}
          onChange={handleOnChange}
          maxLength={maxDigits(operation.operands) + 1}
          type="text"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default QuizItem;
