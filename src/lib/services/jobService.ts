import 'rxjs/Rx';
import {Injectable}                         from '@angular/core';
import {Router}                             from "@angular/router";

import {RequestService}                     from "./requestService";
import {Job}                                from "../classes/job";
import {Appointment}                        from "../classes/appointment";
import {Message}                            from "../classes/message";
import {Room}                               from "../classes/room";

import myGlobals = require('globals');

@Injectable()
export class JobService {

  private _apiEndpoint = myGlobals.apiUrl + 'jobs/';  // URL to web api

  constructor(private _requestService:RequestService,
              private _router:Router) {
  }

  public create(job:Job) {
    return this._requestService.request('POST', this._apiEndpoint, null, job)
      .map(res => <Job> res.json());
  }

  public update(job:Job) {

    // Has to delete imge url for server to accept
    var copy = Object.assign({}, job);
    delete copy.picture;

    return this._requestService.request('PUT', this._apiEndpoint + job.id + "/", null, copy)
      .map(res => <Job> res.json());
  }

  public getJobs() {
    return this._requestService.request('GET', this._apiEndpoint, 'allJobs')
      .map(res => <Job[]> res.json().results);
  }

  public getJob(job_id:string) {

    return this._requestService.request('GET', this._apiEndpoint + job_id + '/')
      .map(res => <Job> res.json());
  }

  public getUserJobs() {
    return this._requestService.request('GET', myGlobals.apiUrl + 'users/current/jobs/')
      .map(res => <Job[]> res.json());
  }

  public getUserAppointments() {
    return this._requestService.request('GET', myGlobals.apiUrl + 'users/current/appointments/', 'appointments')
      .map(res => <Appointment[]> res.json());
  }

  public getAppointments(job_id:number) {
    return this._requestService.request('GET', this._apiEndpoint + job_id + '/appointments/')
      .map(res => <Appointment[]> res.json());
  }

  public createAppointment(appointment:Appointment) {
    return this._requestService.request('POST', this._apiEndpoint + appointment.job + '/appointments/', null, appointment)
      .map(res => <Appointment> res.json());
  }

  public updateAppointment(appointment:Appointment) {
    return this._requestService.request('PUT', this._apiEndpoint + 'appointments/' + appointment.id + '/', null, appointment)
      .map(res => <Appointment> res.json());
  }

  public getAppointment(appointment_id:string) {
    return this._requestService.request('GET', this._apiEndpoint + 'appointments/' + appointment_id + '/')
      .map(res => <Appointment> res.json());
  }

  public registerTimePayment(amount:number, appointment_id:number, user_id:number) {
    var data = {amount:amount, appointment:appointment_id, user:user_id};
    return this._requestService.request('POST', this._apiEndpoint + 'appointments/' + appointment_id + '/time-payments/', null, data);
  }

  // Chat room
  // ----------------------------

  public getRoom(job_id:number, user_id:number) {
    return this._requestService.request('GET', this._apiEndpoint + job_id + '/room/?user_id=' + user_id)
      .map(res => <Room[]> res.json());
  }

  public getMessages(room_id:number) {
    return this._requestService.request('GET', myGlobals.apiUrl + 'chat/rooms/' + room_id + '/messages/')
      .map(res => <Message[]> res.json().results);
  }
}
