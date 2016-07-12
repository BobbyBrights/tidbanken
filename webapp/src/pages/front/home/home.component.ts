import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';

@Component({
    selector: 'home',
    template: require('pages/front/home/home.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/home.component.css')]
})

export class HomeComponent {

}
