import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";

@Component({
    selector: 'time',
    template: require('pages/profile/time/time.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/time.component.css')]
})

export class TimeComponent {
    constructor(private _router: Router) {}
}
