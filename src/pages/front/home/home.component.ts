import {Component}                  from '@angular/core';
import {HTTP_PROVIDERS}             from '@angular/http';
import {Router}                     from "@angular/router";
import {SmoothAlert}                from "lib/components/smoothAlert/smoothalert.component";

@Component({
  selector: 'home',
  template: require('pages/front/home/home.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/home.component.css'), require('css/components.css')]
})

export class HomeComponent {
  public show:{};

  constructor(private _router:Router) {
    this.show = {
      alert: false
    };
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public navigate(path) {
    this._router.navigate(['front', path]);
  }

}
