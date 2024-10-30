import { NextFunction, Request, Response } from 'express';
import { oneRoleRequirementHandler } from './oneRoleRequirementHandler.js';

export const planner = (req: Request, res: Response, next: NextFunction) => {
  oneRoleRequirementHandler(req, res, next, 'planner');
};
