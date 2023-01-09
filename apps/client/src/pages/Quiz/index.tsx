import { Operator, Score, Solution } from '@mathemon/common/models/operation';
import { Pokemon } from '@mathemon/common/models/pokemon';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

import { createEvaluation } from '../../api/evaluations';
import { createQuiz } from '../../api/quizzes';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { useSettingsStore } from '../../hooks/useStore';

import QuizItem, { Item } from './QuizItem';
import ResultModal from './ResultModal';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const settingsStore = useSettingsStore();
  const { inputDirection } = settingsStore.getCommon();
  const { digits, carrying } = settingsStore.getSection(operator);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState<Score | undefined>(undefined);
  const [reward, setReward] = useState<Pokemon | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const init = useCallback(() => {
    setLoading(true);
    setItems([]);
    setScore(undefined);
    setReward(undefined);
    setOpen(false);
    createQuiz(operator, digits, carrying).then((items) => {
      setItems(
        items.map((item) => ({
          solution: { operation: item, value: undefined },
        })),
      );
      setLoading(false);
    });
  }, [operator, digits, carrying]);

  useEffect(() => {
    init();
  }, [carrying, digits, init, operator]);

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
    const result = await createEvaluation(items.map((item) => item.solution as Solution));

    setItems(result.evaluations);
    setScore(result.score);
    setReward(result.reward);
    setOpen(true);
  }, [items]);

  const handleCloseResultModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const retry = useCallback(() => {
    init();
  }, [init]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.quiz}>
        {items.map((item, index) => (
          <QuizItem
            item={item}
            editable={!score}
            inputDirection={inputDirection}
            key={`${index} ${item.solution.operation.operands[0]}${item.solution.operation.operator}${item.solution.operation.operands[1]}`}
            onSetValue={handleSetValue(index)}
          />
        ))}
      </div>
      {!score && (
        <Button
          className={styles.evaluate}
          disabled={items.length === 0 || items.some((i) => i.solution.value === undefined)}
          onClick={handleReview}
        >
          Corregir
        </Button>
      )}
      {!!score && (
        <Button className={styles.evaluate} onClick={retry}>
          Reintentar
        </Button>
      )}
      {score && (
        <ResultModal
          open={open}
          score={score}
          reward={reward}
          onClose={handleCloseResultModal}
          onRetry={retry}
        />
      )}
    </div>
  );
});

export default Quiz;
