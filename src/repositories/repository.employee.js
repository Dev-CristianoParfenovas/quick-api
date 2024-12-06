import pool from "../db/connection.js";
import jwt from "../jwt/token.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10;

const loginEmployeeRepository = async (email, password) => {
  const query = `SELECT * FROM employees WHERE email = $1`;
  const values = [email];

  const result = await pool.query(query, values);

  // Verificar se o cliente existe
  if (result.rows.length === 0) {
    throw new Error("Cliente não encontrado");
  }

  const employee = result.rows[0];

  // Testando a senha fornecida contra o hash no banco de dados
  console.log("Senha fornecida: " + password);
  console.log("Hash armazenado no banco de dados: " + employee.password);

  // Verificar a senha
  const isPasswordValid = await bcrypt.compare(password, employee.password); // Sem .trim()
  console.log(
    "Senha fornecida (em bytes):",
    Buffer.from(password).toString("hex")
  );
  console.log(
    "Senha Bco (em bytes):",
    Buffer.from(employee.password).toString("hex")
  );

  console.log("Senha válida: " + isPasswordValid); // Log adicional

  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }

  // Gerar o token JWT usando a função createJWT
  const token = jwt.createJWTEmployee(employee.id_employee);

  return {
    token,
    employee: {
      id_employee: employee.id_employee,
      name: employee.name,
      email: employee.email,
      is_admin: employee.is_admin,
    },
  };
};

const createEmployee = async (
  name,
  email,
  phone,
  password,
  company_id,
  is_admin
) => {
  try {
    const checkQuery = `SELECT * FROM employees WHERE email = $1;`;
    const checkValues = [email];
    const checkResult = await pool.query(checkQuery, checkValues);

    // Gerar o hash da senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Senha hasheada:", hashedPassword);

    if (checkResult.rows.length > 0) {
      // Atualizar funcionário existente
      const updateQuery = `
        UPDATE employees 
        SET name = $1, phone = $2, password = $3, is_admin = $4
        WHERE email = $5 
        RETURNING *;
      `;
      const updateValues = [name, phone, password, is_admin, email];
      const updateResult = await pool.query(updateQuery, updateValues);

      const updatedEmployee = updateResult.rows[0];
      const token = jwt.createJWTEmployee(updatedEmployee.id_employee);

      return { employee: updatedEmployee, token };
    } else {
      // Inserir novo funcionário
      const insertQuery = `
        INSERT INTO employees (name, email, phone, password, company_id, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const insertValues = [
        name,
        email,
        phone,
        password, //hashedPassword, // Senha hash gerada
        company_id,
        is_admin,
      ];
      const insertResult = await pool.query(insertQuery, insertValues);

      const newEmployee = insertResult.rows[0];
      const token = jwt.createJWTEmployee(newEmployee.id_employee);

      return { employee: newEmployee, token };
    }
  } catch (error) {
    console.error("Erro ao criar ou atualizar funcionário:", error);
    throw error;
  }
};

export default {
  createEmployee,
  loginEmployeeRepository,
};
