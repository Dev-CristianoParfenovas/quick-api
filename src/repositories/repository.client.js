import pool from "../db/connection.js";

const createClient = async (name, email, phone, password, company_id) => {
  const query = `
            INSERT INTO clients (name, email, phone, password, company_id)
            VALUES ($1,$2,$3,$4,$5) RETURNING *
        `;
  const values = [name, email, phone, password, company_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  createClient,
};
