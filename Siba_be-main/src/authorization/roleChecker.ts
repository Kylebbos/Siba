import { NextFunction, Request, Response } from 'express';
import { authorizationErrorHandler } from '../responseHandler/index.js';

export const roleListPrinter = (req: Request): string => {
  let rolesListText = 'Roles accepted: ';
  for (const element of req.requiredRolesList) {
    rolesListText += `${element} `;
  }

  return rolesListText;
};

export const roleChecker = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.areRolesRequired !== 0 && req.areRolesRequired !== 1) {
    // areRolesRequired is then supposed to be -1 = roles required,
    // but none of the roles were present
    if (req.areRolesRequired === -1) {
      authorizationErrorHandler(
        req,
        res,
        `Roles missing, ${roleListPrinter(req)}`,
      );
    } else {
      authorizationErrorHandler(
        req,
        res,
        'Voe tokkiinsa. Role checking has some programming error!',
      );
    }
  } else {
    console.debug(`Role check success! ${roleListPrinter(req)}`);
    next();
  }
};
