import 'rxjs/Rx';
import {Component, OnInit}                  from '@angular/core';
import {Routes, ROUTER_DIRECTIVES, Router}  from '@angular/router';
import {NgClass}                            from "@angular/common";

// Components
// ----------------------
import {FrontComponent} from "../pages/front/front.component";
import {ProfileComponent} from "../pages/profile/profile.component";

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['css/app.component.css'],
  directives: [ROUTER_DIRECTIVES, NgClass],
  providers: []
})

//noinspection TypeScriptValidateTypes
@Routes([
  {path: 'profile', component: ProfileComponent},
  {path: 'front', component: FrontComponent},
])

export class AppComponent implements OnInit {

  constructor(private _router:Router) {};

  ngOnInit() {
    this._router.changes.subscribe(val => {
      window.scrollTo(0, 0);
    });
  }
}
