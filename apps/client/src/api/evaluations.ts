import { CreateAssessmentBody } from '@mathemon/common/models/api/evaluations';
import { Evaluation, Solution } from '@mathemon/common/models/operation';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/evaluations';

export const createEvaluation = (results: Solution[]) =>
  postRequest<CreateAssessmentBody, Evaluation[]>(basePath, results);
