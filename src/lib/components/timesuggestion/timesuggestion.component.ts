import {Component, Input, Output, EventEmitter}   from '@angular/core';
import {HTTP_PROVIDERS}                           from '@angular/http';
import {Datepicker}                               from "../datepicker/datepicker";
import {FormBuilder, Validators}                  from "@angular/common";
import {ValidationService}                        from "../../services/validationService";
import {Appointment}                              from "../../classes/appointment";


@Component({
  selector: 'time-suggestion',
  template: require('lib/components/timesuggestion/timesuggestion.component.html'),
  directives: [Datepicker],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/timesuggestion.component.css'), require('css/components.css')]
})
export class TimeSuggestion  {
  @Input() appointment: Appointment;

  @Output() onFormSubmit:EventEmitter = new EventEmitter();

  public data:any;

  public timeForm:any;

  constructor(private _formBuilder:FormBuilder) {
    this.timeForm = this._formBuilder.group({
      'hour': ['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
      'minute': ['', Validators.compose([Validators.required, ValidationService.positiveNumberValidator])],
    });

    this.data = {};
  }

  // Time form related
  // ------------------------
  public submitForm() {
    this.onFormSubmit.emit(this.data);
  }

  public validateForm(timeForm:any) {
    return (timeForm.valid && this.data.newDate);
  }

  public dateChanged(event) {

    this.data.newDate = event.value;

    this.data.newDate.setHours(12, 0, 0);
  }
}
