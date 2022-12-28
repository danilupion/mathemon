import { Operator } from '@mathemon/common/models/operation.js';
import { body } from 'express-validator';

export const evaluationCreationValidator = [
  body().isArray().notEmpty(),
  body('*.operation.operator').isString().trim().isIn(Object.values(Operator)).notEmpty(),
  body('*.operation.operands').isArray({ min: 2, max: 2 }).notEmpty(),
  body('*.operation.operands.*').isInt().notEmpty(),
  body('*.value').isInt().notEmpty(),
];
