import pool from "../db/connection.js";

const createCompanyAndEmployee = async (name, email, password, is_admin) => {
  try {
    // Inicia uma transação
    await pool.query("BEGIN");

    // Insere a empresa na tabela `companies`
    const companyResult = await pool.query(
      `INSERT INTO companies (name, is_active) VALUES ($1, $2) RETURNING id_company`,
      [name, true]
    );
    const companyId = companyResult.rows[0].id_company;

    // Insere o funcionário na tabela `employees`
    await pool.query(
      `INSERT INTO employees (name, email, password, is_admin, company_id) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, password, is_admin, companyId]
    );

    // Confirma a transação
    await pool.query("COMMIT");

    return { message: "Empresa e funcionário criados com sucesso!" };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw new Error("Erro ao criar empresa e funcionário: " + error.message);
  }
};

export default {
  createCompanyAndEmployee,
};

/*const createCompany = async (name) => {
  const query = `
          INSERT INTO companies (name)
          VALUES ($1) RETURNING *
      `;
  const values = [name];

  const result = await pool.query(query, values);
  return result.rows[0];
};*/
