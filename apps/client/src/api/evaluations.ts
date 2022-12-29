import {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
} from '@mathemon/common/models/api/evaluations';
import { Solution } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/evaluations';

export const createEvaluation = (results: Solution[]) =>
  postRequest<CreateEvaluationRequest, CreateEvaluationResponse>(basePath, results);
