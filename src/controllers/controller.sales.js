import salesService from "../services/service.sales.js";

const createSaleController = async (req, res) => {
  // Garantindo que o corpo da requisição seja tratado como array
  const body = Array.isArray(req.body) ? req.body : [req.body];

  try {
    // Validação das quantidades de todos os itens, caso seja um array
    body.forEach((sale) => {
      const parsedQuantity = Number(sale.quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error("Quantidade inválida.");
      }
      sale.quantity = parsedQuantity; // Garantindo que a quantidade seja um número
    });

    // Chamando o serviço para criar as vendas
    const newSales = await salesService.createSaleService(body);

    res.status(201).json({
      message: "Venda(s) criada(s) com sucesso!",
      sales: newSales,
    });
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    res.status(500).json({
      message: "Erro ao criar venda",
      error: error.message,
    });
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

/* const getSalesByDateRangeController = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, employeeId } = req.query;

    console.log("Parâmetros recebidos:", {
      company_id,
      startDate,
      endDate,
      employeeId,
    });

    const sales = await salesService.getSalesByDateRangeService(
      company_id,
      startDate,
      endDate,
      employeeId
    );

    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro no Controller ao obter vendas:", error);
    res.status(500).json({ error: "Erro ao obter vendas" });
  }
};*/

/*const getSalesByDateRangeController = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query; // Certifique-se de que o employeeId seja extraído corretamente
    const company_id = req.params.company_id;

    console.log("Filtros aplicados:", { startDate, endDate, employeeId });

    // Adicione este log para verificar os parâmetros recebidos
    console.log("Controller - Parâmetros Recebidos:", {
      company_id,
      startDate,
      endDate,
      employeeId,
    });

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Datas inicial e final são obrigatórias." });
    }

    const sales = await salesService.getSalesByDateRangeService(
      company_id,
      startDate,
      endDate,
      employeeId // Passando employeeId, mesmo que seja undefined
    );

    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro ao buscar vendas por intervalo de datas:", error);
    res.status(500).json({
      message: "Erro ao buscar vendas por intervalo de datas",
      error: error.message,
    });
  }
};*/

/*const getSalesByDateRangeController = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, employeeId } = req.query;

    console.log("Parâmetros recebidos no controller:", {
      company_id,
      startDate,
      endDate,
      employeeId,
    });

    const sales = await salesService.getSalesByDateRangeService(
      company_id,
      startDate,
      endDate,
      employeeId
    );

    console.log("Vendas retornadas do serviço:", sales); // Verifique as vendas retornadas da API

    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro no Controller ao obter vendas:", error);
    res.status(500).json({ error: "Erro ao obter vendas" });
  }
};*/

/*const getSalesByDateRangeController = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, employeeId } = req.query;

    console.log("Parâmetros recebidos no controller:", {
      company_id,
      startDate,
      endDate,
      employeeId,
    });

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Datas de início e fim são obrigatórias." });
    }

    const sales = await salesService.getSalesByDateRangeService(
      company_id,
      startDate,
      endDate,
      employeeId
    );

    console.log("Vendas retornadas do serviço:", sales);

    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro no Controller ao obter vendas:", error);
    res.status(500).json({ error: "Erro ao obter vendas" });
  }
};*/

const getSalesByDateRangeController = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, employeeId, clientId } = req.query;

    console.log("Parâmetros recebidos no controller:", {
      company_id,
      startDate,
      endDate,
      employeeId,
      clientId,
    });

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Datas de início e fim são obrigatórias." });
    }

    const sales = await salesService.getSalesByDateRangeService(
      company_id,
      startDate,
      endDate,
      employeeId,
      clientId
    );

    console.log("Vendas retornadas do serviço:", sales);

    res.status(200).json(sales);
  } catch (error) {
    console.error("Erro no Controller ao obter vendas:", error);
    res.status(500).json({ error: "Erro ao obter vendas" });
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
  getSalesByDateRangeController,
  updateSaleController,
  deleteSaleController,
};
