import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from '@angular/router';
import {Job}                        from 'lib/classes/job';
import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  MouseEvent,
  GOOGLE_MAPS_PROVIDERS,
  GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

import {JwtHelper} from 'angular2-jwt/angular2-jwt';
import {JobService} from "../../../lib/services/jobService";
import myGlobals = require('globals');
import {MapComponent} from "../../../lib/components/map/map.component";

@Component({
  selector: 'jobs',
  template: require('pages/front/jobs/jobs.component.html'),
  directives: [GOOGLE_MAPS_DIRECTIVES, MapComponent],
  providers: [
    HTTP_PROVIDERS,
    JobService
  ],
  styles: [require('css/jobs.component.css'), require('css/front.component.css')]
})

export class JobsComponent {

  public jobs:Job[] = <Job[]>{};
  public places:any[];
  public categories:any[];
  public show:{};

  private _jwtHelper:JwtHelper = new JwtHelper();

  public baseUrl:string;

  // Google maps
  // ------------------------

  // google maps zoom level

  public mapMarkers:any[];
  public mapOptions:{};

  zoom:number = 8;

  // initial center position for the map
  lat:number = 51.673858;
  lng:number = 7.815982;

  constructor(private _router:Router,
              private _jobService:JobService) {

    this.places = [
      {name: "Trondheim"},
      {name: "Oslo"},
      {name: "Stavanger"},
      {name: "Ålesund"},
      {name: "Bergen"},
      {name: "Tromsø"},
    ];

    this.categories = [
      {name: "Gå tur"},
      {name: "Vaske hus"},
      {name: "Brettspill"},
      {name: "Dyrepass"},
      {name: "Dekkskift"},
      {name: "Matlaging"},
    ];

    // Google maps
    // ------------------------
    this.mapOptions = {
      lat: 59.925508,
      lng: 10.674286,
      zoom: 12
    }

    this.baseUrl = myGlobals.baseURL;

    this.show = {
      map: false
    };

    this.jobs = [];

    this._jobService.getJobs()
      .subscribe(success => {
        this.jobs = success;

        // Generates markers for map
        this.mapMarkers = [];
        this.jobs.forEach(job => {
          this.mapMarkers.push({lat:job.lat, lng:job.lng, label: 'A', draggable:false});
        });
      });
  };

  public openJob(jobId:number) {
    var token = localStorage.getItem('id_token');

    if (!token || this._jwtHelper.isTokenExpired(token)) {
      this._router.navigate(['front', 'login']);
      return;
    }

    this._router.navigate(['front', 'job', jobId]);
  }

  // Show attribute
  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public showObject(key) {
    this.show[key] = true;
  }

  public hideObject(key) {
    this.show[key] = false;
  }

  public timeSince(d:string) {

    var date = new Date(d);

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " år";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " måneder";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " dager";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " timer";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutter";
    }
    return Math.floor(seconds) + " sekunder";
  }
}
