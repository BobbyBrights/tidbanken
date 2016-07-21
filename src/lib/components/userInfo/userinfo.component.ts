import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS}    from '@angular/http';
import {User} from "../../classes/user";
import myGlobals = require('globals');

@Component({
  selector: 'user-info',
  template: require('lib/components/userInfo/userinfo.component.html'),
  directives: [],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/userinfo.component.css'), require('css/front.component.css')]
})
export class UserInfo  {

  /*
   *  ==================================
   *    INPUT FIELDS
   *  ==================================
   */

  // User model to populate template
  @Input() user: User;


  /*
   *  ==================================
   *    PUBLIC FIELDS
   *  ==================================
   */

  // Base url for static files on server
  public baseUrl:string;


  /*
   *  ==================================
   *    CONSTRUCTOR
   *  ==================================
   */

  constructor() {
    // Sets the base url from globals file
    this.baseUrl = myGlobals.baseURL;
  }
}
