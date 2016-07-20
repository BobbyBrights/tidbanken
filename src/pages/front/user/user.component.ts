import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";
import {AuthService} from "../../../lib/services/authService";
import {RouteSegment} from "@angular/router";
import {User} from "../../../lib/classes/user";
import myGlobals = require('globals');

@Component({
  selector: 'user',
  template: require('pages/front/user/user.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    AuthService
  ],
  styles: [require('css/user.component.css'), require('css/front.component.css')]
})

export class UserComponent {
  public show: {};
  public user: User = <User>{};

  // Other
  // ------------------
  public baseUrl: string;

  constructor(
    private _authService:AuthService,
    private _routeSegment:RouteSegment) {

    // Sets the base url from globals file
    this.baseUrl = myGlobals.baseURL;

    // Gets user id from route parameters
    var user_id = this._routeSegment.getParam('id');

    this._authService.getUser(<number>user_id)
      .subscribe(success => {
        this.user = success;
      }, error => {});

    this.show = {
      alert: false
    };
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
