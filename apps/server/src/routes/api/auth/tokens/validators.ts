import { body } from 'express-validator';

export const validateTokenCreation = [
  body('usernameOrEmail').isString().trim(),
  body('password').exists().trim(),
];
