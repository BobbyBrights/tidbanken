import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router, RouteSegment}       from "@angular/router";
import {Job}                        from "lib/classes/job";
import {JobService}                 from "lib/services/jobService";
import {AuthService}                from "lib/services/authService";
import {User}                       from "lib/classes/user";
import myGlobals = require('globals');

@Component({
    selector: 'job',
    template: require('pages/front/job/job.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS,
        JobService
    ],
    styles: [require('css/job.component.css'), require('css/front.component.css')]
})

export class JobComponent {

    public job: Job;
    public author: User;

    public baseUrl: string;

    constructor(private _router:Router,
                private _jobService:JobService,
                private _routeSegment:RouteSegment,
                private _authService:AuthService) {

        this.baseUrl = myGlobals.baseURL;

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
}
