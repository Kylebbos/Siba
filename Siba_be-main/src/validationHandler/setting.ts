import {
  validateDescription,
  validateIdObl,
  validateVariableObl,
} from './index.js';

export const validateSettingPost = [
  ...validateVariableObl,
  ...validateDescription,
];

export const validateSettingPut = [...validateSettingPost, ...validateIdObl];
