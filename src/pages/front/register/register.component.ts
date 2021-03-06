import {Component, OnInit} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {FormBuilder, Validators} from "@angular/common";
import {Router} from "@angular/router";

import {User} from "lib/classes/user";
import {AuthService} from "lib/services/authService";
import {ValidationService} from "lib/services/validationService";
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";

@Component({
  selector: 'register',
  template: require('pages/front/register/register.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    AuthService
  ],
  styles: [require('css/register.component.css'), require('css/front.component.css')]
})
export class RegisterComponent {
  public newUser:User = <User>{};
  public registerForm:any;

  // Show and hide properties
  // --------------------------------------
  public show:{};

  // Alert related
  // --------------------------------------
  public alertOptions:any;

  constructor(private _authService:AuthService,
              private _formBuilder:FormBuilder,
              private _router:Router) {

    // Registration form
    // --------------------------------------
    this.registerForm = this._formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'username': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      'password': ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
      'passwordCheck': ['', Validators.required],
    }, {validator: ValidationService.matchingPasswords('password', 'passwordCheck')});

    // Show and hide properties
    // --------------------------------------
    this.show = {
      alert: false
    }
  }

  // Function used to register company
  public register() {

    // Sets the authentication method to phone for now
    this.newUser.auth_method = 'phone';

    // Sends the data to the server and waits for response
    this._authService.register(this.newUser)
      .subscribe(success => {
        // The user is successfully registered
        this._router.navigate(['front', 'complete', success.phone]);
      }, error => {

        this.alertOptions = {
          type: 'error',
          text: 'Din bruker ble ikke registrert. Følgende feil medførte dette:',
          serverErrors: error.json(),
          showAccept: true,
          acceptText: 'Lukk'
        };

        this.toggle('alert');
      });
  }

  public toggle(key:string) {
    this.show[key] = !this.show[key];
  }
}
