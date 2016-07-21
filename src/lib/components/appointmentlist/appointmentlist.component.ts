import {Component, Input, OnInit, SimpleChange}     from '@angular/core';
import {HTTP_PROVIDERS}                             from '@angular/http';
import {Router}                                     from "@angular/router";
import {Appointment}                                from "../../classes/appointment";


@Component({
  selector: 'appointment-list',
  template: require('lib/components/appointmentlist/appointmentlist.component.html'),
  directives: [],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/appointmentlist.component.css'), require('css/app.component.css')]
})

export class AppointmentList implements OnInit {
  @Input() appointments: Appointment[];

  public filteredAppointments: Appointment[];
  private statuses: number[];

  public statusInfo: any[];

  constructor(private _router:Router) {
    this.statuses = [0, 1, 2, 3];

    this.statusInfo = [
      {text:'Venter', color:'color-blue', icon:'fa-hourglass-o', status: 0},
      {text:'Godkjent', color:'color-green', icon:'fa-check', status: 1},
      {text:'Avslått', color:'color-decline', icon:'fa-times', status: 2},
      {text:'Ferdig', color:'color-accept', icon:'fa-thumbs-up', status: 3},
    ]
  }

  public ngOnInit() {
    this.filteredAppointments = this.appointments;
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['appointments']) {
      this.filterAppointments();
    }
  }

  public navigate(appointment_id:number) {
    this._router.navigate(['front', 'appointment', appointment_id]);
  }

  // Appointments related
  // ---------------------------
  public checkStatus(status:number, check:number) {
    return status == check
  }

  public checkMonth(appointment:Appointment) {

    var index = this.filteredAppointments.indexOf(appointment);

    if (this.filteredAppointments.indexOf(appointment) == 0)
      return true;

    var date = new Date(appointment.date);
    var check = new Date(this.filteredAppointments[index - 1].date);

    return date.getMonth() != check.getMonth();
  }

  public covertDate(date) {
    return new Date(date);
  }

  public toggleStatus(status:number) {
    let index = this.statuses.indexOf(status);
    if (index != -1)
      this.statuses.splice(index, 1);
    else
      this.statuses.push(status);

    this.filterAppointments();
  }

  public checkFilter(status:number) {
    return (this.statuses.indexOf(status) != -1)
  }

  private filterAppointments() {
    this.filteredAppointments = this.appointments.filter((item) => {
      return this.statuses.indexOf(item.status) != -1;
    });
  }
}
