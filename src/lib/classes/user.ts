import {ServerResponse} from "./serverResponse";

export class User extends ServerResponse {
  phone:string;
  password:string;

  profile_picture:string;
  token:string;

  has_completed_profile:boolean;

  // Fields for creation of user
  auth_method:string;
}
