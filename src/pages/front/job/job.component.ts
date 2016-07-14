import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router, RouteSegment}       from "@angular/router";
import {Job}                        from "lib/classes/job";
import {JobService}                 from "lib/services/jobService";
import {AuthService}                from "lib/services/authService";
import {User}                       from "lib/classes/user";
import {Datepicker}                 from "lib/components/datepicker/datepicker";
import {Appointment}                from "lib/classes/appointment";
import {Validators, FormBuilder}    from "@angular/common";
import {ValidationService}          from "lib/services/validationService";

import myGlobals = require('globals');

@Component({
    selector: 'job',
    template: require('pages/front/job/job.component.html'),
    directives: [Datepicker],
    providers: [
        HTTP_PROVIDERS,
        JobService
    ],
    styles: [require('css/job.component.css'), require('css/front.component.css'), require('css/components.css')]
})

export class JobComponent {

    public job: Job;
    public appointment: Appointment = <Appointment>{};
    public newDate: Date;
    public newHour: number;
    public newMin: number;

    public author: User;
    public hours: number[];
    public quarters: number[];

    public baseUrl: string;

    public timeForm:any;

    public show: {};
    public soknadsfrist = "";

    constructor(private _router:Router,
                private _jobService:JobService,
                private _routeSegment:RouteSegment,
                private _formBuilder:FormBuilder,
                private _authService:AuthService) {

        this.baseUrl = myGlobals.baseURL;
        this.hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        this.quarters = [0,15,30,45];
        this.show = {
            appointment: false
        };

        this.newHour = -1;
        this.newMin = -1;

        this.timeForm = this._formBuilder.group({
            'hour':['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
            'minute':['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
        });

        let job_id = this._routeSegment.getParam('id');

        this._jobService.getJob(job_id)
            .subscribe(success => {
                this.job = success;

                this._authService.getUser(this.job.user_id)
                    .subscribe(success => {
                        this.author = success;
                    }, error => {});
            }, error => {});
    };

    public toggle(key) {
        this.show[key] = !this.show[key];
    }

    public dateChanged(event) {

        this.newDate = event.value;

        this.newDate.setHours(12, 0, 0);
    }

    public createAppointment() {

        this.newDate.setHours(this.newHour, this.newMin, 0);
        this.newDate.setTime(this.newDate.getTime() - this.newDate.getTimezoneOffset() * 60 * 1000);

        this.appointment.date = this.newDate.toISOString();
        this.appointment.job = this.job.id;

        this._jobService.createAppointment(this.appointment)
            .subscribe(success => {

            }, error => {});
    }
}
