import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express'; 
import options from './src/config/swagger.json';
import moviesRouter from './src/api/movies';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
const port = process.env.PORT;

app.use(express.static('public'));
app.use('/api/movies', moviesRouter);

// config swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(options));

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});