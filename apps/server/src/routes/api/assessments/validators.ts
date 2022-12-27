import { Operator } from '@mathemon/common/models/arithmeticOperation.js';
import { body } from 'express-validator';

export const assessmentCreationValidator = [
  body().isArray().notEmpty(),
  body('*.operation.operator').isString().trim().isIn(Object.values(Operator)).notEmpty(),
  body('*.operation.operands').isArray({ min: 2, max: 2 }).notEmpty(),
  body('*.operation.operands.*').isInt().notEmpty(),
  body('*.result').isInt().notEmpty(),
];
