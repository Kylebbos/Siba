import {
  createIdValidatorChain,
  validateDescription,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateBuildingId = [...createIdValidatorChain('buildingId')];

export const validateBuildingPost = [
  ...validateNameObl,
  ...validateDescription,
];

export const validateBuildingPut = [...validateBuildingPost, ...validateIdObl];

// This is a bit different as body can have multiple objects,
// => MultiPost!!!
export const validateBuildingMultiPost = [
  ...validateMultiNameObl,
  ...validateMultiDescription,
];
