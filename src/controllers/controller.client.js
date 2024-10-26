import serviceClient from "../services/service.client.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await serviceClient.loginClient(email, password);
    res.status(200).json(result); // Retorna o token e os dados do cliente
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const createClient = async (req, res) => {
  const { name, email, phone, password, company_id } = req.body;
  try {
    // Chamando o serviço de produto para criar um produto
    const client = await serviceClient.createClient(
      name,
      email,
      phone,
      password,
      company_id
    );
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { createClient, login };
