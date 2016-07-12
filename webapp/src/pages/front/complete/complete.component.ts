import {Component, OnInit} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {RouteSegment} from "@angular/router";

import {AuthService} from "lib/services/authService";

@Component({
    selector: 'complete',
    template: require('pages/front/complete/complete.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS,
        AuthService
    ],
    styles: [require('css/complete.component.css')]
})
export class CompleteComponent {
    constructor(
        private _authService:AuthService,
        private _routeSegment:RouteSegment
    ) {

    }

    public sendNewMail() {
        var email = this._routeSegment.getParam('email');
        this._authService.resendConfirmEmail(email)
            .subscribe(res => {
                console.log('New email sent');
            });
    }
}
