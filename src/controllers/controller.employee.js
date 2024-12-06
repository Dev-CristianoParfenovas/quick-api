import EmployeeService from "../services/service.employee.js";

const loginEmployeeController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await EmployeeService.loginEmployeeService(email, password);
    res.status(200).json(result); // Retorna o token e os dados do cliente
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  const { name, email, phone, password, company_id, is_admin } = req.body;

  try {
    // Chama o serviço para criar o funcionário com criptografia e geração do token JWT
    const employee = await EmployeeService.createEmployee(
      name,
      email,
      phone,
      password,
      company_id,
      is_admin
    );

    // Retorna o novo funcionário e o token gerado ao cliente
    res.status(201).json({
      message: "Funcionário criado com sucesso.",
      employee,
    });
  } catch (error) {
    console.error("Erro no controller ao criar funcionário:", error);

    // Retorna uma resposta de erro caso ocorra uma exceção
    res.status(500).json({
      message: "Erro ao criar funcionário.",
      error: error.message,
    });
  }
};

export default {
  createEmployee,
  loginEmployeeController,
};
