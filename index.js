import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';
import mongoose from 'mongoose';
import authJWT from './middlewears/authJWT';
import routes from './routes/index.route';
import logger from './helpers/logger';
import connectToDb from './helpers/db';

let app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authJWT);
app.use('/api', routes);

//connect to mongo
connectToDb();

app.server.listen(process.env.PORT || config.port, () => {
	logger.info(`Started on port ${app.server.address().port}`);
	if (process.env.NODE_ENV === 'test') { logger.log(process.env.NODE_ENV + " we in test mode ") };
});

export default app;