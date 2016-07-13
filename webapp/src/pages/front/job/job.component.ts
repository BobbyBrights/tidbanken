import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router, RouteSegment}       from "@angular/router";
import {Job}                        from "lib/classes/job";
import {JobService}                 from "lib/services/jobService";
import {AuthService}                from "lib/services/authService";
import {User}                       from "lib/classes/user";
import {Datepicker}                 from "lib/components/datepicker/datepicker";
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
    public author: User;

    public baseUrl: string;

    public show: {};
    public soknadsfrist = "";

    constructor(private _router:Router,
                private _jobService:JobService,
                private _routeSegment:RouteSegment,
                private _authService:AuthService) {

        this.baseUrl = myGlobals.baseURL;

        this.show = {
            appointment: false
        };

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
        var d = event.value;
        d.setHours(23, 59, 59);
        d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);

        this.job.title = d.toISOString();
    }
}
