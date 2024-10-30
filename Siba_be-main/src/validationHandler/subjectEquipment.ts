import { validateEquipmentId } from './equipment.js';
import {
  createBoolValidatorChain,
  createNumberValidatorChain,
} from './index.js';
import { validateSubjectId } from './subject.js';

export const validateSubjectEquipmentPost = [
  ...validateSubjectId,
  ...validateEquipmentId,
  ...createNumberValidatorChain('priority'),
  ...createBoolValidatorChain('obligatory'),
];

export const validateSubjectAndEquipmentId = [
  ...validateSubjectId,
  ...validateEquipmentId,
];
