import 'rxjs/Rx';
import {Injectable}     from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from "@angular/router";

import {User}           from '../classes/user';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import myGlobals = require('globals');
import {RequestService} from "./requestService";
import {Job} from "../classes/job";
import {Appointment} from "../classes/appointment";

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

  public getAppointment(appointment_id:string) {
    return this._requestService.request('GET', this._apiEndpoint + 'appointments/' + appointment_id + '/')
      .map(res => <Appointment> res.json());
  }
}
