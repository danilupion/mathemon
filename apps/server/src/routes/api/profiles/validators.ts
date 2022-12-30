import { password } from '@mathemon/turbo-server/regex.js';
import { body } from 'express-validator';

export const validateProfileCreation = [
  body('email').isEmail().normalizeEmail().notEmpty(),
  body('username').isString().trim().notEmpty(),
  body('password').isString().trim().notEmpty().matches(password),
];
