import { Router } from "express";
import productController from "../controllers/controller.product.js";
import jwt from "../jwt/token.js";

const routerproduct = Router();

// Rota para obter todos os produtos de um cliente
routerproduct.get(
  "/products/:company_id",
  jwt.validateJWT,
  productController.getProducts
);

// Rota para criar um novo produto
routerproduct.post(
  "/products",
  jwt.validateJWT,
  productController.createOrUpdateProduct
);

// Rota para atualizar um produto e seu estoque
routerproduct.put(
  "/products/:product_id",
  jwt.validateJWT,
  productController.updateProductAndStockController
);

// Rota para excluir um produto e seu estoque
routerproduct.delete(
  "/products",
  jwt.validateJWT,
  productController.deleteProductController
);

export default routerproduct;
