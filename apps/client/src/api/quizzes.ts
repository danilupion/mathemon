import {
  CreatePracticeQuizReq,
  CreateQuizRes,
  CreateRealQuizReq,
} from '@mathemon/common/models/api/quizzes';
import { Operator } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/quizzes';

export const createRealQuiz = (operator: Operator, digits: number, carrying?: boolean) =>
  postRequest<CreateRealQuizReq, CreateQuizRes>(`${basePath}/real`, {
    operator,
    digits,
    carrying,
  } as CreateRealQuizReq);

export const createPracticeQuiz = (operator: Operator, operand: number) =>
  postRequest<CreatePracticeQuizReq, CreateQuizRes>(`${basePath}/practice`, {
    operator: Operator.multiplication,
    operand,
  });
