import { CreateQuizBody } from '@mathemon/common/models/api/quizzes';
import { ArithmeticOperation, Operator } from '@mathemon/common/models/arithmeticOperation';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/quizzes';

export const createQuiz = (operator: Operator, digits: number, carrying: boolean | undefined) =>
  postRequest<CreateQuizBody, ArithmeticOperation[]>(basePath, { operator, digits, carrying });
