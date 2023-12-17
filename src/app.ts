import express, { Express } from "express";
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import { getDbConnection } from './db';
const app: Express = express();
app.use(express.json());


getDbConnection()

RegisterRoutes(app);

const swaggerDocument = require('./swagger/swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app