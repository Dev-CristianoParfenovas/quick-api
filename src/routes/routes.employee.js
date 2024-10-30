import { Router } from "express";
import employeeController from "../controllers/controller.employee.js";
import jwt from "../jwt/token.js";

const routeremployee = Router();

routeremployee.post(
  "/employee",
  jwt.validateJWT,
  employeeController.createEmployee
);

export default routeremployee;
