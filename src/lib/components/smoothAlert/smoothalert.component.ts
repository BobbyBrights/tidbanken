import {Component, Input, EventEmitter, ElementRef, Output}         from '@angular/core';
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
export class SmoothAlert  {
    @Input() alertText: string;
    @Input() collapse: boolean;
    @Input() alertType: string;

    @Output() onButtonClick = new EventEmitter<number>();

    @Input() duration: number = 500;
    private _animation: CssAnimationBuilder;

    constructor(animationBuilder:AnimationBuilder, private _element:ElementRef) {
        this._animation = animationBuilder.css();
    }

    public checkType(type: string) {
        return this.alertType == type;
    }

    public buttonClick(value) {
        this.onButtonClick.emit(value);
    }

    ngOnChanges(changes) {
        if (changes.collapse) {
            if (this.collapse) {
                this.hide()
            } else {
                this.show();
            }
        }
    }

    hide(): void {
        this._baseSequence
            .setFromStyles({
                height: this._element.nativeElement.scrollHeight + 'px',
                overflow: 'hidden'
            })
            .setToStyles({
                height: '0',
                paddingTop: '0',
                paddingBottom: '0'
            });

        let a = this._animation.start(this._element.nativeElement);
        a.onComplete(() => {
            a.removeClasses(['in']); // rapid change will leave in
            a.addClasses(['collapse']);
        });
    }

    show(): void {
        this._animation
            .setDuration(0)
            .addClass('in')
            .setFromStyles({
                overflow: 'hidden'
            })
            .setToStyles({
                paddingTop: '',
                paddingBottom: ''
            })
            .start(this._element.nativeElement)
            .onComplete(() => {
                let a = this._baseSequence
                    .setFromStyles({
                        height: '0'
                    })
                    .setToStyles({
                        height: this._element.nativeElement.scrollHeight + 'px'
                    })
                    .start(this._element.nativeElement);

                a.onComplete(() =>  a.addClasses(['collapse', 'in'])  );
            });
    }

    private get _elementHeight(): number {
        let el = this._element.nativeElement;
        var height = el.offsetHeight;
        var style = getComputedStyle(el);

        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    }

    private get _baseSequence(): CssAnimationBuilder {
        return this._animation
            .setDuration(this.duration)
            .removeClass('collapse')
            .removeClass('in')
            .addAnimationClass('collapsing')
    }
}
