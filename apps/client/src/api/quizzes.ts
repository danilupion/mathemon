import { postRequest } from '@danilupion/turbo-client/rest/request';
import { CreateQuizRes } from '@mathemon/common/models/api/quizzes';
import { CreateQuizReq } from '@mathemon/common/models/api/quizzes';

const basePath = '/api/quizzes';

export const createQuiz = (params: CreateQuizReq) =>
  postRequest<CreateQuizReq, CreateQuizRes>(basePath, {
    ...params,
  });
