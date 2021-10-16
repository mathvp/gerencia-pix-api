require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ?  '.env.test' : '.env'
});
const express = require('express');
const cors = require('cors');

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../swagger.json");

require('./database');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  customCss: `.swagger-ui .topbar .topbar-wrapper a img { display: none }
  .swagger-ui .topbar .topbar-wrapper a::before { display: block; content:"GerenciaPIX" }
  .swagger-ui .topbar{ background-color: #009E8C; }
  .swagger-ui section.models { display: none; }
  body { padding-bottom: 5rem; }
  .swagger-ui .opblock-tag-section { padding: 1rem 0; }`,
  customSiteTitle: "API Gerencia PIX - Documentation",
  defaultModelsExpandDepth: -1
};

app.use(`/api/${process.env.API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

require('./routes/bank.routes')(app);
require('./routes/user.routes')(app);
require('./routes/pixKey.routes')(app);

const HOSTNAME = '127.0.0.1';
const PORT     = 8080;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}`);
});