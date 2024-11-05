import { body, check } from 'express-validator';
import {
  createBoolValidatorChain,
  createIdValidatorChain,
  createMultiBoolValidatorChain,
  createMultiEmailValidatorChain,
  createMultiValueValidatorChain,
  validateIdObl,
} from './index.js';

export const validateUserId = [...createIdValidatorChain('userId')];

export const validateUserPost = [
  check('email').notEmpty().withMessage('Email cannot be empty').bail(),
  ...createBoolValidatorChain('isAdmin'),
  ...createBoolValidatorChain('isPlanner'),
  ...createBoolValidatorChain('isStatist'),
];
export const validateMultiUserPost = [
  ...createMultiEmailValidatorChain('email'),
  ...createMultiBoolValidatorChain('isAdmin'),
  ...createMultiBoolValidatorChain('isPlanner'),
  ...createMultiBoolValidatorChain('isStatist'),
  ...createMultiValueValidatorChain('departmentNames'),
];
export const validateUserPut = [...validateIdObl, ...validateUserPost];
