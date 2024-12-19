import { Router } from "express";
import clientController from "../controllers/controller.client.js";

const routerclient = Router();

// Rota para login do cliente (POST)
routerclient.post("/client/login", clientController.login);

routerclient.post("/client", clientController.createOrUpdateClient);

export default routerclient;
