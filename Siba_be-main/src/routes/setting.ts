import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import {
  validateSettingPost,
  validateSettingPut,
} from '../validationHandler/setting.js';

const setting = express.Router();

// get all settings
setting.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db('GlobalSetting')
      .select()
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the settings from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Error trying to read all settings from DB',
        );
      });
  },
);

// get setting by id
setting.get(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db('GlobalSetting')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the settings from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Nothing came through - GlobalSetting',
        );
      });
  },
);

// add setting
setting.post(
  '/',
  validateSettingPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db('GlobalSetting')
      .insert(req.body)
      .into('GlobalSetting')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a setting, or multiple settings was succesful',
        );
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Conflict: Setting with the variable ${req.body.variable} already exists!`,
          );
        } else if (error.errno === 1054) {
          requestErrorHandler(
            req,
            res,
            "error in spelling [either in 'variable' and/or in 'description'].",
          );
        } else {
          dbErrorHandler(req, res, error, 'error adding setting');
        }
      });
  },
);

// update setting
setting.put(
  '/',
  validateSettingPut,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    if (!req.body.variable) {
      requestErrorHandler(req, res, 'Setting variable is missing.');
    } else {
      db('GlobalSetting')
        .where('id', req.body.id)
        .update(req.body)
        .then((rowsAffected) => {
          if (rowsAffected === 1) {
            successHandler(
              req,
              res,
              rowsAffected,
              `Update setting successful! Count of modified rows: ${rowsAffected}`,
            );
          } else {
            requestErrorHandler(
              req,
              res,
              `Update setting not successful, ${rowsAffected} row modified`,
            );
          }
        })
        .catch((error) => {
          if (error.errno === 1062) {
            requestErrorHandler(
              req,
              res,
              `DB 1062: Setting with the variable ${req.body.variable} already exists!`,
            );
          } else if (error.errno === 1054) {
            requestErrorHandler(
              req,
              res,
              "error in spelling [either in 'variable' and/or in 'description'].",
            );
          } else {
            dbErrorHandler(req, res, error, 'error updating setting');
          }
        });
    }
  },
);

// delete setting by id
setting.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db('GlobalSetting')
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
          requestErrorHandler(req, res, `Invalid setting id:${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error delete failed');
      });
  },
);

export default setting;
