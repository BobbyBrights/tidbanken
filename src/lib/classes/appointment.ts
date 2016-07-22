import {ServerResponse} from "./serverResponse";
import {Job} from "./job";

export class Appointment extends ServerResponse {
  date:string;
  job:any;
  status:number;
  time_amount:number;
  user: any;

  constructor() {

  }

  public finishAppointment() {
    this.status = 3;
  }
}
