import {Component, NgZone}                  from '@angular/core';
import {HTTP_PROVIDERS}                     from '@angular/http';
import {Router, RouteSegment}               from "@angular/router";
import {Validators, FormBuilder}            from "@angular/common";

import {UPLOAD_DIRECTIVES}                  from 'ng2-uploader/ng2-uploader';
import {Job}                                from "lib/classes/job";
import {JobService}                         from "lib/services/jobService";
import {AuthService}                        from "lib/services/authService";
import {User}                               from "lib/classes/user";
import {Datepicker}                         from "lib/components/datepicker/datepicker";
import {Appointment}                        from "lib/classes/appointment";
import {ValidationService}                  from "lib/services/validationService";
import {UserInfo}                           from "lib/components/userInfo/userinfo.component";
import {MapComponent}                       from "lib/components/map/map.component";

import myGlobals = require('globals');
import {SmoothAlert} from "../../../lib/components/smoothAlert/smoothalert.component";
import {TimeSuggestion} from "../../../lib/components/timesuggestion/timesuggestion.component";

@Component({
  selector: 'job',
  template: require('pages/front/job/job.component.html'),
  directives: [TimeSuggestion, UPLOAD_DIRECTIVES, SmoothAlert, UserInfo, MapComponent],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/job.component.css'), require('css/front.component.css'), require('css/components.css')]
})

export class JobComponent {

  /*
   *  ==================================
   *    PUBLIC FIELDS
   *  ==================================
   */

  // Job related
  // --------------------------
  public job:Job = <Job>{};
  public author:User = <User>{};

  // Appointment related
  // --------------------------
  public appointment:Appointment = <Appointment>{};

  // User related
  // ---------------------------
  public user:User = <User>{};

  // Map
  // ---------------------------
  public mapOptions:{};
  public mapMarkers:any[];

  // Other
  // ---------------------------
  public baseUrl:string;
  public show:{} = {};


  // Smooth alert
  // --------------------
  public alertOptions:any;

  // File upload
  // --------------------
  zone:NgZone;

  options = {
    url: myGlobals.apiUrl + 'jobs/',
    fieldName: 'picture',
    method: 'PUT',
    authToken: localStorage.getItem('id_token'),
    authTokenPrefix: "JWT"
  };

  dropzone:any;
  imageProgress:number = 0;
  imageResp:any[] = [];

  /*
   *  ==================================
   *    CONSTRUCTOR
   *  ==================================
   */

  constructor(private _router:Router,
              private _jobService:JobService,
              private _routeSegment:RouteSegment,
              private _formBuilder:FormBuilder,
              private _authService:AuthService) {

    // File upload
    this.zone = new NgZone({enableLongStackTrace: false});

    this.baseUrl = myGlobals.baseURL;

    let job_id = this._routeSegment.getParam('id');

    // User related
    // -----------------------
    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;
      }, error => {});


    // Job related
    // ------------------------
    this._jobService.getJob(job_id)
      .subscribe(success => {
        // The request was successful
        this.job = success;

        // Map
        // -----------------------

        // Map markers
        this.mapMarkers = [
          {lat:this.job.lat, lng:this.job.lng, label:'A', draggable:false}
        ];

        // Positioning of map
        this.mapOptions = {
          lat:this.job.lat,
          lng:this.job.lng,
          zoom:14
        };

        // Set correct url for file upload
        this.options.url = myGlobals.apiUrl + 'jobs/' + success.id + '/';

        this._authService.getUser(this.job.user_id)
          .subscribe(success => {
            this.author = success;
          }, error => {
          });
      }, error => {
      });
  };

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  // Job related
  // -----------------

  public publish() {

    // Sets the status of the job to published
    this.job.is_published = true;

    // Calls the update method to publish the job
    this.updateJob();
  }

  public updateJob() {

    this.toggle('edit');

    this._jobService.update(this.job)
      .subscribe(success => {

        this.alertOptions = {
          title: 'Oppdatert',
          showAccept: true,
          acceptText: 'Lukk',
          type: 'success',
          text: 'Jobben din er nå oppdatert!'
        };

        this.toggle('alert');
      }, error => {
        this.alertOptions = {
          title: 'Oppdatert',
          showAccept: true,
          acceptText: 'Lukk',
          type: 'error',
          text: 'Noe gikk galt! Jobben ble ikke oppdatert. Hvis dette problemet vedvarer vennligst ta kontakt med support.'
        };

        this.toggle('alert');
      });
  }

  public strictNavigate() {
    if (this.user.has_completed_profile)
      this.toggle('appointment');
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

  public checkOwner() {

    /*
     *
     * ======================================
     *  This method is used to check if the current
     *  user is the owner of the job. In the template
     *  it is used to display different buttons.
     * ======================================
     *
     */

    // Returns if the user is the owner of the job
    return this.user.id == this.job.user_id;
  }

  // Appointment related
  // ------------------------

  public createAppointment(data:any) {

    data.newDate.setHours(data.newHour, data.newMin, 0);
    data.newDate.setTime(data.newDate.getTime() - data.newDate.getTimezoneOffset() * 60 * 1000);

    this.appointment.date = data.newDate.toISOString();
    this.appointment.job = this.job.id;
    this.appointment.time_amount = this.job.duration;

    this._jobService.createAppointment(this.appointment)
      .subscribe(success => {
        this.toggle('appointment');

        this.alertOptions = {
          title: 'Interesse meldt',
          showAccept: true,
          acceptText: 'Lukk',
          type: 'success',
          text: 'Du har nå meldt interesse for denne jobben. Dine avtaler kan du finne under Mine avtaler'
        };

        this.toggle('alert');
      }, error => {
      });
  }

  // Share button
  // ---------------------

  public getShareUrl() {
    return window.location.protocol + '//' + window.location.host + this._router.serializeUrl(this._router.urlTree);
  }

  // File Upload
  // ---------------------

  public handleDropUpload(data) {
    if (data && data.response) {
      this.toggle('edit');
      this.job.picture = JSON.parse(data.response).picture;

      this.alertOptions = {
        title: 'Oppdatert',
        showAccept: true,
        acceptText: 'Lukk',
        type: 'success',
        text: 'Bildet er nå oppdatert!'
      };

      this.toggle('alert');
    }
  }
}
