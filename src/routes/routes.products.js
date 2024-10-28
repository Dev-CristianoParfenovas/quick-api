import { Router } from "express";
import productController from "../controllers/controller.product.js";

const routerproduct = Router();

routerproduct.get("/products/:company_id", productController.getProducts);
routerproduct.post("/products", productController.createProduct);
routerproduct.put(
  "/products/update/:product_id",
  productController.updateProductAndStockController
);

export default routerproduct;
