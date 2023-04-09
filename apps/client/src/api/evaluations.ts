import { CreateEvaluationReq, CreateEvaluationRes } from '@mathemon/common/models/api/evaluations';
import { postRequest } from '@mathemon/turbo-client/rest/request';

const basePath = '/api/evaluations';

export const createEvaluation = (params: CreateEvaluationReq) =>
  postRequest<CreateEvaluationReq, CreateEvaluationRes>(basePath, params);
