import express, { Request, Response } from "express";
import SerieController from "./controllers/SerieController";
import connection from "./database/connection";

const routes = express.Router();

const serieController = new SerieController();

routes.get('/', async function (req: Request, res: Response) {
    try {
        await connection.migrate.latest();
        await connection.seed.run();
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Serie Routes
routes.get('/series', serieController.index);
routes.get('/serie/:serieId', serieController.show);
routes.post('/serie/new', serieController.create);
routes.put('/serie/:serieId', serieController.update);
routes.delete('/serie/:serieId', serieController.delete);



export default routes;