import { Operator, Score, Solution } from '@mathemon/common/models/operation';
import { Pokemon } from '@mathemon/common/models/pokemon';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useBeforeUnload } from 'react-router-dom';

import { createEvaluation } from '../../api/evaluations';
import { createQuiz } from '../../api/quizzes';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import QuizItem, { Item } from '../../components/QuizItem';
import { useSettingsStore } from '../../hooks/useStore';

import ResultModal from './ResultModal';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const settingsStore = useSettingsStore();
  const { digits, ...operatorSettingsRest } = settingsStore.getOperator(operator);
  const [items, setItems] = useState<Item[]>([]);
  const [evaluation, setEvaluation] = useState<
    { score: Score; success: boolean; reward: Pokemon } | undefined
  >(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const carrying = 'carrying' in operatorSettingsRest ? operatorSettingsRest.carrying : undefined;

  const init = useCallback(() => {
    setLoading(true);
    setItems([]);
    setEvaluation(undefined);
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

  useBeforeUnload((e) => {
    if (!evaluation) {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir?';
    }
  });

  useEffect(() => {
    init();
  }, [init]);

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
    setEvaluation({
      score: result.score,
      success: result.success,
      reward: result.reward,
    });
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
            editable={!(evaluation && evaluation.score)}
            key={`${index} ${item.solution.operation.operands[0]}${item.solution.operation.operator}${item.solution.operation.operands[1]}`}
            onSetValue={handleSetValue(index)}
          />
        ))}
      </div>
      {!evaluation && (
        <Button
          className={styles.evaluate}
          disabled={items.length === 0 || items.some((i) => i.solution.value === undefined)}
          onClick={handleReview}
        >
          Corregir
        </Button>
      )}
      {!!evaluation && (
        <Button className={styles.evaluate} onClick={retry} loading={loading}>
          Reintentar
        </Button>
      )}
      {evaluation && (
        <ResultModal
          open={open}
          score={evaluation.score}
          reward={evaluation.reward}
          success={evaluation.success}
          onClose={handleCloseResultModal}
          onRetry={retry}
        />
      )}
    </div>
  );
});

export default Quiz;
