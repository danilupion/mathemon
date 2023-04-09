import { QuizMode } from '@mathemon/common/models/api/quizzes.js';
import { Operator } from '@mathemon/common/models/operation.js';
import { body, oneOf } from 'express-validator';

export const quizCreationValidator = [
  oneOf([
    [
      body('mode').isString().trim().isIn([QuizMode.Real]).notEmpty(),
      body('operator').isString().trim().isIn(Object.values(Operator)).notEmpty(),
      body('digits').isInt().notEmpty(),
      body('carrying').optional().isBoolean(),
    ],
    [
      body('mode').isString().trim().isIn([QuizMode.Practice]).notEmpty(),
      body('operator').isString().trim().isIn([Operator.multiplication]).notEmpty(),
      body('operand').isInt().notEmpty(),
    ],
  ]),
];
