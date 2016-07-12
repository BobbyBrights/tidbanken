import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {FormBuilder, Validators}    from "@angular/common";

import {Job}                        from "lib/classes/job";

@Component({
    selector: 'job',
    template: require('pages/front/post/post.component.html'),
    directives: [],
    providers: [
        HTTP_PROVIDERS
    ],
    styles: [require('css/post.component.css')]
})

export class PostComponent {

    /*  ================================
     *      PUBLIC FIELDS
     *  ================================ */

    public newJob: Job = <Job>{};
    public step: number;

    public jobForm:any;

    constructor(private _router:Router,
                private _formBuilder:FormBuilder) {
        this.step = 0;

        this.jobForm = this._formBuilder.group({
            'title': ['', Validators.required],
            'description': ['', Validators.required],
            'duration': ['', Validators.required],
            'salary': ['', Validators.required]
        });
    };

    /*  ================================
     *      PUBLIC METHODS
     *  ================================ */

    // Step controls
    // ---------------------

    // Next step
    public next() {
        this.step++;
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
        this.step = step;
    }
}
