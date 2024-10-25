import pool from "../db/connection.js";

const getProductsByClient = async (company_id) => {
  const query = "SELECT * FROM products WHERE company_id = $1";
  const values = [company_id];

  try {
    const result = await pool.query(query, values);

    // Verifica se há produtos
    if (result.rows.length === 0) {
      return null; // Retorna null se não houver produtos
    }

    return result.rows; // Retorna o array de produtos
  } catch (error) {
    console.error("Erro ao buscar produtos: ", error);
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

// Atualiza o estoque de um produto
const updateStock = async (product_id, quantity, company_id) => {
  const querySelect = `
        SELECT * FROM stock WHERE product_id = $1 AND company_id = $2
    `;
  const valuesSelect = [product_id, company_id];

  try {
    // Verifica se o produto já tem estoque na tabela 'stok'
    const result = await pool.query(querySelect, valuesSelect);

    if (result.rows.length > 0) {
      // Se o estoque já existir, atualize a quantidade
      const queryUpdate = `
            UPDATE stock
            SET quantity = quantity + $1
            WHERE product_id = $2 AND company_id = $3
            RETURNING *
        `;
      const valuesUpdate = [quantity, product_id, company_id];
      const updatedResult = await pool.query(queryUpdate, valuesUpdate);
      return updatedResult.rows[0];
    } else {
      // Se o estoque não existir, insere um novo registro
      const queryInsert = `
            INSERT INTO stock (product_id, quantity, company_id)
            VALUES ($1, $2, $3) RETURNING *
        `;
      const valuesInsert = [product_id, quantity, company_id];
      const insertedResult = await pool.query(queryInsert, valuesInsert);
      return insertedResult.rows[0];
    }
  } catch (error) {
    console.error("Erro ao atualizar o estoque: ", error);
    throw new Error("Erro ao atualizar o estoque");
  }
};

export default {
  getProductsByClient,
  createProduct,
  updateStock,
};
