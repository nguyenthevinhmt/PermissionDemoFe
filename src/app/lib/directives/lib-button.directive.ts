import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[libButton]',
})
export class LibButtonDirective {
  @Input() buttonType: string = 'default'; // Mặc định là button thông thường
  @Input() disabled: boolean = false; // Trạng thái disable của button

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyBaseStyles();
    this.applyTypeStyles();

    if (this.disabled) {
      this.applyDisabledStyles();
    }
  }

  // Thêm các style cơ bản cho button
  private applyBaseStyles(): void {
    this.renderer.addClass(this.el.nativeElement, 'p-button');
  }

  // Thêm các style dựa trên loại button
  private applyTypeStyles(): void {
    switch (this.buttonType) {
      case 'primary':
        this.renderer.addClass(this.el.nativeElement, 'p-button-primary');
        break;
      case 'secondary':
        this.renderer.addClass(this.el.nativeElement, 'p-button-secondary');
        break;
      case 'danger':
        this.renderer.addClass(this.el.nativeElement, 'p-button-danger');
        break;
      default:
        this.renderer.addClass(this.el.nativeElement, 'p-button-default');
        break;
    }
  }

  // Thêm style cho trạng thái disabled
  private applyDisabledStyles(): void {
    this.renderer.addClass(this.el.nativeElement, 'p-button-disabled');
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  }

  // Thêm hiệu ứng hover và active
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.disabled) {
      this.renderer.addClass(this.el.nativeElement, 'p-button-hover');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'p-button-hover');
  }

  @HostListener('mousedown') onMouseDown() {
    if (!this.disabled) {
      this.renderer.addClass(this.el.nativeElement, 'p-button-active');
    }
  }

  @HostListener('mouseup') onMouseUp() {
    this.renderer.removeClass(this.el.nativeElement, 'p-button-active');
  }
}
