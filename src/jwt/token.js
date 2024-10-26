import jwt from "jsonwebtoken";

const secretToken = "28Mel10Cr20Nt@777";

function createJWT(id_user) {
  const token = jwt.sign({ id_user }, secretToken, {
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
