import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {Datepicker}                 from "lib/components/datepicker/datepicker";
import {JobService}                 from "lib/services/jobService";
import {Appointment} from "../../../lib/classes/appointment";

@Component({
  selector: 'home',
  template: require('pages/front/myappointments/myappointments.component.html'),
  directives: [SmoothAlert, Datepicker],
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

  private statuses: number[];

  constructor(private _jobService:JobService) {
    this.show = {
      alert: false
    };

    this.statuses = [0,1,2];

    this._jobService.getUserAppointments()
      .subscribe(success => {
        this.appointments = success;
        this.filteredAppointments = this.appointments;
      }, error => {
      });
  }

  // Appointments related
  // ---------------------------
  public checkStatus(status:number, check:number) {
    return status == check
  }

  public covertDate(date) {
    return new Date(date);
  }

  public toggleStatus(status:number) {
    let index = this.statuses.indexOf(status);
    if (index != -1)
      this.statuses.splice(index, 1);
    else
      this.statuses.push(status);

    this.filterAppointments();
  }

  public checkFilter(status:number) {
    return (this.statuses.indexOf(status) != -1)
  }

  private filterAppointments() {
    this.filteredAppointments = this.appointments.filter((item) => {
      return this.statuses.indexOf(item.status) != -1;
    });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
