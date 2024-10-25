import companyRepository from "../repositories/repository.company.js";

const createCompany = async (name) => {
  try {
    // Lógica de negócio para criar o produto
    const company = await companyRepository.createCompany(name);
    return company;
  } catch (err) {
    throw new Error("Erro ao criar empresa");
  }
};

export default { createCompany };
