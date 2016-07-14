import {Component, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';

// Needs to declare this for external javascript lib to work
declare var Datepickk: any;

@Component({
    selector: 'datepicker',
    template: require('lib/components/datepicker/template.html'),
    styles: [require('js/datepicker/dist/datepickk.min.css')]
})

export class Datepicker implements OnInit {

    @Input()
    height: Number;

    @Input()
    date: any;

    @Output()
    valueChange = new EventEmitter();

    demoPicker: any;
    elementRef:ElementRef;
    currentDate: string;

    constructor(elementRef:ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
        var that = this;
        var now = new Date();
        let nextMonth = now.setMonth(now.getMonth() + 1);
        this.demoPicker = new Datepickk({
            container: document.querySelector('#datepicker'),
            lang: 'no',
            inline: true,
            range: false,
            startDate: nextMonth,
            height: 340,
            tooltips: {
                date: new Date(),
                text: 'Today'
            },
            onSelect: function(checked) {
                var state = (checked) ? 'selected' : 'unselected';
                that.date = this.toLocaleString();
                that.valueChanged(this.toLocaleString());
                that.valueChange.emit({
                  value: this
                })
            }
        });
        this.demoPicker.show();
    }

    valueChanged(date: String){

    }
}
