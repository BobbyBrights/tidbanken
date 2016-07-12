import {ServerResponse} from "./serverResponse";
export class Job extends ServerResponse {

    /*  ================================
     *      PUBLIC FIELDS
     *  ================================ */

    public title: string;
    public description: string;
    public thumbnail: string;

    constructor(title: string, description: string, thumbnail: string) {

        // Needs to call super before accessing 'this' in the constructor of a derived class
        super();

        /*  ================================
         *      INITIALIZES AN INSTANCE
         *  ================================ */

        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
    }
}
