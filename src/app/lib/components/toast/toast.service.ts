import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number; // Thời gian tồn tại của toast, mặc định là 3000ms
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  toastMessages$ = this.toastSubject.asObservable();

  show(message: ToastMessage) {
    const currentMessages = this.toastSubject.value;
    this.toastSubject.next([...currentMessages, message]);

    // Tự động xoá thông báo sau khoảng thời gian nhất định
    setTimeout(() => {
      this.removeMessage(message);
    }, message.life || 3000); // Mặc định là 3000ms
  }

  private removeMessage(message: ToastMessage) {
    const currentMessages = this.toastSubject.value.filter(
      (msg) => msg !== message
    );
    this.toastSubject.next(currentMessages);
  }
}
