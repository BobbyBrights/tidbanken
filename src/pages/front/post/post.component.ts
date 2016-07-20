import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {FormBuilder, Validators}    from "@angular/common";

import {Job}                        from "lib/classes/job";
import {JobService}                 from "lib/services/jobService";
import {GoogleplaceDirective}       from "lib/directives/googlePlace";

@Component({
  selector: 'job',
  template: require('pages/front/post/post.component.html'),
  directives: [GoogleplaceDirective],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/post.component.css'), require('css/front.component.css')]
})

export class PostComponent {

  /*  ================================
   *      PUBLIC FIELDS
   *  ================================ */

  // Step control
  // ------------------------
  public step:number;
  public latestStep:number;

  // Job related
  // ------------------------
  public jobForm:any;
  public newJob:Job = <Job>{};
  public hours:number[];

  // Tag related
  // ------------------------
  public tagString:string;

  constructor(private _router:Router,
              private _jobService:JobService,
              private _formBuilder:FormBuilder) {
    this.step = 0;
    this.latestStep = this.step;

    this.newJob.tags = [];

    this.jobForm = this._formBuilder.group({
      'title': ['', Validators.required],
      'description': ['', Validators.required],
      'duration': ['', Validators.required],
      'street_address': ['', Validators.required],
      'city': ['', Validators.required],
      'postal_code': ['', Validators.required],
    });

    this.hours = [1, 2, 4, 8];
  };

  /*  ================================
   *      PUBLIC METHODS
   *  ================================ */

  // Step controls
  // ---------------------

  // Next step
  public next() {
    this.step++;

    if (this.step > this.latestStep)
      this.latestStep = this.step;
  }

  // Previous step
  public prev() {
    this.step--;
  }

  // Check current step
  public checkStep(step:number) {
    return this.step == step;
  }

  // Set spesific step
  public setStep(step:number) {
    if (step <= this.latestStep)
      this.step = step;
  }

  // Job related
  // ---------------------

  // Post the job
  public postJob() {
    this._jobService.create(this.newJob)
      .subscribe(success => {

      }, error => {
      });
  }

  public setDuration(duration:number) {
    this.newJob.duration = duration;
    this.next();
  }

  public getAddress(place:Object) {
    this.newJob.street_address = place['formatted_address'];
  }

  // Tags related
  // ----------------------
  public addTag(tag:string) {
    if (this.newJob.tags.indexOf(tag) == -1)
      this.newJob.tags.push(tag);
  }

  public removeTag(tag:string) {
    var index = this.newJob.tags.indexOf(tag);
    this.newJob.tags.splice(index, 1);
  }

  public checkPress(event, text) {

    console.log(event.keyCode);
    // Checks if the key code is equal of that of enter
    if (event.keyCode == 32 || event.keyCode == 13) {

      this.addTag(text);

      this.tagString = '';

      //Prevents line shift in text area
      event.preventDefault();
    }
  }
}
