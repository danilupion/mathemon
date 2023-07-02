import {
  CreatePracticeQuizReq,
  CreateRealQuizReq,
  QuizMode,
} from '@mathemon/common/models/api/quizzes';
import { Operator, Score } from '@mathemon/common/models/operation';
import { Pokemon } from '@mathemon/common/models/pokemon';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useBeforeUnload, useParams } from 'react-router-dom';

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
  mode?: QuizMode;
}

const Quiz = observer(({ operator, mode = QuizMode.Real }: QuizProps) => {
  const settingsStore = useSettingsStore();
  const [items, setItems] = useState<Item[]>([]);
  const [evaluation, setEvaluation] = useState<
    { score: Score; success: boolean; reward: Pokemon } | undefined
  >(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  let digits: number | undefined = undefined;
  let carrying: boolean | undefined;
  let table: number | undefined;

  if (mode === QuizMode.Real) {
    const settings = settingsStore.getOperator(operator);
    digits = settings.digits;
    carrying = 'carrying' in settings ? settings.carrying : undefined;
  } else {
    table = Number(useParams().table);

    if (!Number.isInteger(table)) {
      return null;
    }
  }

  const createQuizReq = useCallback(() => {
    switch (mode) {
      case QuizMode.Practice: {
        return {
          mode,
          operator,
          operand: table!,
        } as CreatePracticeQuizReq;
      }
      case QuizMode.Real: {
        return {
          mode,
          operator,
          digits,
          carrying,
        } as CreateRealQuizReq;
      }
    }
  }, [mode, operator, digits, carrying, table]);

  const init = useCallback(async () => {
    setLoading(true);
    setItems([]);
    setEvaluation(undefined);
    setOpen(false);

    createQuiz(createQuizReq()).then((items) => {
      setItems(
        items.map((item) => ({
          solution: { operation: item, value: undefined },
        })),
      );
    });

    setLoading(false);
  }, [createQuizReq]);

  useBeforeUnload((e) => {
    if (!evaluation) {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir?';
    }
  });

  useEffect(() => {
    init().catch((e) => console.error(e));
  }, [init]);

  const handleSetValue = useCallback(
    (index: number) => (value: string | undefined) => {
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
    const result = await createEvaluation({
      quiz: createQuizReq(),
      solutions: items.map((item) => ({ ...item.solution, value: Number(item.solution.value) })),
    });

    setItems(
      result.evaluations.map((evaluation) => ({
        solution: { ...evaluation.solution, value: evaluation.solution.value.toString() },
        correct: evaluation.correct,
      })),
    );
    setEvaluation({
      score: result.score,
      success: result.success,
      reward: result.reward,
    });
    setOpen(true);
  }, [createQuizReq, items]);

  const handleCloseResultModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const retry = useCallback(() => {
    init().catch((e) => console.error(e));
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
