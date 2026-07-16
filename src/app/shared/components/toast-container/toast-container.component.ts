import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        [class]="'toast toast-' + toast.type"
        [@.disabled]="true"
      >
        <div class="toast-icon">{{ getIcon(toast.type) }}</div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" (click)="closeToast(toast.id)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      pointer-events: all;
      background: white;
      min-width: 300px;
    }

    .toast-success {
      border-left: 4px solid #4caf50;
    }

    .toast-error {
      border-left: 4px solid #f44336;
    }

    .toast-warning {
      border-left: 4px solid #ff9800;
    }

    .toast-info {
      border-left: 4px solid #2196f3;
    }

    .toast-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
    }

    .toast-message {
      margin: 0;
      color: #212121;
      font-size: 0.95rem;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #bdbdbd;
      font-size: 1.2rem;
      transition: color 0.3s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #757575;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .toast-container {
        left: 20px;
        right: 20px;
        top: auto;
        bottom: 20px;
      }

      .toast {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class ToastContainerComponent {
  @Input() toasts: ToastNotification[] = [];
  @Output() close = new EventEmitter<string>();

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || '';
  }

  closeToast(id: string): void {
    this.close.emit(id);
  }
}
