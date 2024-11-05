import db_knex from '../db/index_knex.js';
import {
  AllocatedRoomsByProgramType,
  AllocatedSubjectsByProgramType,
  RoomsByAllocId,
} from '../types/custom.js';
import { timestampFormatString } from '../validationHandler/index.js';

/* Get all the allocations */
const getAll = (): Promise<string> => {
  return db_knex
    .select('id', 'name', 'isSeasonAlloc', 'description', 'lastModified')
    .from('AllocRound as ar');
};

/* Get allocation by id */
const getById = async (allocRoundId: number): Promise<string> => {
  return db_knex
    .select(
      'ar.name',
      'ar.IsSeasonAlloc',
      'ar.description',
      'ar.lastModified',
      'ar.isAllocated',
      'ar.processOn',
      db_knex.raw(
        `COUNT(*) FROM AllocSubject WHERE AllocRound = ${allocRoundId} AS 'Subjects'`,
      ),
      db_knex.raw(
        `COUNT(*) FROM AllocSubject WHERE isAllocated = 1 AND AllocRound = ${allocRoundId} AS 'allocated'`,
      ),
    )
    .from('AllocRound as ar')
    .where('ar.id', `${allocRoundId}`)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

// Get all subjects in allocation by id
const getAllSubjectsById = async (allocRoundId: number) => {
  return db_knex
    .select(
      'sub.id',
      'sub.name',
      'asu.isAllocated',
      'asu.cantAllocate',
      'asu.priority',
      db_knex.raw(
        `IFNULL((SELECT CAST((asp.totalTime / 60) / 60) AS DECIMAL(10,2))
        FROM AllocSpace asp
        WHERE asp.allocRoundId = ${allocRoundId} AND asp.subjectId = s.id
        GROUP BY asp.subjectId), 0) AS "AllocatedHours",
        CAST(((HOUR(sub.sessionLength) + EXTRACT(MINUTE FROM sub.sessionLength)/60) * sub.groupCount * sub.sessionCount) AS DECIMAL(10,2)) AS "requiredHours"`,
      ),
    )
    .from('Subject as sub')
    .innerJoin('AllocSubject as asu', 'sub.id', 'asu.subjectId')
    .innerJoin('AllocSpace as asp', 'sub.id', 'asp.subjectId')
    .where('asu.allocRoundId', allocRoundId)
    .groupBy('sub.id')
    .orderBy('asu.priority', 'asc')
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

/* Get allocation round by id checking is read only (0 rows return - is read only) */
const getAllocRoundModifiableById = async (allocRoundId: number) => {
  return db_knex('AllocRound')
    .select()
    .where('id', allocRoundId)
    .andWhere('isReadOnly', false);
};

/* Get allocated rooms with allocation percentage */
const getRoomsByAllocId = async (
  allocRoundId: number,
): Promise<RoomsByAllocId[]> => {
  return db_knex<RoomsByAllocId[]>('Space')
    .select('Space.id', 'Space.name', 'SpaceType.acronym AS spaceTypeAcronym')
    .select({
      allocatedHours: db_knex.raw(
        `(SELECT IFNULL(CAST(SUM((asp.totalTime / 60) / 60) AS DECIMAL(10,2)), 0)
             FROM AllocSpace as asp
             WHERE spaceId = Space.id
             AND allocRoundId = ?
         )`,
        [allocRoundId],
      ),
    })
    .leftJoin('SpaceType as SpaceType', 'Space.spaceTypeId', 'SpaceType.id')
    .select({
      requiredHours: db_knex.raw(
        'HOUR(TIMEDIFF(Space.availableTo, Space.availableFrom))*5',
      ),
    })
    .orderByRaw('(allocatedHours / requiredHours) DESC') // Sort by allocation percentage
    .orderBy('Space.name'); // Then sort by name
};

/* Get allocated rooms by Program.id and AllocRound.id */
const getAllocatedRoomsByProgram = async (
  programId: number,
  allocRoundId: number,
): Promise<AllocatedRoomsByProgramType> => {
  return db_knex
    .distinct(
      'sp.id',
      'sp.name',
      'st.acronym as spaceTypeAcronym',
      db_knex.raw(
        'CAST(SUM((asp.totalTime / 60) / 60) AS DECIMAL(10,2)) AS allocatedHours',
      ),
    )
    .from('AllocSpace as asp')
    .join('Space as sp', 'asp.spaceId', 'sp.id')
    .join('Subject as sub', 'asp.subjectId', 'sub.id')
    .join('Program as p', 'sub.programId', 'p.id')
    .join('SpaceType as st', 'sp.spaceTypeId', 'st.id')
    .where('p.id', programId)
    .andWhere('asp.allocRoundId', allocRoundId)
    .groupBy('sp.id');
};

/* Get allocated rooms by Subject.id and AllocRound.id */
const getAllocatedRoomsBySubject = (
  subjectId: number,
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .distinct(
      'sp.id',
      'sp.name',
      db_knex.raw(
        'cast(sum((asp.totalTime / 60) / 60) as decimal(10,2)) as allocatedHours',
      ),
    )
    .from('AllocSpace as asp')
    .leftJoin('Space as sp', 'asp.spaceId', 'sp.id')
    .leftJoin('Subject as sub', 'asp.subjectId', 'sub.id')
    .where('asp.subjectId', subjectId)
    .andWhere('asp.allocRoundId', allocRoundId)
    .groupBy('sp.id');
};

/* Get subjects by Program.id and AllocRound.id */
const getSubjectsByProgram = (
  allocRoundId: number,
  programId: number,
): Promise<AllocatedSubjectsByProgramType> => {
  return db_knex
    .select(
      'asu.subjectId as id',
      'sub.name',
      db_knex.raw(
        'IFNULL(CAST(SUM((asp.totalTime / 60) / 60) as decimal(10,2)), 0) AS allocatedHours',
      ),
      db_knex.raw(
        'CAST((sub.groupCount * (HOUR(sub.sessionLength) + EXTRACT(MINUTE FROM sub.sessionLength)/60) * sub.sessionCount) AS DECIMAL(10,2)) as requiredHours',
      ),
    )
    .from('AllocSubject as asu')
    .join('Subject as sub', 'asu.subjectId', 'sub.id')
    .join('Program as p', 'sub.programId', 'p.id')
    .leftJoin('AllocSpace as asp', function () {
      this.on('asu.subjectId', 'asp.subjectId').andOn(
        'asu.allocRoundId',
        'asp.allocRoundId',
      );
    })
    .where('p.id', programId)
    .andWhere('asu.allocRoundId', allocRoundId)
    .groupBy('asu.subjectId');
};

/* Get subjects by Room.id and AllocRound.id */
const getAllocatedSubjectsByRoom = async (
  roomId: number,
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .select(
      'sub.id',
      'sub.name',
      // EXTRACT(HOUR FROM ...) returns hours from 0 to 23 in certain MariaDB versions.
      // Use HOUR instead to get more than 24 hours. https://mariadb.com/kb/en/extract/
      db_knex.raw('TRUNCATE((totalTime / 60) / 60, 2) as totalTime'),
    )
    .from('AllocSpace as asp')
    .innerJoin('Subject as sub', 'sub.id', 'asp.subjectId')
    .where('asp.spaceId', roomId)
    .andWhere('asp.allocRoundId', allocRoundId)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

/* START ALLOCATION - Procedure in database */
const startAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call startAllocation(${allocRoundId})`);
};

/* RESET ALLOCATION - Procedure in database */
const resetAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call resetAllocation(${allocRoundId})`);
};

/* ABORT ALLOCATION - Procedure in database */
const abortAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call abortAllocation(${allocRoundId})`);
};

// No more just for test round 10004
const getUnAllocableSubjects = async (
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .select(
      'asu.subjectId',
      'sub.name',
      'sub.groupSize',
      'sub.area',
      'st.name as spaceType',
      'sub.allocRoundId',
      'sub.isNoisy',
    )
    .from('AllocSubject as asu')
    .join('Subject as sub', 'asu.subjectId', 'sub.id')
    .join('SpaceType as st', 'sub.spaceTypeId', 'st.id')
    .where('cantAllocate', '1')
    .andWhere('sub.allocRoundId', allocRoundId)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

const getSpacesForSubject = async (subjectId: number): Promise<string> => {
  return db_knex
    .select(
      'sp.id',
      'sp.name',
      'sp.area',
      db_knex.raw(`getMissingItemAmount(${subjectId}, sp.id) as missingItems`),
      db_knex.raw(
        `IF(sp.area >= (SELECT area FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS areaOk`,
      ),
      'sp.personLimit',
      db_knex.raw(
        `IF(sp.personLimit >= (SELECT groupSize FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS personLimitOk`,
      ),
      'sp.inUse',
      'st.name as spaceType',
      db_knex.raw(
        `IF(st.id = (SELECT spaceTypeId FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS spaceTypeOk`,
      ),
      'sp.isLowNoise',
    )
    .from('Space as sp')
    .leftJoin('SpaceEquipment as se', 'sp.id', 'se.spaceId')
    .leftJoin('SpaceType as st', 'sp.spaceTypeId', 'st.id')
    .groupBy('sp.id')
    .orderByRaw(
      `FIELD(st.id, (SELECT spaceTypeId FROM Subject WHERE id = ${subjectId})) DESC`,
    )
    .orderBy([
      { column: 'missingItems' },
      { column: 'personLimitOk', order: 'desc' },
      { column: 'areaOk', order: 'desc' },
    ])
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

const getMissingEquipmentForRoom = async (
  subjectId: number,
  spaceId: number,
): Promise<string> => {
  return db_knex
    .select('e.id', 'e.name')
    .from('SubjectEquipment as subeq')
    .join('Equipment as e', 'subeq.equipmentId', 'e.id')
    .where('subjectId', subjectId)
    .except(
      db_knex
        .select('e.id', 'e.name')
        .from('SpaceEquipment as speq')
        .join('Equipment as e', 'speq.equipmentId', 'e.id')
        .where('spaceId', spaceId),
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

const allocationReport = async (allocRoundId: number) => {
  return db_knex
    .distinct(
      db_knex.raw(
        `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
      ),
      'ar.id as allocId',
      'ar.name as allocation',
      db_knex.raw(
        `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
      ),
      db_knex.raw(
        `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
      ),
      'd.name as department',
      'p.name as program',
      'sub.name as lesson',
      'sp.name as room',
      db_knex.raw('TRUNCATE((totalTime / 60) / 60, 2) as hours'),
    )
    .from('AllocSpace as asp')
    .innerJoin('AllocRound as ar', 'asp.allocRoundId', 'ar.id')
    .innerJoin('Space as sp', 'asp.spaceId', 'sp.id')
    .innerJoin('Subject as sub', 'asp.subjectId', 'sub.id')
    .innerJoin('Program as p', 'sub.programId', 'p.id')
    .innerJoin('Department as d', 'p.departmentId', 'd.id')
    .innerJoin('AllocSubject as asu', 'asp.allocRoundId', 'asu.allocRoundId')
    .where('asp.allocRoundId', allocRoundId)
    .andWhere('asu.isAllocated', 1)
    .orderBy([
      { column: 'department' },
      { column: 'program' },
      { column: 'lesson' },
    ])
    .union(
      db_knex
        .select(
          db_knex.raw(
            `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
          ),
          'ar.id as allocId',
          'ar.name as allocation',
          db_knex.raw(
            `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
          ),
          db_knex.raw(
            `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
          ),
          'd.name as department',
          'p.name as program',
          'sub.name as lesson',
          db_knex.raw('NULL as room'),
          db_knex.raw('NULL as hours'),
        )
        .from('AllocSubject as asu')
        .innerJoin('Subject as sub', 'asu.subjectId', 'sub.id')
        .innerJoin('AllocRound as ar', 'asu.allocRoundId', 'ar.id')
        .innerJoin('Program as p', 'sub.programId', 'p.id')
        .innerJoin('Department as d', 'p.departmentId', 'd.id')
        .where('asu.allocRoundId', allocRoundId)
        .andWhere('asu.cantAllocate', 1),
    );
};

const plannerReport = async (allocRoundId: number, userId: number) => {
  return db_knex
    .distinct(
      db_knex.raw(
        `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
      ),
      'ar.id as allocId',
      'ar.name as allocation',
      db_knex.raw(
        `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
      ),
      db_knex.raw(
        `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
      ),
      'd.name as department',
      'p.name as program',
      'sub.name as lesson',
      'sp.name as room',
      db_knex.raw('TRUNCATE((totalTime / 60) / 60, 2) as hours'),
    )
    .from('DepartmentPlanner as dp')
    .innerJoin('Department as d', 'dp.departmentId', 'd.id')
    .innerJoin('Program as p', 'd.id', 'p.departmentId')
    .innerJoin('Subject as sub', 'p.id', 'sub.programId')
    .innerJoin('AllocSpace as asp', 'sub.id', 'asp.subjectId')
    .innerJoin('AllocRound as ar', 'asp.allocRoundId', 'ar.id')
    .innerJoin('AllocSubject as asu', 'ar.id', 'asu.allocRoundId')
    .innerJoin('Space as sp', 'asp.spaceId', 'sp.id')
    .where('dp.userId', userId)
    .andWhere('asp.allocRoundId', allocRoundId)
    .andWhere('asu.isAllocated', 1)
    .orderBy([
      { column: 'department' },
      { column: 'program' },
      { column: 'lesson' },
    ])
    .union(
      db_knex
        .select(
          db_knex.raw(
            `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
          ),
          'ar.id as allocId',
          'ar.name as allocation',
          db_knex.raw(
            `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
          ),
          db_knex.raw(
            `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
          ),
          'd.name as department',
          'p.name as program',
          'sub.name as lesson',
          db_knex.raw('NULL as room'),
          db_knex.raw('NULL as hours'),
        )
        .from('AllocSubject as asu')
        .innerJoin('Subject as sub', 'asu.subjectId', 'sub.id')
        .innerJoin('AllocRound as ar', 'asu.allocRoundId', 'ar.id')
        .innerJoin('Program as p', 'sub.programId', 'p.id')
        .innerJoin('Department as d', 'p.departmentId', 'd.id')
        .innerJoin('DepartmentPlanner as dp', 'd.id', 'dp.departmentId')
        .where('asu.allocRoundId', allocRoundId)
        .andWhere('asu.cantAllocate', 1)
        .andWhere('dp.userId', userId),
    );
};

const fullReport = async () => {
  return db_knex
    .distinct(
      db_knex.raw(
        `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
      ),
      'ar.id as allocId',
      'ar.name as allocation',
      db_knex.raw(
        `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
      ),
      db_knex.raw(
        `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
      ),
      'd.name as department',
      'p.name as program',
      'sub.name as lesson',
      'sp.name as room',
      db_knex.raw('TRUNCATE((totalTime / 60) / 60, 2) as hours'),
    )
    .from('AllocSpace as asp')
    .innerJoin('AllocRound as ar', 'asp.allocRoundId', 'ar.id')
    .innerJoin('AllocSubject as asu', 'ar.id', 'asu.allocRoundId')
    .innerJoin('Space as sp', 'asp.spaceId', 'sp.id')
    .innerJoin('Subject as sub', 'asp.subjectId', 'sub.id')
    .innerJoin('Program as p', 'sub.programId', 'p.id')
    .innerJoin('Department as d', 'p.departmentId', 'd.id')
    .where('asu.isAllocated', 1)
    .orderBy([
      { column: 'allocId' },
      { column: 'department' },
      { column: 'program' },
      { column: 'lesson' },
    ])
    .union(
      db_knex
        .select(
          db_knex.raw(
            `CASE WHEN asu.isAllocated = 1 THEN 'Yes' ELSE 'No' END AS Successful`,
          ),
          'ar.id as allocId',
          'ar.name as allocation',
          db_knex.raw(
            `DATE_FORMAT(lastCalcSuccs,"${timestampFormatString}") as "lastCalcSuccs"`,
          ),
          db_knex.raw(
            `DATE_FORMAT(lastCalcFail,"${timestampFormatString}") as "lastCalcFail"`,
          ),
          'd.name as department',
          'p.name as program',
          'sub.name as lesson',
          db_knex.raw('NULL as room'),
          db_knex.raw('NULL as hours'),
        )
        .from('AllocSubject as asu')
        .innerJoin('Subject as sub', 'asu.subjectId', 'sub.id')
        .innerJoin('AllocRound as ar', 'asu.allocRoundId', 'ar.id')
        .innerJoin('Program as p', 'sub.programId', 'p.id')
        .innerJoin('Department as d', 'p.departmentId', 'd.id')
        .where('asu.cantAllocate', 1),
    );
};

export default {
  getAll,
  getById,
  getAllSubjectsById,
  getAllocRoundModifiableById,
  getRoomsByAllocId,
  getSubjectsByProgram,
  getAllocatedRoomsByProgram,
  startAllocation,
  resetAllocation,
  getAllocatedRoomsBySubject,
  getUnAllocableSubjects,
  getSpacesForSubject,
  getMissingEquipmentForRoom,
  getAllocatedSubjectsByRoom,
  abortAllocation,
  allocationReport,
  plannerReport,
  fullReport,
};
