import { validateDepartmentId } from './department.js';
import { validateUserId } from './user.js';

// or:  validateDepartmentPlannerPost
export const validateUserIdAndDepartmentId = [
  ...validateUserId,
  ...validateDepartmentId,
];
