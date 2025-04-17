export interface UserUpdatePayload{
    username: string;
    email: string;
    password: string;
    newPassword?:string;
}