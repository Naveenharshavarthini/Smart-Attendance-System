import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // // Create new user
  // createUser(user: any): Observable<any> {
  //   return this.http.post<any>(this.apiUrl+'/create', user);
  // }

  // // Update user
  // updateUser(id: string, user: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  // }
  createUser(formData: FormData) {
    return this.http.post<any>(this.apiUrl+'/create', formData);
  }
  
  updateUser(id: string, formData: FormData) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }
  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
