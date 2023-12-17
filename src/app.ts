// src/app.ts
import express, { Express } from "express";
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import { getDbConnection } from './db';

const app: Express = express();
const port = process.env.PORT || 3000;


getDbConnection()

RegisterRoutes(app);

const swaggerDocument = require('./swagger/swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});