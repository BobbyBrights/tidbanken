/*
 * Providers provided by Angular
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import 'rxjs/Rx';

/*
 * Platform and Environment
 * our providers/directives/pipes
 */

import { ENV_PROVIDERS } from './platform/environment';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './lib/app.component.ts';
import {DIRECTIVES} from "./platform/browser/directives";
import {PIPES} from "./platform/browser/pipes";
import {PROVIDERS} from "./platform/browser/providers";

/*
 * Other imports
 */

import {provide, enableProdMode, ComponentRef} from '@angular/core';
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {ROUTER_PROVIDERS} from "@angular/router";
import {RequestService} from "./lib/services/requestService";

/*
 * Bootstrap our Angular app with a top level component `AppComponent` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(initialHmrState?: any): Promise<any> {

  //noinspection TypeScriptValidateTypes
  return bootstrap(AppComponent, [
    ...PROVIDERS,
    ...ENV_PROVIDERS,
    ...DIRECTIVES,
    ...PIPES,
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    RequestService,
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          headerPrefix: 'JWT'
        }), http);
      },
      deps: [Http]
    }),
    provide(Window, {useValue: window})
  ])
    .catch(err => console.error(err));

}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */

/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */

if ('development' === ENV && HMR === true) {

  // activate hot module reload
  let ngHmr = require('angular2-hmr');
  ngHmr.hotModuleReplacement(main, module);

} else {

  // Enables the production mode
  enableProdMode();

  // bootstrap when document is ready
  document.addEventListener('DOMContentLoaded', () => main());
}
