import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader" [class.fullscreen]="fullscreen">
      <div class="spinner"></div>
      <p *ngIf="message" class="loader-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }

    .loader.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      z-index: 9999;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f5f5f5;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loader-message {
      color: #757575;
      font-size: 0.95rem;
      margin: 0;
    }
  `]
})
export class LoaderComponent {
  @Input() fullscreen = false;
  @Input() message: string | null = null;
}
