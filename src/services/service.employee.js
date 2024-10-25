import employeeRepository from "../repositories/repository.employee.js";

const createEmployee = async (name, email, phone, password, company_id) => {
  try {
    // Lógica de negócio para criar o produto
    const employee = await employeeRepository.createEmployee(
      name,
      email,
      phone,
      password,
      company_id
    );
    return employee;
  } catch (err) {
    throw new Error("Erro ao criar produto");
  }
};
export default { createEmployee };
