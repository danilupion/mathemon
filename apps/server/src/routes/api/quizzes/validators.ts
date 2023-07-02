import { QuizMode } from '@mathemon/common/models/api/quizzes.js';
import { Operator } from '@mathemon/common/models/operation.js';
import { ValidationChain, body, oneOf } from 'express-validator';

export const quizCreationValidatorFactory = (propertyPath = ''): ValidationChain => {
  const prefix = propertyPath ? `${propertyPath}.` : '';

  return oneOf([
    [
      body(`${prefix}mode`).isString().trim().isIn([QuizMode.Real]).notEmpty(),
      body(`${prefix}operator`).isString().trim().isIn(Object.values(Operator)).notEmpty(),
      body(`${prefix}digits`).isInt().notEmpty(),
      body(`${prefix}carrying`).optional().isBoolean(),
    ],
    [
      body(`${prefix}mode`).isString().trim().isIn([QuizMode.Practice]).notEmpty(),
      body(`${prefix}operator`).isString().trim().isIn([Operator.multiplication]).notEmpty(),
      body(`${prefix}operand`).isInt().notEmpty(),
    ],
  ]) as ValidationChain;
};

export const quizCreationValidator = quizCreationValidatorFactory();
