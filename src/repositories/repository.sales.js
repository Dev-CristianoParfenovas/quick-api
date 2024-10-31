import pool from "../db/connection.js";

const createSale = async (saleData) => {
  const query = `
    INSERT INTO sales (company_id, product_id, id_client, employee_id, quantity, total_price, sale_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    saleData.company_id,
    saleData.product_id,
    saleData.id_client,
    saleData.employee_id,
    saleData.quantity,
    saleData.total_price,
    saleData.sale_date || new Date(),
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getSalesByCompanyId = async (company_id) => {
  const query = `SELECT * FROM sales WHERE company_id = $1`;
  const result = await db.query(query, [company_id]);
  return result.rows;
};

const getSaleByIdAndCompanyId = async (id, company_id) => {
  const query = `SELECT * FROM sales WHERE id = $1 AND company_id = $2`;
  const result = await pool.query(query, [id, company_id]);
  return result.rows[0];
};

const updateSaleById = async (id, company_id, saleData) => {
  const query = `
    UPDATE sales
    SET product_id = $1, quantity = $2, total_price = $3
    WHERE id = $4 AND company_id = $5
    RETURNING *;
  `;
  const values = [
    saleData.product_id,
    saleData.quantity,
    saleData.total_price,
    id,
    company_id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteSaleById = async (id, company_id) => {
  const query = `DELETE FROM sales WHERE id = $1 AND company_id = $2 RETURNING *;`;
  const result = await pool.query(query, [id, company_id]);
  return result.rows[0];
};

export default {
  createSale,
  getSalesByCompanyId,
  getSaleByIdAndCompanyId,
  updateSaleById,
  deleteSaleById,
};
