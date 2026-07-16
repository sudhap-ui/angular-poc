import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private toastId = 0;

  showSuccess(message: string, duration = 3000): void {
    this.addToast(message, 'success', duration);
  }

  showError(message: string, duration = 3000): void {
    this.addToast(message, 'error', duration);
  }

  showWarning(message: string, duration = 3000): void {
    this.addToast(message, 'warning', duration);
  }

  showInfo(message: string, duration = 3000): void {
    this.addToast(message, 'info', duration);
  }

  private addToast(message: string, type: Toast['type'], duration: number): void {
    const id = `toast-${this.toastId++}`;
    const toast: Toast = { id, message, type, duration };
    
    const currentToasts = this.toasts();
    this.toasts.set([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toasts();
    this.toasts.set(currentToasts.filter(t => t.id !== id));
  }
}
