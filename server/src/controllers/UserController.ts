import { Request, Response } from "express";
import { UserProps } from "../@types/user";
import connection from "../database/connection";
import generatePass from "../utils/cryptoPass";

class UserController {

    async index(req: Request, res: Response) {
        try {
            const users: UserProps[] = await connection('users').select('*');

            return res.json(users);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async show(req: Request, res: Response) {
        try {
            const userFilter = req.params;

            const user: UserProps = await connection('users').select('*').where(userFilter).first();
            
            return res.json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const user: UserProps = req.body;
            const { hash, salt } = generatePass(user.userPassWord);

            user.userPassWord = hash;
            user.userSalt = salt;

            const result = await connection('users').insert(user);

            user.userId = result[0];

            return res.json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userFilter = req.params;
            const user: UserProps = req.body;
            const { hash, salt } = generatePass(user.userPassWord);

            user.userPassWord = hash;
            user.userSalt = salt;

            await connection('users').update(user).where(userFilter);

            user.userId = Number(userFilter.userId);

            return res.json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userFilter = req.params;

            await connection('users').del().where(userFilter);
            
            return res.json("Usuário deletado com sucesso!!");
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default UserController;