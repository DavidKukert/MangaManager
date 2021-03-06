import express, { Request, Response } from "express";
import multer from "multer";
import { multerChapterConfig, multerSerieConfig } from "./configs/multer";
import ChapterController from "./controllers/ChapterController";
import SerieController from "./controllers/SerieController";
import SessionController from "./controllers/SessionController";
import TagController from "./controllers/TagController";
import UserController from "./controllers/UserController";
import connection from "./database/connection";

const routes = express.Router();
const multerSerie = multer(multerSerieConfig);
const multerChapter = multer(multerChapterConfig);

const chapterController = new ChapterController();
const serieController = new SerieController();
const sessionController = new SessionController();
const tagController = new TagController();
const userController = new UserController();

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
routes.use('/serie/*', sessionController.verifyLogin);
routes.post('/serie/new', multerSerie.single('serieThumbnail'), serieController.create);
routes.put('/serie/:serieId', multerSerie.single('serieThumbnail'), serieController.update);
routes.delete('/serie/:serieId', serieController.delete);

// Tag Routes
routes.get('/tags', tagController.index);
routes.get('/tag/:tagId', tagController.show);
routes.use('/tag/*', sessionController.verifyLogin);
routes.post('/tag/new', tagController.create);
routes.put('/tag/:tagId', tagController.update);
routes.delete('/tag/:tagId', tagController.delete);

// Chapter Routes
routes.get('/chapters', chapterController.index);
routes.get('/chapter/:chapterId', chapterController.show);
routes.use('/chapter/*', sessionController.verifyLogin);
routes.post('/chapter/new', multerChapter.array('chapterPages'), chapterController.create);
routes.put('/chapter/:chapterId', multerChapter.array('chapterPages'), chapterController.update);
routes.delete('/chapter/:chapterId', chapterController.delete);

// Users Routes
routes.get('/users', userController.index);
routes.get('/user/:userId', userController.show);
routes.post('/user/new', userController.create);
routes.use('/user/*', sessionController.verifyLogin);
routes.put('/user/:userId', userController.update);
routes.delete('/user/:userId', userController.delete);

// Session Routes
routes.get('/login', sessionController.verifyLogin, sessionController.userSession);
routes.post('/login', sessionController.login);

export default routes;