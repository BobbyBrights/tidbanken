import 'rxjs/Rx';
import {Injectable}     from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from "@angular/router";

import {User}           from '../classes/user';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import myGlobals = require('globals');
import {RequestService} from "./requestService";
import {Job} from "../classes/job";

@Injectable()
export class JobService {

    private _apiEndpoint = myGlobals.apiUrl + 'jobs/';  // URL to web api

    constructor(private _requestService:RequestService,
                private _router:Router) {
    }

    public create(job:Job) {
        return this._requestService.request('POST', this._apiEndpoint, null, job)
            .map(res => <Job> res.json());
    }

    public getJobs() {
        return this._requestService.request('GET', this._apiEndpoint, 'allJobs')
            .map(res => <Job[]> res.json().results);
    }

    public getJob(job_id:string) {

        return this._requestService.request('GET', this._apiEndpoint + job_id + '/')
            .map(res => <Job> res.json());
    }

    public getCurrentUser() {

        var key = 'currentUsers';

        return this._requestService.request('GET', this._apiEndpoint + 'current-user/', key)
            .map(res => <User> res.json());
    }
}
