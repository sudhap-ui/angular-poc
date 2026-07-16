import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order, OrderFilter } from '@app/models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    if (environment.enableMockData) {
      return of({ ...order, id: 'order-' + Date.now() });
    }
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
  }

  getOrders(filter?: OrderFilter): Observable<Order[]> {
    if (environment.enableMockData) {
      return of([]);
    }
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }
}
