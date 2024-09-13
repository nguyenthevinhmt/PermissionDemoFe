import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[libInput]',
})
export class InputDirective {
  @Input() disabled = false;

  @HostBinding('class.p-inputtext') inputClass = true;
  @HostBinding('class.p-component') componentClass = true;
  @HostBinding('class.p-disabled') get disabledClass() {
    return this.disabled;
  }
}
