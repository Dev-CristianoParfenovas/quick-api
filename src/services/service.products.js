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

export const updateProductAndStockService = async (
  product_id,
  name,
  category_id,
  price,
  quantity,
  company_id
) => {
  try {
    const result = await productRepository.updateProductAndStock(
      product_id,
      name,
      category_id,
      price,
      quantity,
      company_id
    );

    if (!result) {
      return {
        status: 404,
        message: "Produto não encontrado ou não atualizado.",
      };
    }

    return { status: 200, data: result };
  } catch (error) {
    console.error(
      "Erro no serviço de atualização de produto e estoque:",
      error.message,
      error.stack
    );
    throw new Error("Erro ao atualizar produto e estoque.");
  }
};

const deleteProductService = async (product_id, company_id) => {
  const deletedProduct = await productRepository.deleteProduct(
    product_id,
    company_id
  );

  if (!deletedProduct) {
    throw new Error("Produto não encontrado ou já excluído");
  }

  return deletedProduct;
};

export default {
  getProductsByClient,
  createProduct,
  updateProductAndStockService,
  deleteProductService,
};
