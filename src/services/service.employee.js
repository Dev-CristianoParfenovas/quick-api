import employeeRepository from "../repositories/repository.employee.js";
import bcrypt from "bcrypt";
import jwt from "../jwt/token.js";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente
dotenv.config();

const secretToken = process.env.JWT_SECRET; // Usa o segredo do JWT das variáveis de ambiente
const saltRounds = 10;

if (!secretToken) {
  throw new Error("SECRET_TOKEN não definido no arquivo .env");
}

const loginEmployeeService = async (email, password) => {
  try {
    // Chama a função do repositório para autenticar o cliente
    const result = await employeeRepository.loginEmployeeRepository(
      email,
      password
    );

    // Aqui você pode adicionar mais lógica, se necessário

    return result; // Retorna o token e os dados do cliente
  } catch (error) {
    throw new Error(error.message); // Repassa o erro para o controlador
  }
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

    if (!employee) {
      throw new Error("Falha ao criar funcionário");
    }

    // 3. Gerar o token JWT com o id_employee gerado
    //   const token = jwt.createJWTEmployee(employee.employee, secretToken, {
    //    expiresIn: "7d",
    //   });

    // 4. Retornar o funcionário criado e o token
    return employee;
  } catch (err) {
    console.error("Erro ao criar funcionário:", err);
    throw new Error("Erro ao criar funcionário");
  }
};

export default { createEmployee, loginEmployeeService };
