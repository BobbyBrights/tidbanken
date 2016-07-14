import {ServerResponse} from "./serverResponse";

export class User extends ServerResponse{
    phone: string;
    password: string;

    profile_picture: string;
    token: string;
}
