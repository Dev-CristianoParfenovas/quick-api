import salesRepository from "../repositories/repository.sales.js";

const createSaleService = async (saleData) => {
  // Validação de quantity
  if (!saleData.quantity || saleData.quantity <= 0) {
    throw new Error("Quantidade inválida.");
  }

  // Definindo um valor padrão de tipovenda (0) caso não seja fornecido
  saleData.tipovenda = saleData.tipovenda || 0;

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
