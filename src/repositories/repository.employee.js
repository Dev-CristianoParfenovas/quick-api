import pool from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente
dotenv.config();

// Obter o segredo do JWT a partir da variável de ambiente
const secretToken = process.env.SECRET_TOKEN;
const saltRounds = 10; // Define o número de rounds de salt para o bcrypt

const createEmployee = async (
  name,
  email,
  phone,
  password,
  company_id,
  is_admin
) => {
  try {
    // 1. Verificar se já existe um funcionário com o mesmo email
    const checkQuery = `
      SELECT * FROM employees WHERE email = $1;
    `;
    const checkValues = [email];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      // Funcionário já existe, podemos atualizar ou lançar um erro
      const existingEmployee = checkResult.rows[0];

      // Se quiser atualizar o funcionário, pode modificar as colunas desejadas (exemplo: phone, is_admin, etc.)
      const updateQuery = `
        UPDATE employees
        SET name = $1, phone = $2, password = $3, is_admin = $4
        WHERE email = $5
        RETURNING *;
      `;
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Criptografar a nova senha
      const updateValues = [name, phone, hashedPassword, is_admin, email];
      const updateResult = await pool.query(updateQuery, updateValues);

      const updatedEmployee = updateResult.rows[0];

      // Gerar o token JWT para o funcionário atualizado
      const token = jwt.sign(
        { id_employee: updatedEmployee.id_employee, company_id },
        secretToken,
        { expiresIn: "7d" }
      );

      // Retorna o funcionário atualizado e o token
      return { employee: updatedEmployee, token };
    } else {
      // Caso não exista, cria um novo funcionário
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const insertQuery = `
        INSERT INTO employees (name, email, phone, password, company_id, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
      const insertValues = [
        name,
        email,
        phone,
        hashedPassword,
        company_id,
        is_admin,
      ];
      const insertResult = await pool.query(insertQuery, insertValues);
      const newEmployee = insertResult.rows[0];

      // Gerar o token JWT para o novo funcionário
      const token = jwt.sign(
        { id_employee: newEmployee.id_employee, company_id },
        secretToken,
        { expiresIn: "7d" }
      );

      // Retorna o novo funcionário e o token
      return { employee: newEmployee, token };
    }
  } catch (error) {
    console.error("Erro ao criar ou atualizar funcionário:", error);
    throw error;
  }
};

export default {
  createEmployee,
};
