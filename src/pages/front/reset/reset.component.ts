import {Component, OnInit} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {Router} from '@angular/router'
import {RouteParams} from '@angular/router-deprecated';
import {FormBuilder, Validators} from "@angular/common";

import {ValidationService} from "lib/services/validationService";
import {PopupAlert} from "lib/components/popupalert/popupalert.component";
import {User} from "lib/classes/user";
import {AuthService} from "lib/services/authService";

@Component({
    selector: 'login',
    template: require('pages/front/reset/reset.component.html'),
    directives: [PopupAlert],
    providers: [
        HTTP_PROVIDERS,
        AuthService
    ],
    styles: [require('css/reset.component.css')]
})

export class ResetComponent {
    public user:User = <User>{};
    public resetForm:any;
    public show:{};

    constructor(private _formBuilder:FormBuilder,
                private _authService:AuthService,
                private _routeParams:RouteParams,
                private _router:Router) {
        this.resetForm = this._formBuilder.group({
            'password': ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
            'passwordCheck': ['', Validators.required],
        }, {validator: ValidationService.matchingPasswords('password', 'passwordCheck')});

        this.show = {
            alert: false
        };
    }

    public reset() {
        let token = this._routeParams.get('token');
        this._authService.resetPassword(this.user.password, token)
            .subscribe(res => {
                this.alert();
            });
    }

    // Alert
    public alert() {
        this.toggle('alert');
        setTimeout(() => {
            this.toggle('alert');
            this._router.navigate(['Login']);
        }, 2000)
    }

    public toggle(key) {
        this.show[key] = !this.show[key];
    }
}
