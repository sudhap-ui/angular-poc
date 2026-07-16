import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>About Us</h4>
            <p>Your favorite food delivery application delivering delicious meals to your doorstep.</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Restaurants</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Follow Us</h4>
            <div class="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 FoodHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #212121;
      color: #bdbdbd;
      padding: 3rem 0 1rem;
      margin-top: 3rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-section h4 {
      color: white;
      margin-bottom: 1rem;
    }
    .footer-section p {
      line-height: 1.6;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section li {
      margin-bottom: 0.5rem;
    }
    .footer-section a {
      color: #bdbdbd;
      text-decoration: none;
      transition: color 0.3s;
    }
    .footer-section a:hover {
      color: white;
    }
    .social-links {
      display: flex;
      gap: 1rem;
    }
    .footer-bottom {
      border-top: 1px solid #424242;
      padding-top: 1rem;
      text-align: center;
    }
  `]
})
export class FooterComponent {}
