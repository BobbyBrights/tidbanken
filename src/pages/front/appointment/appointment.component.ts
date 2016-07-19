import {Component, ViewChild, ElementRef}                 from '@angular/core';
import {HTTP_PROVIDERS}                                   from '@angular/http';
import {RouteSegment}                                     from "@angular/router";

import {SmoothAlert}                                      from "lib/components/smoothAlert/smoothalert.component";

import {AuthService}                                      from "lib/services/authService";
import {JobService}                                       from "lib/services/jobService";
import {Appointment}                                      from "lib/classes/appointment";
import {Message}                                          from "lib/classes/message";
import {Room}                                             from "lib/classes/room";
import {User}                                             from "lib/classes/user";
import {Observable}                                       from "rxjs/Rx";

import myGlobals = require('globals');

@Component({
  selector: 'appointment',
  template: require('pages/front/appointment/appointment.component.html'),
  directives: [SmoothAlert],
  providers: [
    HTTP_PROVIDERS,
    JobService,
    AuthService
  ],
  styles: [require('css/appointment.component.css'), require('css/front.component.css')]
})

export class AppointmentComponent {

  @ViewChild('chatScroll') private myScrollContainer:ElementRef;

  public show:{};
  public appointment:Appointment;
  public user:User = <User>{};

  public baseUrl:string;

  public socket:any;


  // Chat related
  // -------------------
  public room: Room;
  public messages: Message[] = [];
  public newMessage: string;

  constructor(private _routeSegment:RouteSegment,
              private _jobService:JobService,
              private _authService:AuthService) {
    this.show = {
      alert: false
    };

    this.baseUrl = myGlobals.baseURL;
    this.messages = [];

    let appointment_id = this._routeSegment.getParam('id');

    this._authService.getCurrentUser()
      .subscribe(success => {
        this.user = success;
      }, error => {});

    this._jobService.getAppointment(appointment_id)
      .subscribe(success => {
        this.appointment = success;

        this._jobService.getRoom(success.job.id, success.user.id)
          .subscribe(success => {
            this.room = success;

            // Web socket
            // ---------------------

            // Connect the web socket
            this.connectWebsocket(this.room.id);

            this._jobService.getMessages(success.id)
              .subscribe(success => {
                this.messages = success.reverse();

                setTimeout(() => {
                  this.scrollToBottom(true);
                }, 200);

              }, error => {});
          }, error => {});
      }, error => {
        console.log(error);
      });
  }

  public toggle(key) {
    this.show[key] = !this.show[key];
  }

  public checkStatus(status:number, check:number) {
    return status == check
  }

  public covertDate(date) {
    return new Date(date);
  }

  public accept() {
    this.appointment.status = 1;
    this.update();
  }

  public decline() {
    this.appointment.status = 2;
    this.update();
  }

  public update() {
    this._jobService.updateAppointment(this.appointment)
      .subscribe(success => {
      }, error => {
      });
  }

  // Web socket & chat
  // ---------------------

  public connectWebsocket(room_id:number) {
    this.socket = new WebSocket("ws://localhost:8000/chat/" + room_id + "/?token=" + localStorage.getItem('id_token'));


    // This function returns an observable that is triggered by the websockets onMessage
    this.getInstanceStatus()
      .subscribe(success => {
        this.setMessageAsRead();
      }, error => {});
  }

  public getInstanceStatus(): Observable<Event>{
    return Observable.create(observer => {
      this.socket.onmessage = (evt) => {
        observer.next(evt);
      };
    })
      .share();
  }

  public setMessageAsRead() {
    // Sets the latest message sent to server to read

    this.scrollToBottom(true);

    if (this.messages.length)
      this.messages[this.messages.length-1].is_waiting = false;
  }

  public scrollToBottom(forceScroll:boolean):void {

    try {
      var el = this.myScrollContainer.nativeElement;

      if (forceScroll || el.scrollTop >= (el.scrollHeight - el.offsetHeight - 100)) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
    }
  }

  public sendMessage(text:string) {
    var msg = {
      "token": localStorage.getItem('id_token'),
      "text": text,
      "user_id": this.user.id,
      "is_waiting": true
    };

    this.socket.send(JSON.stringify(msg));

    this.messages.push(msg);

    // Deletes the old message
    this.newMessage = '';

    // Scrolls to the bottom of the page
    this.scrollToBottom(true);
  }

  public checkPress(event, text) {

    // Checks if the key code is equal of that of enter
    if (event.keyCode == 13 && !event.shiftKey) {

      this.sendMessage(text);

      //Prevents line shift in text area
      event.preventDefault();
    }
  }

  public checkOwner(user_id:number) {
    return this.user.id == user_id;
  }

  public showPicture(message:Message) {
    var index = this.messages.indexOf(message);

    if (index == this.messages.length - 1)
      return true;

    return this.messages[index+1].user_id != message.user_id;
  }

  public getProfilePicture(msg:Message) {
    return (this.showPicture(msg)) ? this.user.profile_picture : '';
  }

  // Stripe related
  // ---------------------

  public openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      locale: 'auto',
      image: 'http://design.ubuntu.com/wp-content/uploads/ubuntu-logo32.png',
      currency: 'NOK',
      token: function (token:any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'Tidbanken',
      description: '2 widgets',
      amount: 2000
    });
  }
}
