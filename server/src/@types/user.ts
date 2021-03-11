import { RoleProps } from "./role";

export interface UserProps {
    userId: number;
    userNickName: string;
    userEmail: string;
    userPassWord: string;
    userSalt: string;
    userRole: RoleProps;
}