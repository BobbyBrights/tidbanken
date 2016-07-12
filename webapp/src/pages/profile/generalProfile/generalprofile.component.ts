import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";

@Component({
    selector: 'generalprofile',
    template: require('pages/profile/generalProfile/generalprofile.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/generalprofile.component.css')]
})

export class GeneralProfileComponent {
    constructor(private _router: Router) {}
}
