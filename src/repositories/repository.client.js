import pool from "../db/connection.js";
import jwt from "../jwt/token.js";
import bcrypt from "bcrypt";

const loginClient = async (email, password) => {
  const query = `SELECT * FROM clients WHERE email = $1`;
  const values = [email];

  const result = await pool.query(query, values);

  // Verificar se o cliente existe
  if (result.rows.length === 0) {
    throw new Error("Cliente não encontrado");
  }

  const client = result.rows[0];

  // Verificar a senha
  const isPasswordValid = await bcrypt.compare(password, client.password);
  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }

  // Gerar o token JWT usando a função createJWT
  const token = jwt.createJWT(client.id_user);

  return {
    token,
    client: { id_user: client.id_user, name: client.name, email: client.email },
  };
};

// Função para criar ou atualizar cliente
const createClient = async (name, email, phone, password, company_id) => {
  // Hash da senha antes de armazená-la no banco de dados
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
INSERT INTO clients (name, email, phone, password, company_id)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  password = EXCLUDED.password,
  company_id = EXCLUDED.company_id,
  updated_at = CURRENT_TIMESTAMP
RETURNING *;
  `;

  const values = [name, email, phone, hashedPassword, company_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  createClient,
  loginClient,
};
