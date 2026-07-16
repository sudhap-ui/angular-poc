import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Address } from '@app/models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/profile`);
  }

  updateUserProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/profile`, user);
  }

  getUserAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.apiUrl}/users/addresses`);
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${environment.apiUrl}/users/addresses`, address);
  }

  updateAddress(id: string, address: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.apiUrl}/users/addresses/${id}`, address);
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/addresses/${id}`);
  }
}
