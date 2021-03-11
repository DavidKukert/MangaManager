import { NextFunction, Request, Response } from "express";
import { UserSessionProps } from "../@types/session";
import { UserProps } from "../@types/user";
import connection from "../database/connection";
import { verifyPass } from "../utils/cryptoPass";
import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";
import { RoleProps } from "../@types/role";

dotenv.config({
    allowEmptyValues: true
});

class SessionController {

    async login(req: Request, res: Response) {

        const { userNickName, userPassWord }: UserSessionProps = req.body;

        const user: UserProps = await connection('users').select('*').where({ userNickName }).first();

        if (verifyPass(userPassWord, user.userPassWord, user.userSalt)) {

            const token = jwt.sign({
                userId: user.userId,
                userNickName: user.userNickName
            }, String(process.env.JWTSECRET), {
                expiresIn: "7d"
            });

            return res.json({ auth: true, token: token });

        }

        return res.status(403).json("Falha na autenticação!! Tente novamente.");

    }

    async verifyLogin(req: Request, res: Response, next: NextFunction) {

        const token: any = req.headers['x-access-token'];

        if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

        jwt.verify(token, String(process.env.JWTSECRET), function (err: any, decoded: any) {
            if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            req.headers["userId"] = String(decoded.userId);
            req.headers["userNickName"] = decoded.userNickName;
            next();
        });

    }

    async userSession(req: Request, res: Response) {

        const userFilter = {
            userId: Number(req.headers["userId"]),
            userNickName: req.headers["userNickName"]
        };

        const user: UserProps = await connection('users').select('*').where(userFilter).first();

        return res.json(user);

    }

    async verifyAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const userFilter = {
                userId: Number(req.headers["userId"]),
                userNickName: req.headers["userNickName"]
            };

            const user: UserProps = await connection('users')
                .select(
                    'userId',
                    'userNickName',
                    'userEmail'
                ).where(userFilter).first();

            const role: RoleProps = await connection('users_rel_roles')
                .leftJoin('roles', 'users_rel_roles.relUserId', 'roles.roleId')
                .select('roles.*')
                .where('relUserId', '=', user.userId).first();

            role.rolePerms = JSON.parse(role.rolePerms.toString());

            user.userRole = role;

            if(user.userRole.roleName === 'admin') {
                next();
            } else {
                throw "Usúario Não permitido!!";
            }
        } catch (error) {
            return res.status(403).json(error);
        }
    }

}

export default SessionController;