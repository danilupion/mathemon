import { Evaluation, Operation } from '@mathemon/common/models/operation';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

import { createEvaluation } from '../../api/evaluations';
import { createQuiz } from '../../api/quizzes';
import Button from '../../components/Button';
import { Operator } from '../../models/ArithmeticOperation';
import { loadCommonSettings, loadSectionSettings } from '../../utils/settingsManager';

import QuizItem from './QuizItem';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const { inputDirection } = loadCommonSettings();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [values, setValues] = useState<(number | undefined)[]>([]);
  const [evaluations, setEvaluations] = useState<(Evaluation | undefined)[]>([]);

  useEffect(() => {
    const { digits, carrying } = loadSectionSettings(operator);

    createQuiz(operator, digits, carrying).then((items) => {
      setOperations(items);
      setValues(items.map(() => undefined));
      setEvaluations(items.map(() => undefined));
    });
  }, [operator]);

  const handleSetValue = useCallback(
    (index: number) => (value: number | undefined) => {
      setValues((prev) => {
        const newResults = [...prev];
        newResults[index] = value;
        return newResults;
      });
    },
    [],
  );

  const handleReview = useCallback(async () => {
    const evaluations = await createEvaluation(
      operations.map((item, index) => ({
        operation: item,
        value: values[index]!,
      })),
    );

    setEvaluations(evaluations);
  }, [operations, values]);

  return (
    <div className={styles.container}>
      <div className={styles.quiz}>
        {operations.map((operation, index) => (
          <QuizItem
            operation={operation}
            inputDirection={inputDirection}
            key={`${index} ${operation.operands[0]}${operation.operator}${operation.operands[1]}`}
            onSetValue={handleSetValue(index)}
            solution={values[index]}
            isCorrect={evaluations[index]?.correct}
          />
        ))}
      </div>
      <Button
        className={styles.evaluate}
        disabled={values.some((r) => r === undefined) || evaluations.some((a) => a !== undefined)}
        onClick={handleReview}
      >
        Corregir!
      </Button>
    </div>
  );
});

export default Quiz;
