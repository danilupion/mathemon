import { ArithmeticOperation } from '@mathemon/common/models/arithmeticOperation';
import { Assessment } from '@mathemon/common/models/assessment';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

import { createAssessment } from '../../api/assessments';
import { createQuiz } from '../../api/quizzes';
import Button from '../../components/Button';
import { Operator } from '../../models/ArithmeticOperation';
import { loadCommonSettings, loadSectionSettings } from '../../utils/settingsManager';

import ArithmeticQuizItem from './ArithmeticQuizItem';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const { inputDirection } = loadCommonSettings();
  const [quizItems, setQuizItems] = useState<ArithmeticOperation[]>([]);
  const [results, setResults] = useState<(number | undefined)[]>([]);
  const [assessments, setAssessments] = useState<(Assessment | undefined)[]>([]);

  useEffect(() => {
    const { digits, carrying } = loadSectionSettings(operator);

    createQuiz(operator, digits, carrying).then((items) => {
      setQuizItems(items);
      setResults(items.map(() => undefined));
      setAssessments(items.map(() => undefined));
    });
  }, [operator]);

  const handleSetValue = useCallback(
    (index: number) => (value: number | undefined) => {
      setResults((prev) => {
        const newResults = [...prev];
        newResults[index] = value;
        return newResults;
      });
    },
    [],
  );

  const handleReview = useCallback(async () => {
    const assessment = await createAssessment(
      quizItems.map((item, index) => ({
        operation: item,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result: results[index]!,
      })),
    );

    setAssessments(assessment);
  }, [quizItems, results]);

  return (
    <div className={styles.container}>
      <div className={styles.quiz}>
        {quizItems.map((operation, index) => (
          <ArithmeticQuizItem
            operation={operation}
            inputDirection={inputDirection}
            key={`${index} ${operation.operands[0]}${operation.operator}${operation.operands[1]}`}
            onSetValue={handleSetValue(index)}
            value={results[index]}
            isCorrect={assessments[index]?.correct}
          />
        ))}
      </div>
      <Button
        className={styles.asses}
        disabled={results.some((r) => r === undefined) || assessments.some((a) => a !== undefined)}
        onClick={handleReview}
      >
        Corregir!
      </Button>
    </div>
  );
});

export default Quiz;
