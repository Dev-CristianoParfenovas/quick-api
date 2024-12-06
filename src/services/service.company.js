import repositoryCompany from "../repositories/repository.company.js";
import bcrypt from "bcrypt";

const createCompanyAndEmployee = async (name, email, password, is_admin) => {
  console.log("Dados recebidos no serviço:", {
    name,
    email,
    password,
    is_admin,
  });

  try {
    // Hashear a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Chama o método do repositório para criar a empresa e o funcionário
    const result = await repositoryCompany.createCompanyAndEmployee(
      name,
      email,
      hashedPassword,
      is_admin
    );

    return result;
  } catch (error) {
    throw new Error("Erro ao criar empresa e funcionário: " + error.message);
  }
};
export default {
  createCompanyAndEmployee,
};

//import companyRepository from "../repositories/repository.company.js";

/*const createCompany = async (name) => {
  try {
    // Lógica de negócio para criar o produto
    const company = await companyRepository.createCompany(name);
    return company;
  } catch (err) {
    throw new Error("Erro ao criar empresa");
  }
};*/
