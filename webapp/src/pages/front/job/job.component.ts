import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {Job}                        from "lib/classes/job";

@Component({
    selector: 'job',
    template: require('pages/front/job/job.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/jobs.component.css'), require('css/front.component.css')]
})

export class JobComponent {

    public job: Job;

    constructor(private _router:Router) {

        this.job = new Job("Dette er en test", "Vi elsker tester", "http://kingofwallpapers.com/happy/happy-007.jpg");
    };
}
