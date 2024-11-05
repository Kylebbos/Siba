import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { authenticationErrorHandler } from '../responseHandler/index.js';
import { User } from '../types/custom.js';
import logger from '../utils/logger.js';

dotenv.config(); // In order to load environment variables to process.env

export const authenticator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');
  // logger.debug('Header: ' + req.get('Authorization'));
  // logger.debug('Old version stopped working: ' + req.headers['Authorization']);

  // Taking the leading 'Bearer' and space ' ' out
  const token = authHeader?.split(' ')[1]; // "Bearer e6rerq767q6e76qw7e6e6..."

  if (!token) {
    logger.error(`Token: ${token}`);
    authenticationErrorHandler(req, res, 'Login TOKEN not found in headers');
    return;
  } else {
    try {
      const verified = jsonwebtoken.verify(
        token,
        process.env.SECRET_TOKEN as string, // TODO!!!
      );
      const currentTime = Math.floor(Date.now() / 1000); // Time in seconds
      const iat = typeof verified === 'object' ? verified.iat ?? 0 : 0;

      // Checking if token is older than 1 hour (3600 seconds)

      if (currentTime - iat > Number(process.env.TOKEN_EXPIRATION_SECONDS)) {
        authenticationErrorHandler(req, res, 'Token Expired');
        return;
      }

      req.user = verified as User; // Type assertion. Programmer knows User object will come out from decryption
      req.areRolesRequired = 0;
      req.requiredRolesList = [];
      next();
    } catch (err) {
      authenticationErrorHandler(req, res, 'Login token found but NOT valid');
    }
  }
};
