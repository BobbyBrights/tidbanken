import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";

@Component({
    selector: 'payment',
    template: require('pages/profile/payment/payment.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/payment.component.css')]
})

export class PaymentComponent {
    constructor(private _router: Router) {}
}
