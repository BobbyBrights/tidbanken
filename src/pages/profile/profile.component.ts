import {Component, NgZone}       from '@angular/core';
import {Router, Routes, ROUTER_DIRECTIVES, RouteSegment, RouteTree} from '@angular/router';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

import {User} from "../../lib/classes/user";
import {AuthService} from "../../lib/services/authService";
import myGlobals = require('globals');
import {GeneralProfileComponent} from "./generalProfile/generalprofile.component";
import {PaymentComponent} from "./payment/payment.component";
import {TimeComponent} from "./time/time.component";
import {InviteComponent} from "./invite/invite.component";

@Component({
  selector: 'profile',
  template: require('pages/profile/profile.component.html'),
  styles: [require('css/profile.component.css'), require('css/front.component.css')],
  directives: [ROUTER_DIRECTIVES, UPLOAD_DIRECTIVES],
  providers: [AuthService]
})

//noinspection TypeScriptValidateTypes
@Routes([
  {path: '', component: GeneralProfileComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'time', component: TimeComponent},
  {path: 'invite', component: InviteComponent}
])

export class ProfileComponent {

  /*
   *  ==================================
   *    PUBLIC FIELDS
   *  ==================================
   */

  // User related
  public user:User;

  // Show/hide properties
  public show:{};

  // Base url
  public baseUrl:string;


  // File upload
  zone:NgZone;

  options = {
    fieldName: 'profile_picture',
    method: 'PUT',
    authToken: localStorage.getItem('id_token'),
    authTokenPrefix: "JWT"
  };
  
  dropzone:any;
  imageProgress:number = 0;
  imageResp:any[] = [];

  constructor(private _router:Router,
              private _authService:AuthService) {

    // Hide/show properties
    this.show = {
      userProfile: false
    };

    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;

        this.options['url'] = myGlobals.apiUrl + 'users/' + success.id + '/';

      }, error => {});

    // Sets the base url for static files
    this.baseUrl = myGlobals.baseURL;

    // File upload
    this.zone = new NgZone({enableLongStackTrace: false});
  };

  ngOnInit() {
  }

  public navigate(path) {
    this._router.navigate(path);
  }

  // User related
  public logout() {
    this._authService.logout();
  }

  // Show/hide properties
  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  // File Upload
  public handleDropUpload(data) {
    if (data && data.response) {
      this.user = JSON.parse(data.response);
      this.toggle('userProfile');
    }
  }
}
