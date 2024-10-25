import pool from "../db/connection.js";

const createCompany = async (name) => {
  const query = `
          INSERT INTO companies (name)
          VALUES ($1) RETURNING *
      `;
  const values = [name];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  createCompany,
};
