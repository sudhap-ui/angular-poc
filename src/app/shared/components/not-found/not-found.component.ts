import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a routerLink="/home" class="btn btn-primary">Back to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .content {
      text-align: center;
      color: white;
    }
    h1 {
      font-size: 5rem;
      margin: 0;
    }
    h2 {
      font-size: 2rem;
      margin: 0.5rem 0;
    }
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class NotFoundComponent {}
