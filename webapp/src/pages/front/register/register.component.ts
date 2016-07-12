import {Component, OnInit} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {FormBuilder, Validators} from "@angular/common";
import {Router} from "@angular/router";

import {User} from "lib/classes/user";
import {AuthService} from "lib/services/authService";
import {ValidationService} from "lib/services/validationService";

@Component({
    selector: 'register',
    template: require('pages/front/register/register.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS,
        AuthService
    ],
    styles: [require('css/register.component.css')]
})
export class RegisterComponent {
    public newUser: User = <User>{};
    public registerForm:any;
    public serverErrors: {} = {};

    constructor(
        private _authService:AuthService,
        private _formBuilder:FormBuilder,
        private _router:Router
    ) {

        // Registration form
        // --------------------------------------
        this.registerForm = this._formBuilder.group({
            'first_name':['', Validators.required],
            'last_name':['', Validators.required],
            'username':['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            'password':['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
            'passwordCheck':['', Validators.required],
        }, {validator: ValidationService.matchingPasswords('password', 'passwordCheck')});
    }

    // Function used to register company
    public register() {
        this._authService.register(this.newUser)
            .subscribe(success => {
                // The user is successfully registered
            }, error => {
                // Something unexpected happened
                this.serverErrors = error.json();
            });
    }
}
