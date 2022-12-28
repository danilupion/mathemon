import { Evaluation, Solution } from '@mathemon/common/models/operation';
import classNames from 'classnames';
import { ChangeEvent, useCallback } from 'react';

import { maxDigits } from '../../../utils/math';
import { InputDirection } from '../../../utils/settingsManager';

import styles from './index.module.scss';

export type Item = Omit<Evaluation, 'solution' | 'correct'> & {
  solution: Omit<Solution, 'value'> & {
    value?: number;
  };
  correct?: boolean;
};

interface QuizItemProps {
  item: Item;
  inputDirection: InputDirection;

  onSetValue: (result: number | undefined) => void;
}

const QuizItem = ({ item, inputDirection, onSetValue }: QuizItemProps) => {
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
        [styles.right]: item.correct,
        [styles.wrong]: item.correct === false,
      })}
    >
      <div className={styles.operation}>
        <div>{item.solution.operation.operator} &nbsp;&nbsp;</div>
        <div>
          {item.solution.operation.operands.map((operand, index) => (
            <div key={`${operand}-${index}`}>{operand}</div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <input
          contentEditable={true}
          value={item.solution.value === undefined ? '' : item.solution.value}
          size={1}
          onChange={handleOnChange}
          maxLength={maxDigits(item.solution.operation.operands) + 1}
          type="text"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default QuizItem;
