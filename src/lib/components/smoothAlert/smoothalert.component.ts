import {Component, Input, EventEmitter, ElementRef, Output, OnInit}         from '@angular/core';
import {HTTP_PROVIDERS}                                             from '@angular/http';
import {CssAnimationBuilder}                                        from "@angular/platform-browser/src/animate/css_animation_builder";
import {AnimationBuilder}                                           from "@angular/platform-browser/src/animate/animation_builder";

@Component({
  selector: 'smooth-alert',
  template: require('lib/components/smoothAlert/smoothalert.component.html'),
  directives: [],
  providers: [
    HTTP_PROVIDERS
  ],
  styles: [require('css/smoothalert.component.css'), require('css/app.component.css')]
})
export class SmoothAlert implements OnInit {

  @Input() options:any;

  @Input() collapse:boolean;

  @Output() onButtonClick = new EventEmitter<number>();
  @Output() onDeclineClick = new EventEmitter<number>();

  private _animation:CssAnimationBuilder;

  constructor(animationBuilder:AnimationBuilder, private _element:ElementRef) {
    this._animation = animationBuilder.css();
  }

  public ngOnInit() {

  }

  public checkType(type:string) {
    return this.options.type == type;
  }

  public buttonClick(value) {
    this.onButtonClick.emit(value);
  }

  public declineClick(value) {
    this.onDeclineClick.emit(value);
  }

  public ngOnChanges(changes) {
    /*
    if (changes.collapse) {
      if (this.collapse) {
        this.hide();
      } else {
        this.show();
      }
    }*/
  }

  public hide():void {

  }

  public show():void {
    this._animation
      .setDuration(5000);

    this._animation
      .setFromStyles({opacity:0})
      .setToStyles({opacity:1});

    this._animation.start(this._element.nativeElement);

  }

  private get _elementHeight():number {
    let el = this._element.nativeElement;
    var height = el.offsetHeight;
    var style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }
}
