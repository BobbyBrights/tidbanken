import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {Datepicker}                 from "lib/components/datepicker/datepicker";

@Component({
    selector: 'home',
    template: require('pages/front/myappointments/myappointments.component.html'),
    directives: [SmoothAlert, Datepicker],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/myappointments.component.css'), require('css/front.component.css')]
})

export class MyAppointments {
    public show: {};

    constructor() {
        this.show = {
            alert: false
        };
    }

    public toggle(key) {
        this.show[key] = !this.show[key];
    }
}
