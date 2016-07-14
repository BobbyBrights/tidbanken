import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {Appointment}                from "lib/classes/appointment";
import {AppointmentList}            from "lib/components/appointmentlist/appointmentlist.component";
import {JobService}                 from "lib/services/jobService";

@Component({
  selector: 'myjobs',
  template: require('pages/front/myjobs/myjobs.component.html'),
  directives: [SmoothAlert, AppointmentList],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/myjobs.component.css'), require('css/front.component.css')]
})

export class MyJobsComponent {
  public show: {};
  public appointments: Appointment[] = [];

  constructor(private _jobService:JobService) {
    this.show = {
      alert: false
    };

    this._jobService.getUserAppointments()
      .subscribe(success => {
        this.appointments = success;
      }, error => {
      });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
