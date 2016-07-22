import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';


@Component({
  selector: 'time-loader',
  template: require('lib/components/loader/loader.component.html'),
  directives: [],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/loader.component.css'), require('css/app.component.css')]
})
export class LoaderComponent  {
  @Input() collapse: boolean;
}
