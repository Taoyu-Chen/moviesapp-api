import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express'; 
import options from './src/config/swagger.json';
dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.static('public'));

// config swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(options));

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});