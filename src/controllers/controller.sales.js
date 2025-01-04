import salesService from "../services/service.sales.js";

const createSaleController = async (req, res) => {
  const { company_id } = req.params; // company_id vem dos parâmetros da rota
  const {
    product_id,
    id_client,
    employee_id,
    quantity,
    total_price,
    sale_date,
    tipovenda,
  } = req.body;

  console.log("Dados recebidos no backend:", req.body);

  try {
    const parsedQuantity = Number(quantity);
    console.log("Quantidade após conversão:", parsedQuantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Quantidade inválida." });
    }

    const saleData = {
      company_id, // Inclui o company_id vindo dos parâmetros
      product_id,
      id_client,
      employee_id,
      quantity: parsedQuantity,
      total_price,
      sale_date: sale_date || new Date(), // Define a data atual como padrão
      tipovenda: tipovenda || 0, // Define 0 como padrão se não fornecido
    };

    console.log("Dados validados para salvar:", saleData);

    const newSale = await salesService.createSaleService(saleData);

    res
      .status(201)
      .json({ message: "Venda criada com sucesso!", sale: newSale });
  } catch (error) {
    console.error("Erro ao criar a venda:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar a venda", error: error.message });
  }
};

const getSalesByCompanyIdController = async (req, res) => {
  try {
    const company_id = parseInt(req.params.company_id);
    const sales = await salesService.getSalesByCompanyIdService(company_id);
    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro ao obter vendas:", error);
    res.status(500).json({ message: "Erro ao obter vendas" });
  }
};

const getSaleByIdAndCompanyIdController = async (req, res) => {
  try {
    const { id, company_id } = req.params;
    const sale = await salesService.getSaleByIdAndCompanyIdService(
      id,
      company_id
    );
    if (!sale) return res.status(404).json({ message: "Venda não encontrada" });
    res.status(200).json(sale);
  } catch (error) {
    console.error("Erro ao obter venda:", error);
    res.status(500).json({ message: "Erro ao obter venda" });
  }
};

const updateSaleController = async (req, res) => {
  try {
    const { id, company_id } = req.params;
    const saleData = req.body;
    const updatedSale = await salesService.updateSaleService(
      id,
      company_id,
      saleData
    );
    if (!updatedSale)
      return res.status(404).json({ message: "Venda não encontrada" });
    res.status(200).json(updatedSale);
  } catch (error) {
    console.error("Erro ao atualizar venda:", error);
    res.status(500).json({ message: "Erro ao atualizar venda" });
  }
};

const deleteSaleController = async (req, res) => {
  try {
    const { id, company_id } = req.params;
    const deletedSale = await salesService.deleteSaleService(id, company_id);
    if (!deletedSale)
      return res.status(404).json({ message: "Venda não encontrada" });
    res.status(200).json(deletedSale);
  } catch (error) {
    console.error("Erro ao deletar venda:", error);
    res.status(500).json({ message: "Erro ao deletar venda" });
  }
};

export default {
  createSaleController,
  getSalesByCompanyIdController,
  getSaleByIdAndCompanyIdController,
  updateSaleController,
  deleteSaleController,
};
