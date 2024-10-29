import categoryRepository from "../repositories/repository.category.js";

const createCategoryService = async (name, company_id) => {
  return await categoryRepository.createCategory(name, company_id);
};

const getCategoryByIdAndCompanyIdService = async (id, company_id) => {
  const category = await categoryRepository.getCategoryByIdAndCompanyId(
    id,
    company_id
  );
  return category;
};

const getCategoriesByCompanyIdService = async (company_id) => {
  console.log("company_id recebido no serviço:", company_id); // Confirmação do ID no serviço
  return await categoryRepository.getCategoriesByCompanyId(company_id);
};

export const updateCategoryService = async (category_id, name, company_id) => {
  return await categoryRepository.updateCategory(category_id, name, company_id);
};

export const deleteCategoryService = async (category_id, company_id) => {
  return await categoryRepository.deleteCategory(category_id, company_id);
};

export default {
  createCategoryService,
  getCategoriesByCompanyIdService,
  getCategoryByIdAndCompanyIdService,
  updateCategoryService,
  deleteCategoryService,
};
