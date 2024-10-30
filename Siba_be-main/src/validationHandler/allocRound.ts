import { NextFunction, Request, Response } from 'express';
import {
  createIdValidatorChain,
  validateDescriptionObl,
  validateIdObl,
  validateNameObl,
} from './index.js';
import { validateUserId } from './user.js';

const validateIsReadOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { isReadOnly } = req.body;

  if (isReadOnly !== undefined && !(isReadOnly === 0 || isReadOnly === 1)) {
    return res
      .status(400)
      .json({ message: 'isReadOnly must be a boolean value.' });
  }
  next();
};

export const validateAllocRoundId = [...createIdValidatorChain('allocRoundId')];
export const validateCopiedAllocRoundId = [
  ...createIdValidatorChain('copiedAllocRoundId'),
];

export const validateAllocRoundPost = [
  ...validateNameObl,
  validateIsReadOnly,
  //...validateUserId,
  ...validateDescriptionObl,
];

export const validateAllocRoundCopyPost = [
  ...validateAllocRoundPost,
  ...validateUserId,
  ...validateCopiedAllocRoundId,
];

export const validateAllocRoundPut = [
  ...validateIdObl,
  ...validateAllocRoundPost,
];
