import { CreateQuizRequest, CreateQuizResponse } from '@mathemon/common/models/api/quizzes';
import { Operator } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/quizzes';

export const createQuiz = (operator: Operator, digits: number, carrying: boolean | undefined) =>
  postRequest<CreateQuizRequest, CreateQuizResponse>(basePath, { operator, digits, carrying });
