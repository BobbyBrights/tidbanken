import {Injector} from 'angular2/core';
import {appInjector} from '../injectors/appInjector';
import {Router, ComponentInstruction} from 'angular2/router';
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";

export const isLoggedIn = (next: ComponentInstruction, previous: ComponentInstruction) => {
    let injector: Injector = appInjector(); // get the stored reference to the injector
    let router: Router = injector.get(Router);

  // return a boolean or a promise that resolves a boolean
    return new Promise((resolve) => {

        if (tokenNotExpired()) {
            resolve(true);
        } else {
            router.navigate(['Login']);
            resolve(false);
        }

  });
};

