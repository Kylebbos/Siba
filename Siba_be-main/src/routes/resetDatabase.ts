import fs from 'node:fs';
import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validate } from '../validationHandler/index.js';

const resetDatabase = express.Router();

//reading sql statements from the file
const sqlStatements = fs
  //.readFileSync('./Database/SQL_Scripts/000__CreateALLdb.sql')
  .readFileSync(
    './Database/SQL_Scripts/06__drop_tables_create_tables_insert_test_data.sql',
  )
  .toString();

//resetting the database with knex
resetDatabase.get(
  '/',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    process.env.BE_DEVELOPMENT_PHASE === 'true'
      ? db_knex
          .raw(sqlStatements)
          .then((data) =>
            successHandler(req, res, data, 'Database reset success!'),
          )
          .catch((err) =>
            dbErrorHandler(req, res, err, 'Database reset failed!'),
          )
      : requestErrorHandler(req, res, 'Not in development mode!');
  },
);

export default resetDatabase;
