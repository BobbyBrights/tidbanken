import {ServerResponse} from "./serverResponse";
export class Job extends ServerResponse {

  /*  ================================
   *      PUBLIC FIELDS
   *  ================================ */

  public title:string;
  public description:string;
  public picture:string;
  public duration:number;
  public street_address:string;
  public user_id:number;
  public tags:string[] = [];

  constructor(title:string, description:string) {

    // Needs to call super before accessing 'this' in the constructor of a derived class
    super();

    /*  ================================
     *      INITIALIZES AN INSTANCE
     *  ================================ */

    this.title = title;
    this.description = description;
  }
}
