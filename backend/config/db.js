import knex from 'knex';
import { development } from './knex.js';

const db = knex(development);

export default db;
