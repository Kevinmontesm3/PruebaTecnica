import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response.model';
import { AuthCredentials } from '../models/auth-credentials.model';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: AuthCredentials): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      switchMap((res) => {
        localStorage.setItem('authToken', res.token);

        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
          map((users) => {
            const user = users.find((u) => u.username === credentials.username);

            if (user) {
              user.userRole = user.email.endsWith(environment.dominioAdmin) ? 'admin' : 'user';
              localStorage.setItem('user', JSON.stringify(user));
              return { token: res.token, user };
            } else {
              throw new Error('Usuario no encontrado');
            }
          }),
          catchError(() => {
            localStorage.removeItem('authToken');
            return of(null);
          })
        );
      })
    );
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user ? user.userRole === 'admin' : false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAdminInLogrono(): boolean {
    const user = this.getUser();
    return user ? user.userRole === 'admin' && user.address.city === 'Logroño'  : false;
  }

  isAdminInMadrid(): boolean {
    const user = this.getUser();
    return user ? user.userRole === 'admin' && user.address.city === 'Madrid'  : false;
  }
}
