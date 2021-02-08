import crypto from "crypto";
import fs from "fs";
import multer, { Options } from "multer";
import path from "path";
import { SerieProps } from "../@types/serie";
import connection from "../database/connection";

export const multerSerieConfig: Options = {
    storage: multer.diskStorage({
        async destination(request, file, callback) {
            const serie: SerieProps = request.body;
            const serieSlug = serie.serieTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();
            let serieFolder: string = '';

            if(request.method === 'POST') {
                serieFolder = 'serie-' + crypto.randomBytes(6).toString('hex');
            }

            if(request.method === 'PUT') {
                const params = request.params;
                const serieDb: SerieProps = await connection('series').select('*').where(params).first();
                serieFolder = serieDb.serieFolder;
            }

            const directorySeries = path.resolve(__dirname, '..', '..', 'uploads', 'serie');
            const directorySerie = path.resolve(__dirname, '..', '..', 'uploads', 'serie', serieFolder);

            if (!fs.existsSync(directorySeries)) fs.mkdirSync(directorySeries, 0o744);
            if (!fs.existsSync(directorySerie)) fs.mkdirSync(directorySerie, 0o744);

            request.body.serieSlug = serieSlug;
            if(request.method === 'POST') request.body.serieFolder = serieFolder;

            callback(null, directorySerie);
        },
        filename(request, file, callback) {
            const serie: SerieProps = request.body;

            const fileName = `${serie.serieSlug}${path.extname(file.originalname)}`;

            callback(null, fileName);
        }
    })
}