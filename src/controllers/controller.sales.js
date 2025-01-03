import salesService from "../services/service.sales.js";

const createSaleController = async (req, res) => {
  const { company_id } = req.params;
  const {
    product_id,
    id_client,
    employee_id,
    quantity,
    total_price,
    sale_date,
    tipovenda,
  } = req.body;

  try {
    // Preparando os dados para envio
    const saleData = {
      company_id,
      product_id,
      id_client,
      employee_id,
      quantity,
      total_price,
      sale_date,
      tipovenda,
    };

    // Chamando o serviço para criar a venda
    const newSale = await salesService(saleData);

    // Retorne a resposta de sucesso
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
