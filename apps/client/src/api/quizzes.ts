import { CreateQuizBody } from '@mathemon/common/models/api/quizzes';
import { Operation, Operator } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/quizzes';

export const createQuiz = (operator: Operator, digits: number, carrying: boolean | undefined) =>
  postRequest<CreateQuizBody, Operation[]>(basePath, { operator, digits, carrying });
