import { Router } from "express";
import employeeController from "../controllers/controller.employee.js";

const routeremployee = Router();

routeremployee.post("/employee", employeeController.createEmployee);

routeremployee.post(
  "/employee/login",
  employeeController.loginEmployeeController
);

export default routeremployee;
