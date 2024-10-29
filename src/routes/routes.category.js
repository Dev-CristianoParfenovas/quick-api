import { Router } from "express";
import categoryController from "../controllers/controller.category.js";

const routercategory = Router();

routercategory.post("/categories", categoryController.createCategoryController); // Criar uma nova categoria

// Rota para buscar categoria por ID e company_id
routercategory.get(
  "/categories/:id/:company_id",
  categoryController.getCategoryByIdAndCompanyIdController
);

// Rota para listar todas as categorias de uma empresa
routercategory.get(
  "/categories/:company_id",
  categoryController.getCategoriesByCompanyIdController
);

// Atualizar categoria
routercategory.put(
  "/categories/:category_id",
  categoryController.updateCategoryController
);

routercategory.delete(
  "/categories/:category_id",
  categoryController.deleteCategoryController
); // Deletar categoria

export default routercategory;
