import { password } from '@mathemon/turbo-server/regex.js';
import { body } from 'express-validator';

export const validateAccountEdition = [
  body('email').optional().isEmail().normalizeEmail().notEmpty(),
  body('username').optional().isString().trim().notEmpty(),
  body('password').optional().isString().trim().notEmpty().matches(password),
];
