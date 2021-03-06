import { Request, Response } from "express";
import { RoleProps } from "../@types/role";
import connection from "../database/connection";

class RoleController {

    async index(req: Request, res: Response) {
        try {
            const roles: RoleProps[] = await connection('roles').select('*');

            roles.map(
                role => {
                    role.rolePerms = JSON.parse(role.rolePerms.toString());

                    return role;
                }
            );

            return res.json(roles);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async show(req: Request, res: Response) {
        try {
            const roleFilter = req.params;

            const role: RoleProps = await connection('roles').select('*').where(roleFilter).first();

            role.rolePerms = JSON.parse(role.rolePerms.toString());
            
            return res.json(role);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const role: RoleProps = req.body;

            role.rolePerms = JSON.stringify(role.rolePerms);

            const result = await connection('roles').insert(role);

            role.roleId = result[0];
            role.rolePerms = JSON.parse(role.rolePerms.toString());

            return res.json(role);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const roleFilter = req.params;
            const role: RoleProps = req.body;

            role.rolePerms = JSON.stringify(role.rolePerms);

            await connection('roles').update(role).where(roleFilter);

            role.roleId = Number(roleFilter.roleId);
            role.rolePerms = JSON.parse(role.rolePerms.toString());

            return res.json(role);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const roleFilter = req.params;

            await connection('roles').del().where(roleFilter);
            
            return res.json("Cargo deletado com sucesso!!");
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

export default RoleController;