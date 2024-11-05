import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import allocationService from '../services/allocation.js';
import programService from '../services/program.js';
import logger from '../utils/logger.js';
import { validateAllocRoundId } from '../validationHandler/allocRound.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import { validateAllocRoundIdAndSubjectId } from '../validationHandler/subject.js';

const allocation = express.Router();

/* Get rooms with allocated hours by allocationRoundId */
allocation.get(
  '/:allocationRoundId/rooms',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const id = req.params.allocationRoundId;
    allocationService
      .getRoomsByAllocId(Number(id))
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'getRoomsByAllocId succesful - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Nothing came through - Allocation getRoomsByAllocId',
        );
      });
  },
);

/* Get all allocated rooms in programs by allocationId and program */
allocation.get(
  '/:id/program',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    programService
      .getAll()
      .then(async (programs) => {
        return await Promise.all(
          programs.map(async (program) => {
            const rooms = await allocationService.getAllocatedRoomsByProgram(
              program.id,
              Number(id),
            );
            const subjects = await allocationService.getSubjectsByProgram(
              Number(id),
              program.id,
            );
            return {
              ...program,
              rooms,
              subjects,
            };
          }),
        );
      })
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'getRoomsByProgram succesful - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Nothing came through - Allocation',
        );
      });
  },
);

/* Get all allocated rooms by subjectId, allocRoundId */
allocation.get(
  '/:allocRoundId/rooms/:subjectId',
  validateAllocRoundIdAndSubjectId,
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.params.allocRoundId;
    const subjectId = req.params.subjectId;
    const rooms = await allocationService
      .getAllocatedRoomsBySubject(Number(subjectId), Number(allocRoundId))
      .then((rooms) => {
        successHandler(
          req,
          res,
          rooms,
          'getRoomsBySubject succesful - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Allocation report get failed - Allocation',
        );
      });

    return rooms;
  },
);

/* gets unallocated subjects */
allocation.get(
  '/:id/subject/unallocated',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.params.id;
    logger.debug(`Alloc round id for unallocated: ${allocRoundId}`);
    await allocationService
      .getUnAllocableSubjects(Number(allocRoundId))
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Unallocated subjects returned - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Failure - unAllocated');
      });
  },
);

allocation.get(
  '/subject/:id/rooms',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const subjectId = req.params.id;
    await allocationService
      .getSpacesForSubject(Number(subjectId))
      .then((data) => {
        successHandler(req, res, data, 'Get Spaces for subject - Allocation');
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Failed get spaces for subject - unAllocated',
        );
      });
  },
);

// eqpt = equipment
allocation.get(
  '/missing-eqpt/subject/:subid/room/:roomid',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const subjectId = req.params.subid;
    const spaceId = req.params.roomid;
    await allocationService
      .getMissingEquipmentForRoom(Number(subjectId), Number(spaceId))
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Missing Equipment for Room - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Failed get equipments for the room - Allocation',
        );
      });
  },
);

/* Get all allocated subjects by RoomId, allocRound */
allocation.get(
  '/:id/subjects/:roomId',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.params.id;
    const roomId = req.params.roomId;
    const subjects = await allocationService
      .getAllocatedSubjectsByRoom(Number(roomId), Number(allocRoundId))
      .then((subs) => {
        successHandler(
          req,
          res,
          subs,
          'getAllocatedSubjectsByRoom succesful - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Allocation report get failed');
      });
    return subjects;
  },
);

/*
  Reset allocation = remove all subjects from allocSpace
  and reset isAllocated, prioritynumber and cantAllocate in allocSubject
*/
allocation.post(
  '/reset',
  validateAllocRoundId,
  [authenticator, admin, planner, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.body.allocRoundId;

    // Check if alloc round is read only
    const allocRoundIsReadOnly =
      await allocationService.getAllocRoundModifiableById(allocRoundId);
    if (allocRoundIsReadOnly.length === 0) {
      logger.error('The allocRound is NOT MODIFIABLE allocRound');
      return requestErrorHandler(
        req,
        res,
        'Request failed! The allocRound is not modifiable',
      );
    } else {
      logger.verbose('The allocRound is MODIFIABLE');
    }

    allocationService
      .resetAllocation(allocRoundId)
      .then(() => {
        successHandler(
          req,
          res,
          'reset completed',
          'Allocation reset completed - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Allocation reset failed - Allocation',
        );
      });
  },
);

/* Abort allocation = Stop allocation procedure */
allocation.post(
  '/abort',
  validateAllocRoundId,
  [authenticator, admin, planner, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.body.allocRoundId;

    // Check if alloc round is read only
    const allocRoundIsReadOnly =
      await allocationService.getAllocRoundModifiableById(allocRoundId);
    if (allocRoundIsReadOnly.length === 0) {
      logger.error('The allocRound is NOT MODIFIABLE allocRound');
      return requestErrorHandler(
        req,
        res,
        'Request failed! The allocRound is not modifiable',
      );
    } else {
      logger.verbose('The allocRound is MODIFIABLE');
    }

    allocationService
      .abortAllocation(Number(allocRoundId))
      .then(() => {
        successHandler(
          req,
          res,
          'Aborting...',
          'Allocation abort completed - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Allocation abort failed - Allocation',
        );
      });
  },
);

// Starting the allocation calculation!
allocation.post(
  '/start',
  validateAllocRoundId,
  [authenticator, admin, planner, roleChecker, validate],
  async (req: Request, res: Response) => {
    const allocRoundId = req.body.allocRoundId;

    // Check if alloc round is read only
    const allocRoundIsReadOnly =
      await allocationService.getAllocRoundModifiableById(allocRoundId);
    if (allocRoundIsReadOnly.length === 0) {
      logger.error('The allocRound is NOT MODIFIABLE allocRound');
      return requestErrorHandler(
        req,
        res,
        'Request failed! The allocRound is not modifiable',
      );
    } else {
      logger.verbose('The allocRound is MODIFIABLE');
    }

    allocationService
      .startAllocation(allocRoundId)
      .then(() => {
        successHandler(
          req,
          res,
          'Allocation completed',
          'Allocation succesful - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Allocation failed - Allocation start',
        );
      });
  },
);

//Get data for allocation report to excel
allocation.get(
  '/report/:allocRoundId',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const allocRoundId = req.params.allocRoundId;
    allocationService
      .allocationReport(Number(allocRoundId))
      .then((data) => {
        successHandler(req, res, data, 'getAll succesful - Report');
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Report');
      });
  },
);

// get data for plannerReport to excel
allocation.get(
  '/plannerreport/:allocRoundId',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const allocRoundId = req.params.allocRoundId;
    const userId = req.user.id;
    allocationService
      .plannerReport(Number(allocRoundId), Number(userId))
      .then((data) => {
        successHandler(req, res, data, 'getAll succesful - Report');
      })
      .catch((err) => {
        logger.error('Some DB error while checking user dep planner rights');
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Report');
      });
  },
);

//Get Full Report for all allocations
allocation.get(
  '/report',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    allocationService
      .fullReport()
      .then((data) => {
        successHandler(req, res, data, 'getAll succesful - Report');
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Report');
      });
  },
);

export default allocation;
