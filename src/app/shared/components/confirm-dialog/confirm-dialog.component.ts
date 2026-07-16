import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()" [class]="'dialog-' + (config?.type || 'info')">
        <div class="dialog-header">
          <h2 class="dialog-title">{{ config?.title }}</h2>
          <button class="dialog-close" (click)="onCancel()">✕</button>
        </div>
        <div class="dialog-body">
          <p>{{ config?.message }}</p>
        </div>
        <div class="dialog-footer">
          <button (click)="onCancel()" class="btn btn-secondary">
            {{ config?.cancelLabel || 'Cancel' }}
          </button>
          <button (click)="onConfirm()" class="btn btn-primary">
            {{ config?.confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      animation: fadeIn 0.3s ease-out;
    }

    .dialog {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.3s ease-out;
    }

    .dialog-info {
      border-top: 4px solid #2196f3;
    }

    .dialog-warning {
      border-top: 4px solid #ff9800;
    }

    .dialog-danger {
      border-top: 4px solid #f44336;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      color: #212121;
    }

    .dialog-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #bdbdbd;
      transition: color 0.3s ease;
    }

    .dialog-close:hover {
      color: #757575;
    }

    .dialog-body {
      padding: 1.5rem;
    }

    .dialog-body p {
      margin: 0;
      color: #424242;
      line-height: 1.6;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #212121;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .dialog {
        width: 95%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() config: ConfirmDialogConfig | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
