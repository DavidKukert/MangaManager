import { Request, Response } from "express";
import { SerieProps } from "../@types/serie";
import connection from "../database/connection";

class SerieController {

    async index(req: Request, res: Response) {
        try {
            const series: SerieProps[] = await connection('series').select('*');

            return res.json(series);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async show(req: Request, res: Response) {
        try {
            const params = req.params;
            const serie: SerieProps = await connection('series').select('*').where(params).first();

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const serie: SerieProps = req.body;
            serie.serieSlug = serie.serieTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();

            const result = await connection('series').insert(serie);

            serie.serieId = result[0];

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const params = req.params;
            const serie: SerieProps = req.body;
            serie.serieSlug = serie.serieTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();
            
            await connection('series').update(serie).where(params);

            serie.serieId = Number(params.serieId);

            return res.json(serie);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const params = req.params;
                        
            await connection('series').delete().where(params);

            return res.json('Série Deletada com Sucesso');
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default SerieController;