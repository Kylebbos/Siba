import { validateEquipmentId } from './equipment.js';
import { validateSpaceId } from './space.js';

export const validateSpaceEquipmentPost = [
  ...validateSpaceId,
  ...validateEquipmentId,
];
