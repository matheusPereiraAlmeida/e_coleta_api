import express, { RouterOptions } from 'express';

import pointsController from './controllers/pointsController';
import itemsController from './controllers/itemsController';

const routes = express.Router();
const PointsController = new pointsController();
const ItemsController = new itemsController();


routes.get('/items', ItemsController.index);

routes.post('/points', PointsController.create);
routes.get('/points/', PointsController.index);
routes.get('/points/:id', PointsController.show);


export default routes;