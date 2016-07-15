import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {RouteSegment}               from "@angular/router";

import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {JobService}                 from "lib/services/jobService";
import {Appointment}                from "lib/classes/appointment";

@Component({
  selector: 'appointment',
  template: require('pages/front/appointment/appointment.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/appointment.component.css')]
})

export class AppointmentComponent {
  public show: {};
  public appointment:Appointment;

  constructor(
    private _routeSegment:RouteSegment,
    private _jobService:JobService) {
    this.show = {
      alert: false
    };

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
}
