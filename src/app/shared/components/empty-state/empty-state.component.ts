import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EmptyStateConfig {
  title: string;
  message: string;
  icon?: string;
  actionLabel?: string;
  actionIcon?: string;
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon" *ngIf="config.icon">{{ config.icon }}</div>
      <h3 class="empty-title">{{ config.title }}</h3>
      <p class="empty-message">{{ config.message }}</p>
      <button
        *ngIf="config.actionLabel"
        (click)="action.emit()"
        class="btn btn-primary"
      >
        {{ config.actionIcon ? config.actionIcon + ' ' : '' }}{{ config.actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.5rem;
      color: #212121;
      margin: 0 0 0.75rem;
    }

    .empty-message {
      color: #757575;
      margin-bottom: 1.5rem;
      max-width: 400px;
    }

    .btn {
      padding: 0.75rem 1.5rem;
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
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class EmptyStateComponent {
  @Input() config!: EmptyStateConfig;
  @Output() action = new EventEmitter<void>();
}
