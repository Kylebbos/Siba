import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Result, ValidationError } from 'express-validator';
import { MysqlError } from 'mysql';
import logger from '../utils/logger.js';

const serverErrorMessage = 'Server error.';
const requestErrorMessage = 'Request error';
const dbErrorMessage = 'Database error';
const successMessage = 'OK';
const authenticationErrorMessage = 'Authentication error';
const authorizationErrorMessage = 'Authorization error';
const validationErrorMessage = 'Validation error';

dotenv.config({});

export const routePrinter = (req: Request): string => {
  const routeText = `${req.method} ${req.baseUrl.substring(4)}${req.path} `;
  return routeText;
};

// Add to BE .env file this line to get more info to FE:
// BE_DEVELOPMENT_PHASE=true
export const responseMessagePrinter = (
  defaultMessage: string,
  logMessage: string,
): string => {
  return `${
    process.env.BE_DEVELOPMENT_PHASE === 'true'
      ? `${defaultMessage}: ${logMessage}`
      : 'Message hidden if in production. Look at backend logs.'
  }`;
};

const logMessagePrinter = (
  providedMessage: string,
  defaultMessage: string,
): string => {
  return `${providedMessage ? providedMessage : defaultMessage} `;
};

// Formatter for printing the first validation error (index 0) out as string
export const validationErrorFormatter = (result: Result<ValidationError>) => {
  return `${result.array()[0].location}[${result.array()[0].param}]: ${
    result.array()[0].msg
  }`;
};

// ***

export const dbErrorHandler = (
  req: Request,
  res: Response,
  error: MysqlError,
  message: string,
): void => {
  let logMessage =
    routePrinter(req) + logMessagePrinter(message, dbErrorMessage);

  logMessage += `. Db error code: ${error.errno}`;
  logMessage += `. Db error message: ${error.message}`;
  logger.error(logMessage);

  res.status(500).send(responseMessagePrinter(dbErrorMessage, logMessage));
};

export const successHandler = (
  req: Request,
  res: Response,
  data: unknown,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + logMessagePrinter(message, successMessage);

  logger.http(logMessage);

  // If data is just a number, wrap an object around it
  const body = typeof data === 'number' ? { returnedNumberValue: data } : data;

  res.status(200).send(body);
};

export const requestErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + logMessagePrinter(message, requestErrorMessage);
  logger.error(logMessage);

  res.status(400).send(responseMessagePrinter(requestErrorMessage, logMessage));
};

export const authenticationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + logMessagePrinter(message, authenticationErrorMessage);
  logger.error(logMessage);

  res
    .status(401)
    .send(responseMessagePrinter(authenticationErrorMessage, logMessage));
};

export const authorizationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
) => {
  const logMessage =
    routePrinter(req) + logMessagePrinter(message, authorizationErrorMessage);
  logger.error(logMessage);

  res
    .status(403)
    .send(responseMessagePrinter(authorizationErrorMessage, logMessage));
};

export const validationErrorHandler = (
  req: Request,
  res: Response,
  message: string,
  validationResults?: Result<ValidationError>,
) => {
  let validationResultMessage = '';
  if (validationResults !== undefined) {
    validationResultMessage += validationErrorFormatter(validationResults);
  }
  validationResultMessage += `|${message}`;
  const logMessage =
    routePrinter(req) +
    logMessagePrinter(validationResultMessage, validationErrorMessage);

  logger.error(logMessage);

  res
    .status(400)
    .send(responseMessagePrinter(validationErrorMessage, logMessage));
};
