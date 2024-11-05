import express, { Request, Response } from 'express';
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
import {
  validateEquipmentId,
  validateEquipmentMultiPost,
  validateEquipmentPost,
  validateEquipmentPut,
} from '../validationHandler/equipment.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import { validateSubjectId } from '../validationHandler/subject.js';

const equipment = express.Router();

// Equipment id:s and name:s,
// for a select list and for the default priority done with Knex
equipment.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .select('id', 'name', 'priority', 'description', 'isMovable')
      .orderBy('name', 'asc')
      .then((data) => {
        successHandler(req, res, data, 'getNames successful - Equipment');
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err} Oops! Nothing came through - Equipment`,
        );
      });
  },
);

// get equipment by id
equipment.get(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the equipment from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Equipment');
      });
  },
);

// adding an equipment
equipment.post(
  '/',
  validateEquipmentPost,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .insert(req.body)
      .into('Equipment')
      .then((idArray) => {
        successHandler(req, res, idArray, 'Adding an equipment was succesful.');
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Equipment with the ${req.body.id} already exists!`,
          );
        } else if (error.errno === 1052) {
          dbErrorHandler(req, res, error, 'Error in database column name');
        } else {
          dbErrorHandler(req, res, error, 'Error adding equipment');
        }
      });
  },
);

// add multiple equipments
equipment.post(
  '/multi',
  validateEquipmentMultiPost,
  [authenticator, planner, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .insert(req.body)
      .into('Equipment')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding multiple equipments was succesful.',
        );
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(req, res, 'Equipment already exists!');
        } else if (error.errno === 1052) {
          dbErrorHandler(req, res, error, 'Error in database column name');
        } else {
          dbErrorHandler(req, res, error, 'Error adding equipment.');
        }
      });
  },
);

// updating an equipment
equipment.put(
  '/:id',
  validateEquipmentPut,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .where('id', req.body.id)
      .update(req.body)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(req, res, rowsAffected, 'Updated succesfully');
        } else {
          requestErrorHandler(req, res, 'Error');
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error updating equipment');
      });
  },
);

// deleting an equipment
equipment.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete successful! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid number id: ${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting equipment');
      });
  },
);
// fetching total numbers of subject id associtaed to an equipment by id
equipment.get(
  '/:id/subjectCount',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const equipmentId = req.params.id;
    db_knex('SubjectEquipment')
      .count('subjectId')
      .where('equipmentId', equipmentId)
      .then((subjectCount) => {
        successHandler(
          req,
          res,
          subjectCount,
          'getSubjectCount successful - SubjectEquipment',
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Nothing came through - SubjectEquipment',
        );
      });
  },
);

// fetch first five subject names of a selected equipment by id
equipment.get(
  '/:id/subjectFirstFiveNames',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const equipmentId = req.params.id;
    db_knex('Equipment')
      .join('SubjectEquipment', 'Equipment.id', 'SubjectEquipment.equipmentId')
      .join('Subject', 'SubjectEquipment.subjectId', 'Subject.id')
      .select('Subject.name')
      .where('equipmentId', equipmentId)
      .limit(5)
      .then((subjectsFirstFiveNames) => {
        successHandler(
          req,
          res,
          subjectsFirstFiveNames,
          'getSubjectsNamesList successful - SubjectEquipment',
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Nothing came through - SubjectEquipment',
        );
      });
  },
);
export default equipment;
