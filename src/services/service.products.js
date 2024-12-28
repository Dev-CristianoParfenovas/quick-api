import productRepository from "../repositories/repository.product.js";

const getProductsByClient = async (company_id) => {
  try {
    // Lógica de negócio e interação com o repositório
    const products = await productRepository.getProductsByClient(company_id);
    return products;
  } catch (err) {
    console.error("Erro no serviço de busca de produtos:", err);
    throw new Error("Erro ao buscar produtos");
  }
};

// Exemplo de como o serviço upsertProduct poderia ser estruturado
const upsertProduct = async (productData) => {
  const { id, name, category_id, price, company_id, stock } = productData;

  if (!name || !category_id || !price || !company_id || stock == null) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  try {
    const result = await productRepository.upsertProductAndStock(
      id, // Agora passamos o ID, que pode ser `undefined` se for um novo produto
      name,
      category_id,
      price,
      company_id,
      stock
    );

    return result;
  } catch (err) {
    console.error(
      "Erro no serviço de criação ou atualização de produto: ",
      err
    );
    throw err;
  }
};

/*const createProduct = async ({
  name,
  category_id,
  price,
  company_id,
  initialStock,
}) => {
  try {
    if (
      !name ||
      !category_id ||
      !price ||
      !company_id ||
      initialStock === undefined
    ) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
    }

    // Validação adicional (se necessário)
    if (price <= 0) {
      throw new Error("O preço do produto deve ser maior que zero.");
    }
    if (initialStock < 0) {
      throw new Error("O estoque inicial não pode ser negativo.");
    }

    // Chamando o repositório
    const { product, stock } = await productRepository.createProduct(
      name,
      category_id,
      price,
      company_id,
      initialStock
    );

    return { product, stock };
  } catch (error) {
    console.error(
      "Erro no serviço de criação de produto e estoque:",
      error.message
    );
    throw error; // Lança o erro para o controller tratar
  }
};*/

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
  try {
    const deletedProduct = await productRepository.deleteProductAndStock(
      product_id,
      company_id
    );

    if (!deletedProduct) {
      throw new Error("Produto não encontrado ou já excluído");
    }

    return deletedProduct;
  } catch (error) {
    console.error("Erro ao deletar produto no serviço:", error);
    throw new Error("Erro ao excluir produto");
  }
};

export default {
  getProductsByClient,
  upsertProduct,
  updateProductAndStockService,
  deleteProductService,
};
