import { Router } from "express";
import productController from "../controllers/controller.product.js";
import jwt from "../jwt/token.js";

const routerproduct = Router();

routerproduct.get(
  "/products/:company_id",
  jwt.validateJWT,
  productController.getProducts
);
routerproduct.post(
  "/products",
  jwt.validateJWT,
  productController.createProduct
);
routerproduct.put(
  "/products/update/:product_id",
  jwt.validateJWT,
  productController.updateProductAndStockController
);

routerproduct.delete(
  "/products/:company_id",
  jwt.validateJWT,
  productController.deleteProductController
);

export default routerproduct;
