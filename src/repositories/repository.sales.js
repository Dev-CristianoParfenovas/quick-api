import pool from "../db/connection.js";

/*const createSale = async (saleData) => {
  // Verificando se saleData é um array (no caso de múltiplos itens)
  if (Array.isArray(saleData)) {
    const salePromises = saleData.map(async (sale) => {
      // Valida a quantidade de cada item
      if (!sale.quantity || isNaN(sale.quantity) || sale.quantity <= 0) {
        throw new Error("Quantidade inválida no repositório.");
      }

      const query = `
        INSERT INTO sales (company_id, product_id, id_client, employee_id, quantity, total_price, sale_date, tipovenda)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        sale.company_id,
        sale.product_id,
        sale.id_client,
        sale.employee_id,
        parseFloat(sale.quantity),
        parseFloat(sale.total_price),
        sale.sale_date || new Date(),
        sale.tipovenda || 0,
      ];

      console.log("Valores para a consulta:", values);

      const result = await pool.query(query, values);
      return result.rows[0];
    });

    return await Promise.all(salePromises); // Aguarda todas as promessas
  }

  // Caso seja uma única venda
  if (
    !saleData.quantity ||
    isNaN(saleData.quantity) ||
    saleData.quantity <= 0
  ) {
    throw new Error("Quantidade inválida no repositório.");
  }

  const query = `
    INSERT INTO sales (company_id, product_id, id_client, employee_id, quantity, total_price, sale_date, tipovenda)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    saleData.company_id,
    saleData.product_id,
    saleData.id_client,
    saleData.employee_id,
    parseFloat(saleData.quantity),
    parseFloat(saleData.total_price),
    saleData.sale_date || new Date(),
    saleData.tipovenda || 0,
  ];

  console.log("Valores para a consulta:", values);

  const result = await pool.query(query, values);
  return result.rows[0];
};*/

const createSale = async (saleData) => {
  if (Array.isArray(saleData)) {
    const salePromises = saleData.map(async (sale) => {
      if (!sale.quantity || isNaN(sale.quantity) || sale.quantity <= 0) {
        throw new Error("Quantidade inválida no repositório.");
      }

      // Busca o preço do produto
      const productQuery = `
        SELECT price FROM products WHERE id = $1 AND company_id = $2
      `;
      const productResult = await pool.query(productQuery, [
        sale.product_id,
        sale.company_id,
      ]);

      if (productResult.rows.length === 0) {
        throw new Error(`Produto com ID ${sale.product_id} não encontrado.`);
      }

      const productPrice = productResult.rows[0].price;
      const totalPrice = productPrice * sale.quantity;

      const query = `
        INSERT INTO sales (company_id, product_id, id_client, employee_id, quantity, total_price, sale_date, tipovenda)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        sale.company_id,
        sale.product_id,
        sale.id_client,
        sale.employee_id,
        parseFloat(sale.quantity),
        parseFloat(totalPrice), // Valor total multiplicado pela quantidade
        sale.sale_date || new Date(),
        sale.tipovenda || 0,
      ];

      console.log("Valores para a consulta:", values);

      const result = await pool.query(query, values);
      return result.rows[0];
    });

    return await Promise.all(salePromises); // Aguarda todas as promessas
  }

  // Caso seja uma única venda
  if (
    !saleData.quantity ||
    isNaN(saleData.quantity) ||
    saleData.quantity <= 0
  ) {
    throw new Error("Quantidade inválida no repositório.");
  }

  // Busca o preço do produto
  const productQuery = `
    SELECT price FROM products WHERE id = $1 AND company_id = $2
  `;
  const productResult = await pool.query(productQuery, [
    saleData.product_id,
    saleData.company_id,
  ]);

  if (productResult.rows.length === 0) {
    throw new Error(`Produto com ID ${saleData.product_id} não encontrado.`);
  }

  const productPrice = productResult.rows[0].price;
  const totalPrice = productPrice * saleData.quantity;

  const query = `
    INSERT INTO sales (company_id, product_id, id_client, employee_id, quantity, total_price, sale_date, tipovenda)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    saleData.company_id,
    saleData.product_id,
    saleData.id_client,
    saleData.employee_id,
    parseFloat(saleData.quantity),
    parseFloat(totalPrice), // Valor total multiplicado pela quantidade
    saleData.sale_date || new Date(),
    saleData.tipovenda || 0,
  ];

  console.log("Valores para a consulta:", values);

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getSalesByCompanyId = async (company_id, tipovenda) => {
  const query = `
    SELECT * FROM sales
    WHERE company_id = $1 AND tipovenda = $2;
  `;
  const result = await pool.query(query, [company_id, tipovenda]);
  return result.rows;
};

const getSaleByIdAndCompanyId = async (id, company_id) => {
  const query = `SELECT * FROM sales WHERE id = $1 AND company_id = $2`;
  const result = await pool.query(query, [id, company_id]);
  return result.rows[0];
};

const updateSaleById = async (id, company_id, saleData) => {
  const query = `
    UPDATE sales
    SET product_id = $1, quantity = $2, total_price = $3, tipovenda = $4
    WHERE id = $5 AND company_id = $6
    RETURNING *;
  `;
  const values = [
    saleData.product_id,
    saleData.quantity,
    saleData.total_price,
    saleData.tipovenda, // Atualizando o campo tipovenda
    id,
    company_id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteSaleById = async (id, company_id) => {
  const query = `DELETE FROM sales WHERE id = $1 AND company_id = $2 RETURNING *;`;
  const result = await pool.query(query, [id, company_id]);
  return result.rows[0];
};

export default {
  createSale,
  getSalesByCompanyId,
  getSaleByIdAndCompanyId,
  updateSaleById,
  deleteSaleById,
};
