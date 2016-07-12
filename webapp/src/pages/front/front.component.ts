import {Component, NgZone}       from '@angular/core';
import {Router, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

import {User} from "../../lib/classes/user";
import {AuthService} from "../../lib/services/authService";
import myGlobals = require('globals');
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {CompleteComponent} from "./complete/complete.component";
import {ResetComponent} from "./reset/reset.component";
import {AuthComponent} from "./auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {JobsComponent} from "./jobs/jobs.component";
import {JobComponent} from "./job/job.component";
import {PostComponent} from "./post/post.component";

@Component({
  selector: 'front',
  template: require('pages/front/front.component.html'),
  styles: [require('css/front.component.css')],
  directives: [ROUTER_DIRECTIVES, UPLOAD_DIRECTIVES],
  providers: [AuthService]
})

//noinspection TypeScriptValidateTypes
@Routes([
  {path: '', component: HomeComponent},
  {path: 'jobs', component: JobsComponent},
  {path: 'job', component: JobComponent},
  {path: 'post', component: PostComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'complete/:email', component: CompleteComponent},
  {path: 'auth/:token', component: AuthComponent},
  {path: 'reset-password/:token', component: ResetComponent}
])

export class FrontComponent {

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
    url: myGlobals.apiUrl + 'users/',
    fieldName: 'user_profile.profile_picture',
    method: 'PUT',
    withCredentials: true,
    authToken: localStorage.getItem('id_token'),
    authTokenPrefix: "JWT"
  };
  dropzone:any;
  imageProgress:number = 0;
  imageResp:any[] = [];

  constructor(
    private _router:Router,
    private _authService:AuthService) {

    // Hide/show properties
    this.show = {
      userProfile:false
    }

    // Sets the base url for static files
    this.baseUrl = myGlobals.baseURL;

    // File upload
    this.zone = new NgZone({enableLongStackTrace: false});

  };

  ngOnInit() {}

  public navigate(path) {
    this._router.navigate(['front', path]);
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
