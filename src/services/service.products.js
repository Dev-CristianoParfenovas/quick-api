import productRepository from "../repositories/repository.product.js";

const getProductsByClient = async (company_id) => {
  try {
    // Lógica de negócio e interação com o repositório
    const products = await productRepository.getProductsByClient(company_id);
    return products;
  } catch (err) {
    throw new Error("Erro ao buscar produtos");
  }
};

const createProduct = async (
  name,
  category_id,
  price,
  company_id,
  initialStock = 0
) => {
  try {
    // Lógica de negócio para criar o produto e o estoque
    const { product, stock } = await productRepository.createProduct(
      name,
      category_id,
      price,
      company_id,
      initialStock
    );
    return { product, stock };
  } catch (err) {
    throw new Error("Erro ao criar produto e estoque");
  }
};

// Atualização de estoque
const updateStock = async (product_id, quantity, company_id) => {
  try {
    // Lógica de negócio para atualizar o estoque
    const updatedStock = await productRepository.updateStock(
      product_id,
      quantity,
      company_id
    );
    return updatedStock;
  } catch (err) {
    throw new Error("Erro ao atualizar o estoque");
  }
};

export default { getProductsByClient, createProduct, updateStock };
