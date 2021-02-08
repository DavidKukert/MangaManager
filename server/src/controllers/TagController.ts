import { Request, Response } from "express";
import { TagProps } from "../@types/tag";
import connection from "../database/connection";

class TagController {

    async index(req: Request, res: Response) {
        try {
            const tags: TagProps[] = await connection('tags').select('*');

            return res.json(tags);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async show(req: Request, res: Response) {
        try {
            const params = req.params;
            const tag: TagProps = await connection('tags').select('*').where(params).first();

            return res.json(tag);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const tag: TagProps = req.body;
            tag.tagSlug = tag.tagTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();

            const result = await connection('tags').insert(tag);

            tag.tagId = result[0];

            return res.json(tag);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const params = req.params;
            const tag: TagProps = req.body;
            tag.tagSlug = tag.tagTitle.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').replace(/[^\w\-]+/g, '-').toLocaleLowerCase();
            
            await connection('tags').update(tag).where(params);

            tag.tagId = Number(params.tagId);

            return res.json(tag);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const params = req.params;
                        
            await connection('tags').delete().where(params);

            return res.json('Tag Deletada com Sucesso');
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default TagController;