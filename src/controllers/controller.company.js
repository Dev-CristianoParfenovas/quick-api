const createCompany = async (req, res) => {
  const { name } = req.body;
  try {
    // Chamando o serviço de company para criar uma empresa/cliente
    const company = await serviceCompany.createCompany(name);
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  createCompany,
};
