import express, { Request, Response } from "express";
import multer from "multer";
import { multerChapterConfig, multerSerieConfig } from "./configs/multer";
import ChapterController from "./controllers/ChapterController";
import SerieController from "./controllers/SerieController";
import TagController from "./controllers/TagController";
import connection from "./database/connection";

const routes = express.Router();
const multerSerie = multer(multerSerieConfig);
const multerChapter = multer(multerChapterConfig);

const chapterController = new ChapterController();
const serieController = new SerieController();
const tagController = new TagController();

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
routes.post('/serie/new', multerSerie.single('serieThumbnail'), serieController.create);
routes.put('/serie/:serieId', multerSerie.single('serieThumbnail'), serieController.update);
routes.delete('/serie/:serieId', serieController.delete);

// Tag Routes
routes.get('/tags', tagController.index);
routes.get('/tag/:tagId', tagController.show);
routes.post('/tag/new', tagController.create);
routes.put('/tag/:tagId', tagController.update);
routes.delete('/tag/:tagId', tagController.delete);

// Chapter Routes
routes.get('/chapters', chapterController.index);
routes.get('/chapter/:chapterId', chapterController.show);
routes.post('/chapter/new', multerChapter.array('chapterPages'), chapterController.create);
routes.put('/chapter/:chapterId', multerChapter.array('chapterPages'), chapterController.update);
routes.delete('/chapter/:chapterId', chapterController.delete);

export default routes;