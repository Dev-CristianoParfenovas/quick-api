import { Router } from "express";
import categoryController from "../controllers/controller.category.js";
import jwt from "../jwt/token.js";

const routercategory = Router();

routercategory.post("/categories", categoryController.createCategoryController); // Criar uma nova categoria

// Rota para buscar categoria por ID e company_id
routercategory.get(
  "/categories/:id/:company_id",
  jwt.validateJWT,
  categoryController.getCategoryByIdAndCompanyIdController
);

// Rota para listar todas as categorias de uma empresa
routercategory.get(
  "/categories/:company_id",
  jwt.validateJWT,
  categoryController.getCategoriesByCompanyIdController
);

// Atualizar categoria
routercategory.put(
  "/categories/:category_id",
  jwt.validateJWT,
  categoryController.updateCategoryController
);

routercategory.delete(
  "/categories/:category_id",
  jwt.validateJWT,
  categoryController.deleteCategoryController
); // Deletar categoria

export default routercategory;
