import { NextFunction, Request, Response } from 'express';
import { RoleName, RolePropertyName } from '../types/custom.js';

export const oneRoleRequirementHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  roleName: RoleName,
) => {
  req.requiredRolesList.push(roleName);
  const rolePropertyName = `is${roleName
    .substring(0, 1)
    .toUpperCase()}${roleName.substring(1).toLowerCase()}` as RolePropertyName;
  if (req.user[rolePropertyName] === 1) {
    req.areRolesRequired = 1;
    console.log(`Logged in User has role: ${roleName}`);
  } else {
    if (req.areRolesRequired === 0) {
      req.areRolesRequired = -1;
    } else {
      // req.areRolesRequired must have already been 1 or -1
    }
  }

  next(); // No matter what we go to next role handler or roleChecker
};
