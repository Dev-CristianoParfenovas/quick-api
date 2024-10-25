import serviceProducts from "../services/service.products.js";

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

const updateStock = async (req, res) => {
  const { product_id, quantity, company_id } = req.body;

  console.log("Dados recebidos para atualização de estoque:", {
    product_id,
    quantity,
    company_id,
  });

  try {
    const stock = await serviceProducts.updateStock(
      product_id,
      quantity,
      company_id
    );
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getProducts,
  createProduct,
  updateStock,
};
