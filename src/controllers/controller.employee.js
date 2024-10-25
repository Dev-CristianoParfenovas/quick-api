import serviceEmployee from "../services/service.employee.js";

const createEmployee = async (req, res) => {
  const { name, email, phone, password, company_id } = req.body;
  try {
    // Chamando o serviço de funcionario para criar um funcionario
    const employee = await serviceEmployee.createEmployee(
      name,
      email,
      phone,
      password,
      company_id
    );
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { createEmployee };
