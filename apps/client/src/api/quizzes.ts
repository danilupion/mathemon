import { CreateQuizReq, CreateQuizRes } from '@mathemon/common/models/api/quizzes';
import { Operator } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/quizzes';

export const createQuiz = (operator: Operator, digits: number, carrying: boolean | undefined) =>
  postRequest<CreateQuizReq, CreateQuizRes>(basePath, { operator, digits, carrying });
