import pool from "../db/connection.js";

//TRAS O PRODUTO(SELECT)
const getProductsByClient = async (company_id) => {
  const query = `SELECT p.*, COALESCE(s.quantity, 0) AS quantity
    FROM products p
    LEFT JOIN stock s ON p.id = s.product_id
    WHERE p.company_id = $1`;
  const values = [company_id];

  try {
    const result = await pool.query(query, values);

    return result.rows.length ? result.rows : null;

    // Verifica se há produtos
    // if (result.rows.length === 0) {
    //   return null; // Retorna null se não houver produtos
    // }

    //return result.rows; // Retorna o array de produtos
  } catch (error) {
    console.error("Erro ao buscar produtos: ", error);
    throw new Error("Erro ao buscar produtos");
  }
};

//INSERE PRODUTO E ESTOQUE
const createProduct = async (
  name,
  category_id,
  price,
  company_id,
  initialStock = 0
) => {
  const client = await pool.connect(); // Conectar ao pool para iniciar a transação

  try {
    // Iniciar transação
    await client.query("BEGIN");

    // Inserir produto
    const queryProduct = `
      INSERT INTO products (name, category_id, price, company_id)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const valuesProduct = [name, category_id, price, company_id];
    const productResult = await client.query(queryProduct, valuesProduct);
    const product = productResult.rows[0]; // Produto recém-criado

    // Inserir estoque associado ao produto
    const queryStock = `
      INSERT INTO stock (product_id, quantity, company_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const valuesStock = [product.id, initialStock, company_id];
    const stockResult = await client.query(queryStock, valuesStock);
    const stock = stockResult.rows[0]; // Estoque recém-criado

    // Confirmar transação
    await client.query("COMMIT");

    // Retornar produto e estoque
    return { product, stock };
  } catch (err) {
    // Se algo der errado, reverter a transação
    await client.query("ROLLBACK");
    console.error("Erro ao criar produto e estoque: ", err);
    throw new Error("Erro ao criar produto e estoque");
  } finally {
    // Liberar o cliente
    client.release();
  }
};

//ALTERA PRODUTO E ESTOQUE
const updateProductAndStock = async (
  product_id,
  name,
  category_id,
  price,
  quantity,
  company_id
) => {
  const client = await pool.connect(); // Conectar ao pool para iniciar a transação

  try {
    // Iniciar uma transação para garantir a integridade dos dados
    await client.query("BEGIN");

    // Atualizar os detalhes do produto
    const queryProduct = `
      UPDATE products
      SET name = $1, category_id = $2, price = $3
      WHERE id = $4 AND company_id = $5
      RETURNING *
    `;
    const valuesProduct = [name, category_id, price, product_id, company_id];
    const productResult = await client.query(queryProduct, valuesProduct);

    // Verificar se o produto foi encontrado e atualizado
    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      console.error("Produto não encontrado para atualização");
      return null; // Retorna null se o produto não existir para essa empresa
    }

    // Inserir ou atualizar o estoque
    const queryStock = `
      INSERT INTO stock (product_id, quantity, company_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (product_id, company_id)
      DO UPDATE SET quantity = $2
      RETURNING *
    `;
    const valuesStock = [product_id, quantity, company_id];
    const stockResult = await client.query(queryStock, valuesStock);

    // Confirmar a transação se ambas as operações foram bem-sucedidas
    await client.query("COMMIT");

    // Retornar o produto atualizado e o estoque
    return { product: productResult.rows[0], stock: stockResult.rows[0] };
  } catch (error) {
    // Reverter a transação em caso de erro
    await client.query("ROLLBACK");
    console.error(
      "Erro ao atualizar produto e estoque: ",
      error.message,
      error.stack
    );
    throw new Error("Erro ao atualizar produto e estoque");
  } finally {
    // Liberar o cliente
    client.release();
  }
};

//DELETA PRODUTO
const deleteProduct = async (product_id, company_id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Primeiro, excluir o estoque associado ao produto
    const deleteStockQuery = `
      DELETE FROM stock
      WHERE product_id = $1 AND company_id = $2
    `;
    await client.query(deleteStockQuery, [product_id, company_id]);

    // Em seguida, excluir o produto
    const deleteProductQuery = `
      DELETE FROM products
      WHERE id = $1 AND company_id = $2
      RETURNING *
    `;
    const result = await client.query(deleteProductQuery, [
      product_id,
      company_id,
    ]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return null; // Produto não encontrado
    }

    await client.query("COMMIT");
    return result.rows[0]; // Produto excluído com sucesso
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao deletar produto e estoque:", error);
    throw new Error("Erro ao deletar produto e estoque");
  } finally {
    client.release();
  }
};

export default {
  getProductsByClient,
  createProduct,
  updateProductAndStock, // substitui updateStock pela função combinada
  deleteProduct,
};
