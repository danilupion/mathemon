import { Operator } from '@mathemon/common/models/operation.js';
import { body } from 'express-validator';

export const quizCreationValidator = [
  body('operator').isString().trim().isIn(Object.values(Operator)).notEmpty(),
  body('digits').isInt().notEmpty(),
  body('carrying').optional().isBoolean(),
];

export const practiceCreationValidator = [
  body('operator').isString().trim().isIn([Operator.multiplication]).notEmpty(),
  body('operand').isInt().notEmpty(),
];
