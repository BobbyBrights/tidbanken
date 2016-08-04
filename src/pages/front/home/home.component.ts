import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";

import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";
import {AuthService}                from "lib/services/authService";
import {User}                       from "lib/classes/user";

@Component({
  selector: 'home',
  template: require('pages/front/home/home.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/home.component.css'), require('css/components.css')]
})

export class HomeComponent {
  public show:{};
  public user: User;

  // Alert
  public alertOptions:{};

  constructor(private _router:Router,
              private _authService:AuthService) {
    this.show = {
      alert: false,
      smoothAlert:false
    };

    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;
      }, error => {});
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public strictNavigate(path) {
    if (this.user) {
      if (this.user.has_completed_profile) {
        this._router.navigate(path);
      } else {

        this.alertOptions = {
          type: 'warning',
          title: 'Fyll ut din profil',
          text: 'Før du får lov til å gå videre trenger vi at du fyller ut litt mer informasjon på din profil',
          showAccept: true,
          acceptText: 'Fyll ut profil'
        };
        
        this.toggle('smoothAlert');
      }
    } else {
      this.toggle('alert');
    }
  }

  public navigate(path) {
    this._router.navigate(path);
  }
}
