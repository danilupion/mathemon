import { email, password } from '@mathemon/turbo-server/regex.js';
import { body } from 'express-validator';

export const validatePasswordTokenCreation = [body('email').isEmail().notEmpty().matches(email)];

export const validatePasswordChange = [
  body('password').isString().trim().notEmpty().matches(password),
];
