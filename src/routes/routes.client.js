import { Router } from "express";
import clientController from "../controllers/controller.client.js";

const routerclient = Router();

routerclient.post("/client", clientController.createClient);

export default routerclient;
