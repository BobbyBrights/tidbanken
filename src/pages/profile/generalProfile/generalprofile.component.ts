import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {FormBuilder, Validators}    from "@angular/common";

import {User}                       from "lib/classes/user";
import {AuthService}                from "lib/services/authService";
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";

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
  public user:User;
  public userForm:any;

  // Smooth alert
  public show:{};
  public alertOptions:{};

  constructor(private _router:Router,
              private _authService:AuthService,
              private _formBuilder:FormBuilder) {

    this.userForm = this._formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'about': ['', Validators.required],
      'phone': ['', Validators.required],
      'age': ['', Validators.required]
    });

    this.show = {};

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

    // Sets the profile to compleated, since all fields in form needs to be valid for this function to be triggered
    this.user.has_completed_profile = true;

    this._authService.update(this.user)
      .subscribe(success => {
        console.log("Success");

        this.alertOptions = {
          title: 'Oppdatert',
          showAccept: true,
          acceptText: 'Lukk',
          type: 'success',
          text: 'Din profil er nå oppdatert. Takk skal du ha.'
        };

        this.toggle('alert');

      }, error => {
      });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }
}
