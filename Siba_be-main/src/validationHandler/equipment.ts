import {
  createBoolValidatorChain,
  createIdValidatorChain,
  createMultiBoolValidatorChain,
  createMultiNumberValidatorChain,
  createNameValidatorChain,
  createNumberCountNonZeroIntegerValidatorChain,
  createNumberValidatorChain,
  validateDescription,
  validateIdObl,
  validateMultiDescription,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';

export const validateEquipmentId = [...createIdValidatorChain('equipmentId')];

export const validateEquipmentPost = [
  ...validateNameObl,
  ...validateDescription,
  ...createNumberValidatorChain('priority'),
  ...createBoolValidatorChain('isMovable'),
];

export const validateEquipmentPut = [
  ...validateEquipmentPost,
  ...validateIdObl,
];

export const validateEquipmentMultiPost = [
  ...validateMultiNameObl,
  ...createMultiBoolValidatorChain('isMovable'),
  ...createMultiNumberValidatorChain('priority'),
  ...validateMultiDescription,
];
