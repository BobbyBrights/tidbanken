import {Component} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {Router}            from '@angular/router';
import {FormBuilder, Validators} from "@angular/common";

import {User}              from 'lib/classes/user';
import {AuthService}       from 'lib/services/authService';
import {ValidationService} from "lib/services/validationService";
import {PopupAlert} from "lib/components/popupalert/popupalert.component";
import {mapToIterablePipe} from "../../../lib/pipes/mapToIterable";
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";

@Component({
  selector: 'login',
  template: require('pages/front/login/login.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    AuthService
  ],
  pipes: [mapToIterablePipe],
  styles: [require('css/login.component.css'), require('css/front.component.css')]
})

export class LoginComponent {
  public user:User = <User>{};
  public serverErrors:{};
  public loginForm:any;
  public show:{};

  // Alert fields
  public alertText: string;
  public alertType: string;

  constructor(private _authService:AuthService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    this.loginForm = this._formBuilder.group({
      'username': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      'password': ['', Validators.required]
    });
    this.serverErrors = {};
    this.show = {
      login: true,
      forgot: false,
      alert: false
  }
  };

  // Global functions
  login() {
    this._authService.login(this.user.phone, this.user.password)
      .subscribe(res => {
        // The user is logged in!
      }, error => {
        // Revieles the error to the user
        this.serverErrors = error.json();

        this.alertText = 'Obs, noe gikk galt. Følgende feilmelding er sendt fra server: ' + this.serverErrors;
        this.alertType = 'error';
        this.toggle('alert');
      });
  }

  public sendMail() {
    this._authService.sendResetPassword(this.user.phone)
      .subscribe(res => {
        this.alert();
      });
  }

  // Alert
  public alert() {
    this.toggle('alert');
    setTimeout(() => {
      this.toggle('alert');
    }, 2000)
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
