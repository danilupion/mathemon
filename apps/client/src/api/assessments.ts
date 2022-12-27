import { CreateAssessmentBody } from '@mathemon/common/models/api/assessments';
import { ArithmeticOperationResult } from '@mathemon/common/models/arithmeticOperationResult';
import { Assessment } from '@mathemon/common/models/assessment';
import { postRequest } from '@mathemon/turbo-client/rest/methods';

const basePath = '/api/assessments';

export const createAssessment = (results: ArithmeticOperationResult[]) =>
  postRequest<CreateAssessmentBody, Assessment[]>(basePath, results);
