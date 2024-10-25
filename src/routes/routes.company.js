import { Router } from "express";
import companyController from "../controllers/controller.company.js";

const routercompany = Router();

routercompany.post("/company", companyController.createCompany);

export default routercompany;
