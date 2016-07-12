import {ServerResponse} from "./serverResponse";

export class User extends ServerResponse{
    username: string;
    password: string;
    
    user_profile: {};
    token: string;
}