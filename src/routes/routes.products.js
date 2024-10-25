import { Router } from "express";
import productController from "../controllers/controller.product.js";

const routerproduct = Router();

routerproduct.get("/products/:company_id", productController.getProducts);
routerproduct.post("/products", productController.createProduct);

export default routerproduct;
