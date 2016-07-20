import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {RouteSegment, Router}       from "@angular/router";

import {AuthService}                from "lib/services/authService";

@Component({
  selector: 'complete',
  template: require('pages/front/complete/complete.component.html'),
  directives: [],
  providers: [
    HTTP_PROVIDERS,
    AuthService
  ],
  styles: [require('css/complete.component.css'), require('css/front.component.css')]
})
export class CompleteComponent {

  constructor(
    private _router:Router,
    private _authService:AuthService,
    private _routeSegment:RouteSegment) {

  }

  public verifyCode(code:string) {
    this._authService.validateCode(code)
      .subscribe(success => {
        this._router.navigate(['front']);
      }, error => {});
  }

  public sendNewSMS() {
    var email = this._routeSegment.getParam('phone');
    this._authService.resendConfirmEmail(email)
      .subscribe(res => {
        console.log('New email sent');
      });
  }
}
