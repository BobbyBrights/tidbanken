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


@Component({
    selector: 'jobs',
    template: require('pages/front/jobs/jobs.component.html'),
    directives: [GOOGLE_MAPS_DIRECTIVES],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/jobs.component.css'), require('css/front.component.css')]
})

export class JobsComponent {

    public jobs: Job[] = <Job[]>{};
    public places: any[];
    public categories: any[];
    public show: {};

    private _jwtHelper:JwtHelper = new JwtHelper();

    // Google maps
    // ------------------------

    // google maps zoom level
    zoom: number = 8;

    // initial center position for the map
    lat: number = 51.673858;
    lng: number = 7.815982;

    constructor(private _router:Router) {

        this.jobs = [
            new Job("Vaske hus og plen", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Gå en tur i mørket", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Spille sjakk", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Snakke japansk", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Høre på historier", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
            new Job("Være min venn", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "http://kingofwallpapers.com/happy/happy-007.jpg"),
        ];

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

        this.show = {
            map: false
        }
    };

    public openJob(jobId:number) {
        var token = localStorage.getItem('id_token');

        if (!token || this._jwtHelper.isTokenExpired(token)) {
            this._router.navigate(['front', 'login']);
            return;
        }

        this._router.navigate(['job', jobId]);
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
}
