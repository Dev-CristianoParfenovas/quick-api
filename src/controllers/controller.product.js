import serviceProducts from "../services/service.products.js";
import { updateProductAndStockService } from "../services/service.products.js";

// Obter todos os produtos de um cliente
const getProducts = async (req, res) => {
  const { company_id } = req.params;

  console.log("Company ID recebido: ", company_id);

  try {
    const products = await serviceProducts.getProductsByClient(company_id);

    // Se não houver produtos, retornar uma resposta apropriada
    if (!products) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado para este company_id" });
    }

    res.status(200).json(products); // Retorna a lista de produtos
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar um produto
const createProduct = async (req, res) => {
  const { name, category_id, price, company_id, initialStock } = req.body;

  try {
    // Chama o serviço para criar o produto e o estoque
    const { product, stock } = await serviceProducts.createProduct(
      name,
      category_id,
      price,
      company_id,
      initialStock
    );

    // Retorna o produto e o estoque criado como resposta
    res.status(201).json({ product, stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProductAndStockController = async (req, res) => {
  const { product_id } = req.params;
  const { name, category_id, price, quantity, company_id } = req.body;

  try {
    console.log("Dados recebidos no controlador:", {
      product_id,
      name,
      category_id,
      price,
      quantity,
      company_id,
    });

    // Checar se os dados estão completos
    if (
      !product_id ||
      !name ||
      !category_id ||
      !price ||
      !quantity ||
      !company_id
    ) {
      console.error("Dados incompletos para atualizar produto e estoque.");
      return res.status(400).json({
        message: "Dados incompletos para atualizar produto e estoque.",
      });
    }

    // Chamando o serviço e esperando o resultado
    const result = await updateProductAndStockService(
      product_id,
      name,
      category_id,
      price,
      quantity,
      company_id
    );

    if (result.status === 404) {
      console.error("Produto não encontrado ou não atualizado.");
      return res.status(404).json({ message: result.message });
    }

    console.log("Resultado do serviço:", result);
    return res.status(200).json({
      message: "Produto e estoque atualizados com sucesso.",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "Erro no controlador de atualização de produto e estoque:",
      error.message,
      error.stack
    );
    return res
      .status(500)
      .json({ message: "Erro ao atualizar produto e estoque." });
  }
};

const deleteProductController = async (req, res) => {
  const { company_id } = req.params;
  const { product_id } = req.body;

  try {
    const deletedProduct = await serviceProducts.deleteProductService(
      product_id,
      company_id
    );

    return res.status(200).json({
      message: "Produto excluído com sucesso",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Erro no controlador ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
};

export default {
  getProducts,
  createProduct,
  updateProductAndStockController,
  deleteProductController,
};
