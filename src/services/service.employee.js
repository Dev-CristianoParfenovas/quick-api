import employeeRepository from "../repositories/repository.employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente
dotenv.config();

const secretToken = process.env.JWT_SECRET; // Usa o segredo do JWT das variáveis de ambiente
const saltRounds = 10;

const createEmployee = async (
  name,
  email,
  phone,
  password,
  company_id,
  is_admin
) => {
  try {
    // 1. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Chama o repository para criar o funcionário com a senha criptografada
    const employee = await employeeRepository.createEmployee(
      name,
      email,
      phone,
      hashedPassword, // Passa a senha criptografada
      company_id,
      is_admin
    );

    // 3. Gerar o token JWT
    const token = jwt.sign(
      { id_employee: employee.id_employee, company_id },
      secretToken,
      { expiresIn: "7d" }
    );

    // 4. Retornar o funcionário criado e o token
    return { employee, token };
  } catch (err) {
    console.error("Erro ao criar funcionário:", err);
    throw new Error("Erro ao criar funcionário");
  }
};

export default { createEmployee };
