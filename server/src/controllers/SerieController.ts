import { Request, Response } from "express";
import url from "url";
import path from "path";
import fs from "fs";
import { SerieProps } from "../@types/serie";
import connection from "../database/connection";

class SerieController {

    async index(req: Request, res: Response) {
        try {
            const seriesList: SerieProps[] = await connection('series')
                .leftJoin('series_rel_tags', 'series.serieId', 'series_rel_tags.relSerieId')
                .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                .select('series.*').distinct();

            const series: SerieProps[] = await Promise.all(
                seriesList.map(
                    async serie => {
                        serie.serieAuthors = await connection('series_rel_tags')
                            .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                            .select('tags.*')
                            .where({
                                relSerieId: serie.serieId,
                                tagType: 'author'
                            });

                        serie.serieArtists = await connection('series_rel_tags')
                            .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                            .select('tags.*')
                            .where({
                                relSerieId: serie.serieId,
                                tagType: 'artist'
                            });

                        serie.serieGenres = await connection('series_rel_tags')
                            .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                            .select('tags.*')
                            .where({
                                relSerieId: serie.serieId,
                                tagType: 'genre'
                            });

                        return serie;
                    }
                )
            );

            return res.json(series);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async show(req: Request, res: Response) {
        try {
            const params = req.params;
            const serie: SerieProps = await connection('series').select('*').where(params).first();

            serie.serieAuthors = await connection('series_rel_tags')
                .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                .select('tags.*')
                .where({
                    relSerieId: serie.serieId,
                    tagType: 'author'
                });

            serie.serieArtists = await connection('series_rel_tags')
                .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                .select('tags.*')
                .where({
                    relSerieId: serie.serieId,
                    tagType: 'artist'
                });

            serie.serieGenres = await connection('series_rel_tags')
                .leftJoin('tags', 'series_rel_tags.relTagId', 'tags.tagId')
                .select('tags.*')
                .where({
                    relSerieId: serie.serieId,
                    tagType: 'genre'
                });

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { serieTags, ...serie }: SerieProps = req.body;

            serie.serieThumbnail = url.format({
                protocol: req.protocol,
                slashes: true,
                host: req.headers.host,
                pathname: '/uploads/serie/' + serie.serieFolder + '/' + req.file.filename
            });

            const trx = await connection.transaction();

            const result = await trx('series').insert(serie);

            const serieTagsArr = serieTags.split(',').map(item => Number(item.trim())).map(
                (item: number) => {
                    return {
                        relSerieId: result[0],
                        relTagId: item
                    }
                }
            );

            await trx('series_rel_tags').insert(serieTagsArr);

            await trx.commit();

            serie.serieId = result[0];

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const params = req.params;
            const { serieTags, ...serie }: SerieProps = req.body;
            serie.serieSlug = serie.serieTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();

            if (req.file) {
                serie.serieThumbnail = url.format({
                    protocol: req.protocol,
                    slashes: true,
                    host: req.headers.host,
                    pathname: '/uploads/serie/' + serie.serieFolder + '/' + req.file.filename
                });
            }

            const serieTagsArr = serieTags.split(',').map(item => Number(item.trim())).map(
                (item: number) => {
                    return {
                        relSerieId: params.serieId,
                        relTagId: item
                    }
                }
            );

            const trx = await connection.transaction();

            await trx('series_rel_tags').del().where({ relSerieId: params.serieId });

            await trx('series').update(serie).where(params);

            await trx('series_rel_tags').insert(serieTagsArr);

            await trx.commit();

            serie.serieId = Number(params.serieId);

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const params = req.params;

            const serie: SerieProps = await connection('series').select('*').where(params).first();

            const directorySerie = path.resolve(__dirname, '..', '..', 'uploads', 'serie', serie.serieFolder);

            const trx = await connection.transaction();

            const result1 = await trx('series_rel_tags').delete().where('relSerieId', '=', params.serieId);

            const result2 = await trx('series').delete().where(params);

            await trx.commit();

            if (result1 > 0 && result2 > 0 ) {
                fs.rmdirSync(directorySerie, { recursive: true });
            }

            return res.json('Série Deletada com Sucesso');
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default SerieController;