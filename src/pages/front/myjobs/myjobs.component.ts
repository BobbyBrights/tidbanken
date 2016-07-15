import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {Appointment}                from "lib/classes/appointment";
import {AppointmentList}            from "lib/components/appointmentlist/appointmentlist.component";
import {JobService}                 from "lib/services/jobService";
import {Job}                        from "lib/classes/job";
import myGlobals = require('globals');

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
  public jobs: Job[] = [];
  public selectedJob: Job;

  public baseUrl:string;

  public appointments: Appointment[] = [];

  constructor(private _jobService:JobService) {
    this.show = {
      alert: false
    };

    this.baseUrl = myGlobals.baseURL;

    this._jobService.getUserJobs()
      .subscribe(success => {

        this.jobs = success;
        this.selectedJob = success[0];

        this.setAppointments();

      }, error => {});
  }

  public setAppointments() {
    this._jobService.getAppointments(this.selectedJob.id)
      .subscribe(success => {
        this.appointments = success;
      }, error => {
      });
  }

  public setSelectedJob(job) {
    if (this.selectedJob != job) {
      this.selectedJob = job;
      this.setAppointments();
    }
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public timeSince(d:string) {

    var date = new Date(d);

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " år";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " måneder";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " dager";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " timer";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutter";
    }
    return Math.floor(seconds) + " sekunder";
  }
}

