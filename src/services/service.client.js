import clientRepository from "../repositories/repository.client.js";

const loginClient = async (email, password) => {
  try {
    // Chama a função do repositório para autenticar o cliente
    const result = await clientRepository.loginClient(email, password);

    // Aqui você pode adicionar mais lógica, se necessário

    return result; // Retorna o token e os dados do cliente
  } catch (error) {
    throw new Error(error.message); // Repassa o erro para o controlador
  }
};

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
export default { createClient, loginClient };
