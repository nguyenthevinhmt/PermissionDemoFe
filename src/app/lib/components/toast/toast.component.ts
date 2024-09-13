import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ToastMessage, ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  toastMessages: ToastMessage[] = [];
  icon = {
    success: 'pi pi-check',
    info: 'pi pi-info-circle',
    warn: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
  };

  constructor(
    private toastService: ToastService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.toastService.toastMessages$.subscribe((messages) => {
      this.toastMessages = messages;
      setTimeout(() => {
        this.toastMessages?.forEach((message, index) => {
          // if(message === ) {

          // }

          const toastElement =
            this.el.nativeElement.querySelectorAll('.toast')[index];
          this.renderer.addClass(toastElement, 'show');
        });
      });
    });
  }

  closeToast(message: ToastMessage) {
    this.renderer.removeClass(
      this.el.nativeElement.querySelector(`.toast.show`),
      'show'
    );
    setTimeout(() => {
      this.toastService['removeMessage'](message);
    }, 500);
  }
}
