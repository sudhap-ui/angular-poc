import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Restaurant, RestaurantFilters } from '@app/models';
import { environment } from '@environments/environment';
import { MOCK_RESTAURANTS } from '@app/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getRestaurants(filters?: RestaurantFilters): Observable<Restaurant[]> {
    if (environment.enableMockData) {
      return of(MOCK_RESTAURANTS);
    }
    return this.http.get<Restaurant[]>(`${environment.apiUrl}/restaurants`);
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    if (environment.enableMockData) {
      const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
      return of(restaurant!);
    }
    return this.http.get<Restaurant>(`${environment.apiUrl}/restaurants/${id}`);
  }
}
