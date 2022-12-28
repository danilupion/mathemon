import { Operator, Solution } from '@mathemon/common/models/operation';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

import { createEvaluation } from '../../api/evaluations';
import { createQuiz } from '../../api/quizzes';
import Button from '../../components/Button';
import { loadCommonSettings, loadSectionSettings } from '../../utils/settingsManager';

import QuizItem, { Item } from './QuizItem';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const { inputDirection } = loadCommonSettings();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const { digits, carrying } = loadSectionSettings(operator);

    createQuiz(operator, digits, carrying).then((items) => {
      setItems(
        items.map((item) => ({
          solution: { operation: item, value: undefined },
        })),
      );
    });
  }, [operator, setItems]);

  const handleSetValue = useCallback(
    (index: number) => (value: number | undefined) => {
      setItems((prev) => {
        const newResults = [...prev];
        newResults[index] = {
          ...prev[index],
          solution: {
            ...prev[index].solution,
            value,
          },
        };
        return newResults;
      });
    },
    [setItems],
  );

  const handleReview = useCallback(async () => {
    const evaluations = await createEvaluation(items.map((item) => item.solution as Solution));

    setItems(evaluations);
  }, [items]);

  return (
    <div className={styles.container}>
      <div className={styles.quiz}>
        {items.map((item, index) => (
          <QuizItem
            item={item}
            inputDirection={inputDirection}
            key={`${index} ${item.solution.operation.operands[0]}${item.solution.operation.operator}${item.solution.operation.operands[1]}`}
            onSetValue={handleSetValue(index)}
          />
        ))}
      </div>
      <Button
        className={styles.evaluate}
        disabled={items.some((i) => i.solution.value === undefined)}
        onClick={handleReview}
      >
        Corregir!
      </Button>
    </div>
  );
});

export default Quiz;
