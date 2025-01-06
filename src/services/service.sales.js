import salesRepository from "../repositories/repository.sales.js";

const createSaleService = async (saleData) => {
  // Validação de quantity
  if (Array.isArray(saleData)) {
    for (let sale of saleData) {
      if (!sale.quantity || sale.quantity <= 0) {
        throw new Error("Quantidade inválida.");
      }
    }
  } else {
    if (!saleData.quantity || saleData.quantity <= 0) {
      throw new Error("Quantidade inválida.");
    }
  }

  // Chama o repositório para salvar as vendas no banco
  return await salesRepository.createSale(saleData);
};

const getSalesByCompanyIdService = async (company_id) => {
  return await salesRepository.getSalesByCompanyId(company_id);
};

const getSaleByIdAndCompanyIdService = async (id, company_id) => {
  return await salesRepository.getSaleByIdAndCompanyId(id, company_id);
};

const updateSaleService = async (id, company_id, saleData) => {
  return await salesRepository.updateSaleById(id, company_id, saleData);
};

const deleteSaleService = async (id, company_id) => {
  return await salesRepository.deleteSaleById(id, company_id);
};

export default {
  createSaleService,
  getSalesByCompanyIdService,
  getSaleByIdAndCompanyIdService,
  updateSaleService,
  deleteSaleService,
};
