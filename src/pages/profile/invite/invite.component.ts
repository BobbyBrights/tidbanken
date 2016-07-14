import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";

@Component({
    selector: 'time',
    template: require('pages/profile/invite/invite.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/invite.component.css')]
})

export class InviteComponent {
    constructor(private _router: Router) {}
}
