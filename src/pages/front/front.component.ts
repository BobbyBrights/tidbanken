import {Component, NgZone}                      from '@angular/core';
import {Router, Routes, ROUTER_DIRECTIVES}      from '@angular/router';
import {UPLOAD_DIRECTIVES}                      from 'ng2-uploader/ng2-uploader';

import {User}                                   from "lib/classes/user";
import {AuthService}                            from "lib/services/authService";
import {LoginComponent}                         from "./login/login.component";
import {RegisterComponent}                      from "./register/register.component";
import {CompleteComponent}                      from "./complete/complete.component";
import {ResetComponent}                         from "./reset/reset.component";
import {AuthComponent}                          from "./auth/auth.component";
import {HomeComponent}                          from "./home/home.component";
import {JobsComponent}                          from "./jobs/jobs.component";
import {JobComponent}                           from "./job/job.component";
import {PostComponent}                          from "./post/post.component";
import {MyAppointments}                         from "./myappointments/myappointments.component";
import {MyJobsComponent}                        from "./myjobs/myjobs.component";
import myGlobals = require('globals');
import {AppointmentComponent} from "./appointment/appointment.component";
import {UserComponent} from "./user/user.component";
import {SmoothAlert} from "../../lib/components/smoothAlert/smoothalert.component";
import {RequestService} from "../../lib/services/requestService";

@Component({
  selector: 'front',
  template: require('pages/front/front.component.html'),
  styles: [require('css/front.component.css')],
  directives: [ROUTER_DIRECTIVES, UPLOAD_DIRECTIVES, SmoothAlert],
  providers: [AuthService]
})

//noinspection TypeScriptValidateTypes
@Routes([
  {path: '', component: HomeComponent},
  {path: 'jobs', component: JobsComponent},
  {path: 'job/:id', component: JobComponent},
  {path: 'appointments', component: MyAppointments},
  {path: 'appointment/:id', component: AppointmentComponent},
  {path: 'myjobs', component: MyJobsComponent},
  {path: 'post', component: PostComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'complete/:phone', component: CompleteComponent},
  {path: 'auth/:token', component: AuthComponent},
  {path: 'reset-password/:token', component: ResetComponent},
  {path: 'user/:id', component: UserComponent}
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

  // Smooth alert
  public alertOptions:{};

  // File upload
  zone:NgZone;

  options = {
    url: myGlobals.apiUrl + 'users/',
    fieldName: 'profile_picture',
    method: 'PUT',
    authToken: localStorage.getItem('id_token'),
    authTokenPrefix: "JWT"
  };
  dropzone:any;
  imageProgress:number = 0;
  imageResp:any[] = [];

  constructor(
    private _router:Router,
    private _authService:AuthService,
    private _requestService:RequestService) {

    // Hide/show properties
    this.show = {
      userProfile:false
    };

    this._requestService.registerWatcher(this);

    // Get current user
    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;

        // Set correct view for file upload
        this.options.url = myGlobals.apiUrl + 'users/' + success.id + '/image-upload/';
      }, error => {});

    // Sets the base url for static files
    this.baseUrl = myGlobals.baseURL;

    // File upload
    this.zone = new NgZone({enableLongStackTrace: false});

  };

  ngOnInit() {}

  public strictNavigate(path) {
    if (this.user.has_completed_profile)
      this._router.navigate(path);
    else {
      this.alertOptions = {
        type: 'warning',
        title: 'Fyll ut din profil',
        text: 'Før du får lov til å gå videre trenger vi at du fyller ut litt mer informasjon på din profil',
        showAccept: true,
        acceptText: 'Fyll ut profil'
      };

      this.toggle('alert');
    }
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

  public alertUpdate() {
    // Get current user
    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;

        // Set correct view for file upload
        this.options.url = myGlobals.apiUrl + 'users/' + success.id + '/image-upload/';
      }, error => {});
  }
}
