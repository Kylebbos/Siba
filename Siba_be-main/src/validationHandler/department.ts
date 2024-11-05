import {
  createIdValidatorChain,
  validateDescription,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateDepartmentId = [...createIdValidatorChain('departmentId')];

export const validateDepartmentPost = [
  ...validateNameObl,
  ...validateDescription,
];

export const validateDepartmentMultiPost = [
  ...validateMultiNameObl,
  ...validateMultiDescription,
];

export const validateDepartmentPut = [
  ...validateDepartmentPost,
  ...validateIdObl,
];
