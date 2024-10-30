import express, { Request, Response } from 'express';
import { MysqlError } from 'mysql';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import {
  validateSpaceTypeMultiPost,
  validateSpaceTypePost,
  validateSpaceTypePut,
} from '../validationHandler/spaceType.js';

const spaceType = express.Router();

function handleErrorBasedOnErrno(
  req: Request,
  res: Response,
  error: MysqlError,
  defaultMessage: string,
) {
  switch (error.errno) {
    case 1062:
      requestErrorHandler(
        req,
        res,
        `Conflict: SpaceType with the name ${req.body.name} or acronym ${req.body.acronym} already exists!`,
      );
      break;
    case 1054:
      requestErrorHandler(
        req,
        res,
        "error in spelling [either in 'name', 'acronym' and/or in 'description'].",
      );
      break;
    default:
      dbErrorHandler(req, res, error, defaultMessage);
      break;
  }
}

// Get space type id:s and name:s, for populating a select list
// spaceType.get('/getSelectData', (req, res) => {
//   const sqlSelectName = 'SELECT id, name FROM SpaceType';
//   db.query(sqlSelectName, (err, result) => {
//     if (err) {
//       dbErrorHandler(req, res, err, 'Oops! Nothing came through - SpaceType');
//     } else {
//       successHandler(req, res, result, 'getNames successful - SpaceType');
//     }
//   });
// });

// get all spacetypes
spaceType.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .select()
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'All SpaceTypes fetched succesfully from DB.',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Error trying to read all SpaceTypes from DB',
        );
      });
  },
);

// get spacetype by id
spaceType.get(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        if (data.length === 1) {
          successHandler(
            req,
            res,
            data,
            'All SpaceTypes fetched succesfully from DB.',
          );
        } else {
          requestErrorHandler(
            req,
            res,
            `Failed to fetch SpaceType from DB with id: ${req.params.id}`,
          );
        }
      });
  },
);

// adding single spacetype
spaceType.post(
  '/',
  validateSpaceTypePost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .insert(req.body)
      .into('SpaceType')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a spacetype, or multiple spacetypes was succesful',
        );
      })
      .catch((error) => {
        handleErrorBasedOnErrno(req, res, error, 'error adding space type');
      });
  },
);

// adding single or multiple spacetype
spaceType.post(
  '/multi',
  validateSpaceTypeMultiPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .insert(req.body)
      .into('SpaceType')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a space type, or multiple space types was succesful',
        );
      })
      .catch((error) => {
        handleErrorBasedOnErrno(req, res, error, 'error adding space type');
      });
  },
);

// updating building information
spaceType.put(
  '/',
  validateSpaceTypePut,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .where('id', req.body.id)
      .update(req.body)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Update space type successful! Count of modified rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(
            req,
            res,
            `Update space type not successful, ${rowsAffected} row modified`,
          );
        }
      })
      .catch((error) => {
        handleErrorBasedOnErrno(req, res, error, 'error updating space type');
      });
  },
);

spaceType.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .select()
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete succesfull! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(
            req,
            res,
            `Invalid space type id:${req.params.id}`,
          );
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting space type');
      });
  },
);

export default spaceType;
