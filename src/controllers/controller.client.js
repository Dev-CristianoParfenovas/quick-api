import serviceClient from "../services/service.client.js";

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

export default { createClient };
