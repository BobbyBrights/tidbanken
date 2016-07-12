import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {Job} from "../../../lib/classes/job";

@Component({
    selector: 'jobs',
    template: require('pages/front/jobs/jobs.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/jobs.component.css'), require('css/front.component.css')]
})

export class JobsComponent {

    public jobs: Job[] = <Job[]>{};

    constructor(private _router:Router) {

        this.jobs = [
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Test", "Bla bla", "http://kingofwallpapers.com/happy/happy-007.jpg"),
        ]
    };
}
