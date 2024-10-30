import db_knex from '../db/index_knex.js';
import { Program } from '../types/custom.js';

const getAll = (): Promise<Program[]> => {
  return db_knex.select('p.id', 'p.name').from('Program as p');
};

const getById = (id: number) => {
  return db_knex
    .select('p.id', 'p.name')
    .from('Program as p')
    .where('p.id', id);
};

export default {
  getAll,
  getById,
};
