import {Component, OnInit} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {Router, ROUTER_DIRECTIVES, RouteSegment} from "@angular/router";

import {AuthService} from "lib/services/authService";
import {PopupAlert} from "lib/components/popupalert/popupalert.component";

@Component({
  selector: 'auth',
  template: require('pages/front/auth/auth.component.html'),
  directives: [PopupAlert, ROUTER_DIRECTIVES],
  providers: [
    HTTP_PROVIDERS,
    AuthService
  ],
  styles: [require('css/auth.component.css')]
})
export class AuthComponent {

  public show:{};
  public alertText:string;

  constructor(private _routeSegment:RouteSegment,
              private _router:Router,
              private _authService:AuthService) {
    this.show = {
      alert: false
    }
  }

  public validataAuthToken() {
    let token = this._routeSegment.getParam('token');

    this._authService.validateToken(token)
      .subscribe(res => {

        this.alertText = 'Bekreftet!';

        this.toggle('alert');
        setTimeout(() => {
          this.toggle('alert');
          this._router.navigate(['login']);
        }, 2000)
      });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
