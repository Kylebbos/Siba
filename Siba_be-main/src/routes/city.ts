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
  validateCityPost,
  validateCityPut,
  validateCityId,
} from '../validationHandler/city.js';
import { validate, validateIdObl } from '../validationHandler/index.js';

const city = express.Router();

// Get all cities
city.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .select('id', 'name', 'established', 'averageTemp')
      .orderBy('name', 'asc')
      .then((data) => {
        successHandler(req, res, data, 'getNames successful - City');
      })
      .catch((err) => {
        requestErrorHandler(req, res, `${err} - Failed to fetch cities`);
      });
  },
);

// Get city by ID
city.get(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(req, res, data, 'Successfully read city data');
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Failed to fetch city by ID');
      });
  },
);

// Search cities by name, contains "burg"
city.get(
  '/search/burg',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .select()
      .where('name', 'like', '%burg%')
      .then((data) => {
        successHandler(req, res, data, 'Successfully searched cities with "burg"');
      })
      .catch((err) => {
        requestErrorHandler(req, res, `Error in search: ${err}`);
      });
  },
);

// Search cities by searchText in query parameter
city.get(
  '/search',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const { searchText } = req.query;
    db_knex('City')
      .select()
      .where('name', 'like', `%${searchText}%`)
      .then((data) => {
        successHandler(req, res, data, 'City search completed');
      })
      .catch((err) => {
        requestErrorHandler(req, res, `Search error: ${err}`);
      });
  },
);

// Filter cities by established date
city.get(
  '/established-before/:date',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const { date } = req.params;
    db_knex('City')
      .select()
      .where('established', '<', date)
      .then((data) => {
        successHandler(req, res, data, 'Cities filtered by established date');
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Error filtering cities by date');
      });
  },
);

// Add a new city
city.post(
  '/',
  validateCityPost,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .insert(req.body)
      .then((idArray) => {
        successHandler(req, res, idArray, 'City added successfully');
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(req, res, `City with the ID ${req.body.id} already exists`);
        } else {
          dbErrorHandler(req, res, error, 'Error adding city');
        }
      });
  },
);

// Edit an existing city
city.put(
  '/:id',
  validateCityPut,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
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
        dbErrorHandler(req, res, error, 'Error updating city');
      });
  },
);

// Delete a city
city.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(req, res, rowsAffected, 'City deleted successfully');
        } else {
          requestErrorHandler(req, res, `City with ID ${req.params.id} not found`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting city');
      });
  },
);

export default city;
