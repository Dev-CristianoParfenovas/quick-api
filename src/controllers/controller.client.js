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

// Função para lidar com a criação ou atualização de um cliente
const createOrUpdateClient = async (req, res) => {
  const { name, email, phone, password, company_id } = req.body;

  try {
    const client = await serviceClient.createClient(
      name,
      email,
      phone,
      password,
      company_id
    );

    return res.status(201).json({
      message: "Cliente criado ou atualizado com sucesso.",
      client,
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      message: "Erro ao criar ou atualizar o cliente.",
      error: error.message,
    });
  }
};

export default { createOrUpdateClient, login };
