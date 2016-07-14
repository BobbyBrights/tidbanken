import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';


@Component({
    selector: 'popup-alert',
    template: require('lib/components/popupalert/popupalert.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/popupalert.component.css'), require('css/app.component.css')]
})
export class PopupAlert  {
    @Input() alertText: string;
    @Input() alert: boolean;
}
