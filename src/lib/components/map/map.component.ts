import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  MouseEvent,
  GOOGLE_MAPS_PROVIDERS,
  GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

@Component({
  selector: 'korde-map',
  template: require('lib/components/map/map.component.html'),
  directives: [GOOGLE_MAPS_DIRECTIVES],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/map.component.css'), require('css/app.component.css')]
})

export class MapComponent {
  @Input() options:{};
  @Input() markers:any[];

}
