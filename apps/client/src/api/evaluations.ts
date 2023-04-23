import { postRequest } from '@danilupion/turbo-client/rest/request';
import { CreateEvaluationReq, CreateEvaluationRes } from '@mathemon/common/models/api/evaluations';

const basePath = '/api/evaluations';

export const createEvaluation = (params: CreateEvaluationReq) =>
  postRequest<CreateEvaluationReq, CreateEvaluationRes>(basePath, params);
