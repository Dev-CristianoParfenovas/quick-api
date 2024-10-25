import { Router } from "express";
import employeeController from "../controllers/controller.employee.js";

const routeremployee = Router();

routeremployee.post("/employee", employeeController.createEmployee);

export default routeremployee;
