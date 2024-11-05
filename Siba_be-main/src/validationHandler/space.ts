import { validateBuildingId } from './building.js';
import {
  createBoolValidatorChain,
  createDescriptionValidatorChain,
  createFloatValidatorChain,
  createIdValidatorChain,
  createMultiBoolValidatorChain,
  createMultiDescriptionValidatorChain,
  createMultiFloatValidatorChain,
  createMultiNameValidatorChain,
  createMultiNumberValidatorChain,
  createMultiTimeValidatorChain,
  createNumberCountNonZeroIntegerValidatorChain,
  //createTimeLengthValidatorChainHoursAndMinutes,
  createTimeValidatorChain,
  validateIdObl,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';
import { validateSpaceTypeId } from './spaceType.js';

export const validateSpaceId = [...createIdValidatorChain('spaceId')];

export const validateMultiSpaceInfo = [
  ...createMultiDescriptionValidatorChain('info'),
];

export const validateSpacePost = [
  ...validateNameObl,
  ...createFloatValidatorChain('area'),
  ...createDescriptionValidatorChain('info'),
  ...createNumberCountNonZeroIntegerValidatorChain('personLimit'),
  ...createTimeValidatorChain('availableFrom'),
  ...createTimeValidatorChain('availableTo'),
  ...createTimeValidatorChain('classesFrom'),
  ...createTimeValidatorChain('classesTo'),
  ...validateBuildingId,
  ...validateSpaceTypeId,
  ...createBoolValidatorChain('inUse'),
  ...createBoolValidatorChain('isLowNoise'),
];

export const validateSpacePut = [...validateIdObl, ...validateSpacePost];

export const validateMultiSpacePost = [
  ...validateMultiNameObl,
  ...createMultiFloatValidatorChain('area'),
  ...validateMultiSpaceInfo,
  ...createMultiNumberValidatorChain('personLimit'),
  ...createMultiNameValidatorChain('buildingName'),
  ...createMultiTimeValidatorChain('availableFrom'),
  ...createMultiTimeValidatorChain('availableTo'),
  ...createMultiTimeValidatorChain('classesFrom'),
  ...createMultiTimeValidatorChain('classesTo'),
  ...createMultiBoolValidatorChain('inUse'),
  ...createMultiBoolValidatorChain('isLowNoise'),
  ...createMultiNameValidatorChain('spaceType'),
];
