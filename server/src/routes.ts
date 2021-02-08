import express, {Request, Response} from "express";

const routes = express.Router();

routes.get('/', function(req: Request, res: Response) {
    return res.sendStatus(200);
})

export default routes;