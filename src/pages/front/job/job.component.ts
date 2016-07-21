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

@Component({
  selector: 'job',
  template: require('pages/front/job/job.component.html'),
  directives: [Datepicker, UPLOAD_DIRECTIVES, SmoothAlert, UserInfo, MapComponent],
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
  public newDate:Date;
  public newHour:number;
  public newMin:number;
  public hours:number[];
  public quarters:number[];
  public timeForm:any;
  public soknadsfrist = "";

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
    this.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    this.quarters = [0, 15, 30, 45];

    this.newHour = -1;
    this.newMin = -1;

    this.timeForm = this._formBuilder.group({
      'hour': ['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
      'minute': ['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
    });

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

  public dateChanged(event) {

    this.newDate = event.value;

    this.newDate.setHours(12, 0, 0);
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

  public createAppointment() {

    this.newDate.setHours(this.newHour, this.newMin, 0);
    this.newDate.setTime(this.newDate.getTime() - this.newDate.getTimezoneOffset() * 60 * 1000);

    this.appointment.date = this.newDate.toISOString();
    this.appointment.job = this.job.id;
    this.appointment.time_amount = this.job.duration;

    this._jobService.createAppointment(this.appointment)
      .subscribe(success => {

      }, error => {
      });
  }

  // File Upload
  // ---------------------

  public handleDropUpload(data) {
    if (data && data.response) {
      this.toggle('edit');
      this.job = JSON.parse(data.response);

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
