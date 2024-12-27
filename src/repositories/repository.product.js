import pool from "../db/connection.js";

// Função para obter os produtos de uma empresa
const getProductsByClient = async (company_id) => {
  const query = `
    SELECT p.*, COALESCE(s.quantity, 0) AS quantity
    FROM products p
    LEFT JOIN stock s ON p.id = s.product_id
    WHERE p.company_id = $1
  `;
  const values = [company_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length ? result.rows : null;
  } catch (error) {
    console.error("Erro ao buscar produtos: ", error);
    throw new Error("Erro ao buscar produtos");
  }
};

// Função para verificar duplicidade
const findProductByNameAndCompany = async (name, company_id) => {
  const query = `
    SELECT * FROM products 
    WHERE name = $1 AND company_id = $2
  `;
  const values = [name, company_id];
  const result = await pool.query(query, values);
  console.log("Resultado da consulta de duplicidade:", result.rows); // Log adicional
  return result.rows[0]; // Retorna o produto encontrado ou undefined
};

const upsertProductAndStock = async (
  name,
  category_id,
  price,
  company_id,
  stockQuantity
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verifica se o produto já existe
    const findProductQuery = `
      SELECT * FROM products
      WHERE name = $1 AND company_id = $2
    `;
    const productResult = await client.query(findProductQuery, [
      name,
      company_id,
    ]);
    const existingProduct = productResult.rows[0];

    if (existingProduct) {
      // Atualizar produto existente
      const updateProductQuery = `
        UPDATE products
        SET category_id = $1, price = $2
        WHERE id = $3
        RETURNING *
      `;
      const updatedProduct = await client.query(updateProductQuery, [
        category_id,
        price,
        existingProduct.id,
      ]);

      // Atualizar estoque existente
      const updateStockQuery = `
        UPDATE stock
        SET quantity = $1
        WHERE product_id = $2 AND company_id = $3
        RETURNING *
      `;
      const updatedStock = await client.query(updateStockQuery, [
        stockQuantity,
        existingProduct.id,
        company_id,
      ]);

      await client.query("COMMIT");
      return { product: updatedProduct.rows[0], stock: updatedStock.rows[0] };
    }

    // Criar novo produto
    const insertProductQuery = `
      INSERT INTO products (name, category_id, price, company_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const newProduct = await client.query(insertProductQuery, [
      name,
      category_id,
      price,
      company_id,
    ]);

    // Criar estoque para o novo produto
    const insertStockQuery = `
      INSERT INTO stock (product_id, quantity, company_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const newStock = await client.query(insertStockQuery, [
      newProduct.rows[0].id,
      stockQuantity,
      company_id,
    ]);

    await client.query("COMMIT");
    return { product: newProduct.rows[0], stock: newStock.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar ou atualizar produto e estoque: ", err);
    throw new Error("Erro ao criar ou atualizar produto e estoque.");
  } finally {
    client.release();
  }
};

/*
const createProduct = async (
  name,
  category_id,
  price,
  company_id,
  initialStock = 0
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar duplicidade antes de criar o produto
    const existingProduct = await findProductByNameAndCompany(name, company_id);
    if (existingProduct) {
      console.log("Produto duplicado encontrado:", existingProduct); // Log de duplicidade
      throw new Error("Já existe um produto com este nome para esta empresa.");
    }

    // Inserir produto
    const queryProduct = `
      INSERT INTO products (name, category_id, price, company_id)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const valuesProduct = [name, category_id, price, company_id];
    const productResult = await client.query(queryProduct, valuesProduct);
    const product = productResult.rows[0];

    // Inserir estoque
    const queryStock = `
      INSERT INTO stock (product_id, quantity, company_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const valuesStock = [product.id, initialStock, company_id];
    const stockResult = await client.query(queryStock, valuesStock);

    await client.query("COMMIT");
    return { product, stock: stockResult.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar produto e estoque: ", err);
    if (
      err.message === "Já existe um produto com este nome para esta empresa."
    ) {
      throw { status: 409, message: err.message }; // Retorna status 409 para duplicidade
    }
    throw new Error(err.message || "Erro ao criar produto e estoque");
  } finally {
    client.release();
  }
};*/

// Função para atualizar produto e estoque
const updateProductAndStock = async (
  product_id,
  name,
  category_id,
  price,
  quantity,
  company_id
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Atualizar produto
    const queryProduct = `
      UPDATE products
      SET name = $1, category_id = $2, price = $3
      WHERE id = $4 AND company_id = $5
      RETURNING *
    `;
    const valuesProduct = [name, category_id, price, product_id, company_id];
    const productResult = await client.query(queryProduct, valuesProduct);
    const product = productResult.rows[0];

    // Atualizar estoque
    const queryStock = `
      UPDATE stock
      SET quantity = $1
      WHERE product_id = $2 AND company_id = $3
      RETURNING *
    `;
    const valuesStock = [quantity, product_id, company_id];
    const stockResult = await client.query(queryStock, valuesStock);

    await client.query("COMMIT");
    return { product, stock };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar produto e estoque: ", err);
    throw new Error("Erro ao atualizar produto e estoque");
  } finally {
    client.release();
  }
};

// Função para excluir produto e seu estoque
const deleteProductAndStock = async (product_id, company_id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Excluir estoque
    const queryStock = `
      DELETE FROM stock
      WHERE product_id = $1 AND company_id = $2
      RETURNING *
    `;
    const valuesStock = [product_id, company_id];
    await client.query(queryStock, valuesStock);

    // Excluir produto
    const queryProduct = `
      DELETE FROM products
      WHERE id = $1 AND company_id = $2
      RETURNING *
    `;
    const valuesProduct = [product_id, company_id];
    const productResult = await client.query(queryProduct, valuesProduct);

    await client.query("COMMIT");
    return productResult.rows[0]; // Retorna o produto excluído
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao excluir produto e estoque: ", err);
    throw new Error("Erro ao excluir produto e estoque");
  } finally {
    client.release();
  }
};

export default {
  getProductsByClient,
  upsertProductAndStock,
  updateProductAndStock,
  deleteProductAndStock,
  findProductByNameAndCompany,
};
