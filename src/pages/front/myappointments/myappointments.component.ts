import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {Datepicker}                 from "lib/components/datepicker/datepicker";
import {JobService}                 from "lib/services/jobService";
import {Appointment}                from "lib/classes/appointment";
import {AppointmentList}            from "lib/components/appointmentlist/appointmentlist.component";

@Component({
  selector: 'home',
  template: require('pages/front/myappointments/myappointments.component.html'),
  directives: [SmoothAlert, Datepicker, AppointmentList],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/myappointments.component.css'), require('css/front.component.css')]
})

export class MyAppointments {
  public show:{};
  public appointments: Appointment[] = [];
  public filteredAppointments: Appointment[] = [];

  public dates: number[];

  constructor(private _jobService:JobService) {
    this.show = {
      alert: false
    };

    this.dates = [];

    this._jobService.getUserAppointments()
      .subscribe(success => {
        this.appointments = success;
        this.filteredAppointments = this.appointments;
      }, error => {
      });
  }

  public addDate(event) {
    var newDate = event.value;
    newDate.setHours(0,0,0,0);

    var dateSeconds = newDate.getTime();

    var index = this.dates.indexOf(dateSeconds);

    if (index != -1) {
      this.dates.splice(index, 1);
    } else {
      this.dates.push(dateSeconds);
    }

    this.dateFilter();
  }

  public dateFilter() {

    if (this.dates.length == 0) {
      this.filteredAppointments = this.appointments;
      return;
    }

    this.filteredAppointments = this.appointments.filter((item) => {
      var date = new Date(item.date);
      date.setHours(0,0,0,0);
      var dateSeconds = date.getTime();

      return this.dates.indexOf(dateSeconds) != -1;
    });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
