import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

import { Operator } from '../../models/ArithmeticOperation';
import { QuizResult, quizStore } from '../../stores/quizStore';
import { loadCommonSettings } from '../../utils/settingsManager';

import ArithmeticQuizItem from './arithmeticQuizItem';
import styles from './index.module.scss';

interface QuizProps {
  operator: Operator;
}

const Quiz = observer(({ operator }: QuizProps) => {
  const { inputDirection } = loadCommonSettings();

  useEffect(() => {
    quizStore.generateQuiz(operator);
  }, [operator]);

  const handleOnSetValue = useCallback(
    (index: number) => (value: QuizResult) => {
      quizStore.setResult(index, value);
    },
    [],
  );

  return (
    <div>
      <div className={styles.quiz}>
        {quizStore.quizItems.map((operation, index) => (
          <ArithmeticQuizItem
            operation={operation}
            inputDirection={inputDirection}
            key={`${index} ${operation.operands[0]}${operation.operator}${operation.operands[1]}`}
            onSetValue={handleOnSetValue(index)}
            value={quizStore.getResult(index)}
            isCorrect={quizStore.getReview(index)}
          />
        ))}
      </div>
      <button className="nes-btn is-primary" onClick={quizStore.review}>
        Corregir!
      </button>
    </div>
  );
});

export default Quiz;
