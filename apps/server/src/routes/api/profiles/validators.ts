import { email, password } from '@mathemon/turbo-server/regex.js';
import { body } from 'express-validator';

export const validateProfileCreation = [
  body('email').isEmail().notEmpty().matches(email),
  body('username').isString().trim().notEmpty(),
  body('password').isString().trim().notEmpty().matches(password),
];
