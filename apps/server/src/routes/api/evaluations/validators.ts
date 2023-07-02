import { Operator } from '@mathemon/common/models/operation.js';
import { ValidationChain, body } from 'express-validator';

import { quizCreationValidatorFactory } from '../quizzes/validators.js';

export const evaluationCreationValidator: ValidationChain[] = [
  quizCreationValidatorFactory('quiz'),
  body('solutions').isArray().notEmpty(),
  body('solutions.*.operation.operator').isString().trim().isIn(Object.values(Operator)).notEmpty(),
  body('solutions.*.operation.operands').isArray({ min: 2, max: 2 }).notEmpty(),
  body('solutions.*.operation.operands.*').isInt().notEmpty(),
  body('solutions.*.value').isInt().notEmpty(),
];
