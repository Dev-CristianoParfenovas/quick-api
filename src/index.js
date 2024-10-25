import express from "express";
import cors from "cors";
import routerproduct from "./routes/routes.products.js";
import routercompany from "./routes/routes.company.js";
import routerclient from "./routes/routes.client.js";
import routeremployee from "./routes/routes.employee.js";
import dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente

const app = express();
app.use(cors());
app.use(express.json());
app.use(routerproduct, routercompany, routerclient, routeremployee);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
