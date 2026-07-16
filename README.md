# Food Delivery - Angular 20+ POC

A production-quality Angular Proof of Concept for a Food Delivery application using Angular 20+, Standalone Components, TypeScript, RxJS, and Angular Material.

## Features

### Core Features
- 🔐 Authentication (Login/Logout with JWT)
- 🏠 Home Page (Hero banner, Categories, Restaurants, Offers)
- 🍽️ Restaurant Listing (Search, Filter, Sort, Pagination)
- 📋 Restaurant Details (Menu, Reviews, Ratings)
- 🛒 Shopping Cart (Add/Remove items, Quantities, Calculations)
- 💳 Checkout (Address, Payment, Order Summary)
- 📦 Orders (Current and Order History)
- 👤 User Profile (Personal Info, Saved Addresses, Payment Methods)

### Technical Stack
- **Angular 20+** - Latest Angular framework
- **Standalone Components** - Module-free architecture
- **TypeScript** - Strong typing throughout
- **RxJS** - Reactive programming
- **Angular Material** - UI components
- **Reactive Forms** - Form management
- **Angular Router** - Navigation with lazy loading
- **SCSS** - Advanced styling
- **HttpClient** - API communication

## Project Structure

```
src/
├── app/
│   ├── core/              # Core services, guards, interceptors
│   ├── shared/            # Reusable components, pipes, directives
│   ├── features/          # Feature modules (lazy-loaded)
│   ├── models/            # TypeScript interfaces
│   ├── services/          # API & business logic
│   ├── layouts/           # Layout components
│   ├── app.routes.ts      # Routing configuration
│   └── app.config.ts      # Application configuration
├── styles/                # Global SCSS
└── environments/          # Environment configs
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 20+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start mock API server (in another terminal)
npm run serve:mock

# Build for production
npm run build:prod

# Run tests
npm test

# Run linting
npm lint
```

### Available Scripts

- `npm start` - Start dev server on http://localhost:4200
- `npm dev` - Start dev server and open browser
- `npm build` - Build for development
- `npm run build:prod` - Build for production
- `npm run serve:mock` - Start JSON Server mock API on http://localhost:3000
- `npm test` - Run unit tests with Karma
- `npm run lint` - Run ESLint

## Architecture Highlights

### 🏗️ Clean Architecture
- Separation of concerns
- Modular feature structure
- Reusable shared components
- Strong typing (no `any`)

### 🔒 Security
- JWT-based authentication
- HTTP interceptor for token management
- Route guards for protected pages
- Secure token storage

### 🚀 Performance
- Lazy loading for feature routes
- Standalone components for lighter bundle
- Tree-shaking optimized
- Production build optimizations

### 🧪 Code Quality
- TypeScript strict mode
- ESLint configuration
- Jasmine/Karma testing setup
- Path aliases for clean imports

## Authentication

The application uses JWT-based authentication with:
- Login with credentials
- Token storage in localStorage
- Automatic token injection in API requests
- Token refresh handling
- Logout functionality

## API Integration

Mock API endpoints:
- `GET /api/users/login` - User login
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Restaurant details
- `GET /api/cart` - Get cart items
- `POST /api/orders` - Create order

## Development

### Component Structure
```typescript
import { Component, Input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `<div>{{ title() }}</div>`,
  styles: [`/* styles */`]
})
export class ExampleComponent {
  @Input() title = signal('');
}
```

### Service Example
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('/api/data');
  }
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

## Build & Deployment

```bash
# Build for production
npm run build:prod

# Output is in dist/ directory
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Metrics

- Bundle size optimized with lazy loading
- First Contentful Paint (FCP) optimization
- Server-side rendering ready architecture
- Tree-shaking enabled

## Contributing

1. Follow the project structure
2. Use TypeScript strict mode
3. Add unit tests for new features
4. Follow the Angular style guide
5. Use meaningful commit messages

## License

MIT

## Author

Sudha - Angular POC Development
