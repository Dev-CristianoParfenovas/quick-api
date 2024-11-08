import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente
dotenv.config();

// Obtenha o segredo do JWT a partir da variável de ambiente
const secretToken = process.env.SECRET_TOKEN;

function createJWT(id_user, id_employee) {
  const token = jwt.sign({ id_user, id_employee }, secretToken, {
    expiresIn: "7d", // Define a expiração do token para 7 dias
  });
  return token;
}

function validateJWT(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).send({ error: "Token não informado" });
  }

  const [aux, token] = authToken.split(" ");

  jwt.verify(token, secretToken, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token inválido" });

    //Salva o id_user dentro da requisição para ser usado no futuro...
    req.id_user = decoded.id_user;

    next();
  });
}
// ----->> routes ----->> Validar token ----->> Controller

export default { createJWT, validateJWT };
