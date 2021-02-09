import { Request, Response } from "express";
import { ChapterPagesProps, ChapterProps } from "../@types/chapter";
import url from "url";
import path from "path";
import fs from "fs";
import connection from "../database/connection";

class ChapterController {
    async index(req: Request, res: Response) {
        try {
            const chapterList: ChapterProps[] = await connection('chapters')
                .leftJoin('series', 'chapters.chapterSerieId', 'series.serieId')
                .select('chapters.*').distinct();

            const chapters: ChapterProps[] = await Promise.all(
                chapterList.map(
                    async chapter => {
                        chapter.chapterSerie = await connection('series')
                            .select('serieId', 'serieTitle', 'serieSlug')
                            .where({ serieId: chapter.chapterSerieId }).first();
                        chapter.chapterPages = JSON.parse(chapter.chapterPages.toString());
                        return chapter;
                    }
                )
            );

            return res.json(chapters);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async show(req: Request, res: Response) {
        try {
            const params = req.params;
            const chapter: ChapterProps = await connection('chapters')
                .leftJoin('series', 'chapters.chapterSerieId', 'series.serieId')
                .select('chapters.*').where(params).first();

            chapter.chapterSerie = await connection('series')
                .select('serieId', 'serieTitle', 'serieSlug')
                .where({ serieId: chapter.chapterSerieId }).first();

            chapter.chapterPages = JSON.parse(chapter.chapterPages.toString());

            return res.json(chapter);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async create(req: Request, res: Response) {
        try {
            const { chapterSerie, ...chapter }: ChapterProps = req.body;

            if (Array.isArray(req.files)) {
                const chapterPages: ChapterPagesProps[] = req.files.map(
                    (file: Express.Multer.File) => {
                        return {
                            filename: file.filename,
                            mimetype: file.mimetype,
                            path: file.path,
                            pageUrl: url.format({
                                protocol: req.protocol,
                                slashes: true,
                                host: req.headers.host,
                                pathname: '/uploads/serie/' + chapterSerie?.serieFolder + '/' + chapter.chapterNumber + '/' + file.filename
                            })
                        }
                    }
                );
                chapter.chapterPages = JSON.stringify(chapterPages);
            }

            const result = await connection('chapters').insert(chapter);

            chapter.chapterId = result[0];
            chapter.chapterPages = JSON.parse(chapter.chapterPages.toString());

            return res.json(chapter);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async update(req: Request, res: Response) {
        try {
            const params = req.params;
            const { chapterSerie, ...chapter }: ChapterProps = req.body;

            if (Array.isArray(req.files) && req.files) {
                const chapterPages: ChapterPagesProps[] = req.files.map(
                    (file: Express.Multer.File) => {
                        return {
                            filename: file.filename,
                            mimetype: file.mimetype,
                            path: file.path,
                            pageUrl: url.format({
                                protocol: req.protocol,
                                slashes: true,
                                host: req.headers.host,
                                pathname: '/uploads/serie/' + chapterSerie?.serieFolder + '/' + chapter.chapterNumber + '/' + file.filename
                            })
                        }
                    }
                );
                chapter.chapterPages = JSON.stringify(chapterPages);
            }

            await connection('chapters').update(chapter).where(params);

            chapter.chapterId = Number(params.chapterId);
            if (Array.isArray(req.files) && req.files) chapter.chapterPages = JSON.parse(chapter.chapterPages.toString());

            return res.json(chapter);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const params = req.params;

            const chapter: ChapterProps = await connection('chapters')
                .leftJoin('series', 'chapters.chapterSerieId', 'series.serieId')
                .select('chapters.*', connection.raw('series.serieFolder as chapterSerieFolder')).where(params).first();

            const chapterDirectory = path.resolve(__dirname, '..', '..', 'uploads', 'serie', String(chapter.chapterSerieFolder), chapter.chapterNumber.toString().trim());

            const trx = await connection.transaction();

            const result = await trx('chapters').delete().where(params);

            await trx.commit();

            if (result > 0) {
                fs.rmdirSync(chapterDirectory, { recursive: true });
            }

            return res.json('Capítulo deletado com sucesso!!');
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default ChapterController;