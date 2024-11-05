import { validateAllocRoundId } from './allocRound.js';
import {
  createBoolValidatorChain,
  createFloatValidatorChain,
  createIdValidatorChain,
  createMultiBoolValidatorChain,
  createMultiFloatValidatorChain,
  createMultiNumberValidatorChain,
  createMultiTimeValidatorChain,
  createNumberCountNonZeroIntegerValidatorChain,
  createNumberValidatorChain,
  createTimeLengthValidatorChainHoursAndMinutes,
  createTimeValidatorChain,
  validateIdObl,
  validateMultiNameObl,
  validateNameObl,
} from './index.js';
import { validateProgramId } from './program.js';

// This is a validator used by other routes which need subjectId as a foreign key
export const validateSubjectId = [...createIdValidatorChain('subjectId')];

export const validateAllocRoundIdAndSubjectId = [
  ...validateAllocRoundId,
  ...validateSubjectId,
];

export const validateSubjectPost = [
  ...validateNameObl,
  ...createNumberCountNonZeroIntegerValidatorChain('groupSize'),
  ...createNumberCountNonZeroIntegerValidatorChain('groupCount'),
  ...createTimeLengthValidatorChainHoursAndMinutes('sessionLength'),
  ...createNumberCountNonZeroIntegerValidatorChain('sessionCount'),
  ...createFloatValidatorChain('area'),
  ...createBoolValidatorChain('isNoisy'),
  ...validateProgramId,
];

// See how the PUT is usually just POST + id that exists for PUT already
export const validateSubjectPut = [...validateIdObl, ...validateSubjectPost];

// This is an example of rare need: When posting several Subject objects in request
// body as JSON array
export const validateSubjectMultiPost = [
  ...validateMultiNameObl,
  ...createMultiNumberValidatorChain('groupCount'),
  ...createMultiNumberValidatorChain('groupSize'),
  ...createMultiTimeValidatorChain('sessionLength'),
  ...createMultiFloatValidatorChain('area'),
  ...createMultiBoolValidatorChain('isNoisy'),
];
