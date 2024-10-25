import clientRepository from "../repositories/repository.client.js";

const createClient = async (name, email, phone, password, company_id) => {
  try {
    // Lógica de negócio para criar o produto
    const client = await clientRepository.createClient(
      name,
      email,
      phone,
      password,
      company_id
    );
    return client;
  } catch (err) {
    throw new Error("Erro ao criar produto");
  }
};
export default { createClient };
