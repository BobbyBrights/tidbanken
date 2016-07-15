import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {RouteSegment}               from "@angular/router";

import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {JobService}                 from "lib/services/jobService";
import {Appointment}                from "lib/classes/appointment";

import myGlobals = require('globals');

@Component({
  selector: 'appointment',
  template: require('pages/front/appointment/appointment.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/appointment.component.css'), require('css/front.component.css')]
})

export class AppointmentComponent {
  public show: {};
  public appointment:Appointment;

  public baseUrl:string;

  constructor(
    private _routeSegment:RouteSegment,
    private _jobService:JobService) {
    this.show = {
      alert: false
    };

    this.baseUrl = myGlobals.baseURL;

    let appointment_id = this._routeSegment.getParam('id');

    this._jobService.getAppointment(appointment_id)
      .subscribe(success => {
        this.appointment = success;
        console.log(this.appointment);
      }, error => {
        console.log(error);
      });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public checkStatus(status:number, check:number) {
    return status == check
  }

  public covertDate(date) {
    return new Date(date);
  }

  public accept() {
    this.appointment.status = 1;
    this.update();
  }

  public decline() {
    this.appointment.status = 2;
    this.update();
  }

  public update() {
    this._jobService.updateAppointment(this.appointment)
      .subscribe(success => {}, error => {});
  }
}
