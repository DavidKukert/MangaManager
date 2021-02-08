import express, { Request, Response } from "express";
import connection from "./database/connection";

const routes = express.Router();

routes.get('/', async function (req: Request, res: Response) {
    try {
        await connection.migrate.latest();
        await connection.seed.run();
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json(error);
    }
})

export default routes;