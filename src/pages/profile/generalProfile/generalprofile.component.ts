import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {User} from "../../../lib/classes/user";
import {AuthService} from "../../../lib/services/authService";
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";

@Component({
    selector: 'generalprofile',
    template: require('pages/profile/generalProfile/generalprofile.component.html'),
    directives: [SmoothAlert],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/generalprofile.component.css')]
})

export class GeneralProfileComponent {

    /*
     *  ==================================
     *    PUBLIC FIELDS
     *  ==================================
     */

    // Current user
    public user: User;

    constructor(private _router:Router,
                private _authService:AuthService) {
        // Initializes the current user
        this._authService.getCurrentUser()
            .subscribe(success => {
                // The request was a success
                this.user = success;
            }, error => {
                // Something went wrong
                console.log(error);
            });
    }

    /*
     *  ==================================
     *    PUBLIC METHODS
     *  ==================================
     */

    // Update user information
    public update() {
        this._authService.update(this.user)
            .subscribe(success => {
                console.log("Success");
            }, error => {});
    }
}
