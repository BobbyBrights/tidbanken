import {Component, ViewChild, ElementRef}                 from '@angular/core';
import {HTTP_PROVIDERS}                                   from '@angular/http';
import {Router, RouteSegment}                             from "@angular/router";

import {SmoothAlert}                                      from "lib/components/smoothAlert/smoothalert.component";

import {AuthService}                                      from "lib/services/authService";
import {JobService}                                       from "lib/services/jobService";
import {Appointment}                                      from "lib/classes/appointment";
import {Message}                                          from "lib/classes/message";
import {Room}                                             from "lib/classes/room";
import {User}                                             from "lib/classes/user";
import {Rating}                                           from "lib/classes/rating";
import {Observable}                                       from "rxjs/Rx";
import {UserInfo}                                         from "lib/components/userInfo/userinfo.component";

import myGlobals = require('globals');
import {TimeSuggestion} from "../../../lib/components/timesuggestion/timesuggestion.component";

@Component({
  selector: 'appointment',
  template: require('pages/front/appointment/appointment.component.html'),
  directives: [SmoothAlert, UserInfo, TimeSuggestion],
  providers: [
    HTTP_PROVIDERS,
    JobService,
    AuthService
  ],
  styles: [require('css/appointment.component.css'), require('css/front.component.css'), require('css/components.css')]
})

export class AppointmentComponent {

  @ViewChild('chatScroll') private myScrollContainer:ElementRef;

  public baseUrl:string;

  public socket:any;

  // Appointment related
  // -----------------------
  public appointment:Appointment;
  public user:User = <User>{};
  public isOwner:boolean;

  // Show and hide
  // -------------------
  public show:{};

  // Rating
  // -------------------
  public rating:Rating = <Rating>{};


  // Chat related
  // -------------------
  public room: Room;
  public messages: Message[] = [];
  public newMessage: string;

  // Alert
  // --------------------------
  public alertOptions:any;

  constructor(private _router:Router,
              private _routeSegment:RouteSegment,
              private _jobService:JobService,
              private _authService:AuthService) {
    this.show = {
      alert: false,
      payment: false
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

        this.isOwner = (this.appointment.job.user_id == this.user.id);

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

  public showAlert(accept:boolean):void {

    this.alertOptions = {
      type: 'warning',
      title: 'Er du sikker?',
      showDecline:true,
      showAccept: true,
      declineText: 'Tilbake',
      acceptText: 'Fortsett',
      data: {accept: true}
    };

    if (accept) {
      this.alertOptions.text = 'Du er i ferd med å godkjenne avtalen. Vil du fortsette?';
      this.alertOptions.data = {accept: true};
    } else {
      this.alertOptions.text = 'Du er i ferd med å avslå avtalen. Vil du fortsette?';
      this.alertOptions.data = {accept: false};
    }

    this.toggle('alert');
  }

  public handleAlertResponse(data) {

    this.toggle('alert');

    if (!data)
      return

    if (data.accept)
      this.accept();
    else
      this.decline();
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
        this.alertOptions = {
          type: 'success',
          title: 'Oppdatert',
          showAccept: true,
          acceptText: 'Lukk'
        };

        this.toggle('alert');
      }, error => {
      });
  }

  // Rating
  // ---------------------
  public setRating(star:number) {
    this.rating.stars = star;
  }

  // Web socket & chat
  // ---------------------

  public connectWebsocket(room_id:number) {
    this.socket = new WebSocket("ws://localhost:8000/chat/" + room_id + "/?token=" + localStorage.getItem('id_token'));


    // This function returns an observable that is triggered by the websockets onMessage
    this.getInstanceStatus()
      .subscribe(success => {

        var data = JSON.parse(<string>success);

        this.setMessageAsRead();

        if (this.user.id != data.user_id) {
          var msg = new Message(data.text, data.user_id);
          this.messages.push(msg);
        }

        setTimeout(() => {
          this.scrollToBottom(true);
        }, 200);

      }, error => {});
  }

  public getInstanceStatus(): Observable<Event>{
    return Observable.create(observer => {
      this.socket.onmessage = (evt) => {
        observer.next(evt.data);
      };
    })
      .share();
  }

  public setMessageAsRead() {
    // Sets the latest message sent to server to read

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

    if (!/\S/.test(text))
      return;

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
      email: 'hei@tidbanken.no',
      token: function (token:any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.

        console.log("This happens");

        // Finish the appointment
        this.finishAppointment();

      }
    });

    handler.open({
      name: 'Tidbanken',
      description: 'Du skal betale for ' + this.appointment.time_amount + ' timer',
      amount: this.appointment.time_amount*5000
    });
  }

  // Appointment related
  // --------------------------
  public finishAppointment() {
    console.log("This happens too");

    this._jobService.registerTimePayment(this.appointment.time_amount, this.appointment.id, this.appointment.job.id)
      .subscribe(success => {

        // Sets the status of the appointment to finished
        this.appointment.status = 3;

        this._jobService.updateAppointment(this.appointment)
          .subscribe(success => {
            this.appointment = success;
          }, error => {});
      }, error => {});
  }

  public suggestNewDate(data:any) {
    var message = "Denne tiden passer ikke for meg. Er det mulig å flytte avtalen til " + data.newHour + ":" + data.newMin + " den " + data.newDate.toLocaleDateString() + "?";
    this.toggle('changeTime');
    this.sendMessage(message);
  }

  // Other
  // ---------------------
  public changeHour(up:boolean) {
    this.appointment.time_amount += (up) ? 1 : -1;
  }

  public toUser(id:number) {
    this._router.navigate(['front', 'user', id]);
  }
}
