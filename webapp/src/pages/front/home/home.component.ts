import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";

@Component({
    selector: 'home',
    template: require('pages/front/home/home.component.html'),
    directives: [SmoothAlert],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/home.component.css')]
})

export class HomeComponent {
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
