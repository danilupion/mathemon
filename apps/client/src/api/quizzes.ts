import { CreateQuizRes } from '@mathemon/common/models/api/quizzes';
import { CreateQuizReq } from '@mathemon/common/models/api/quizzes';
import { postRequest } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/quizzes';

export const createQuiz = (params: CreateQuizReq) =>
  postRequest<CreateQuizReq, CreateQuizRes>(basePath, {
    ...params,
  });
