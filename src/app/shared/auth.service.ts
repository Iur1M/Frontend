import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { User } from './models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;
  private isBrowser: boolean;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const user = this.getUserFromStorage();
      if (user) {
        user.roles = this.getRolesFromToken(user.accessToken);
        this.userSubject.next(user);
      }
    }
  }

  updateFavoriteMovie(movieId: number): Observable<any> {
    return this.http
      .patch(`${this.usersUrl}/favorite-movie/${movieId}`, {})
      .pipe(
        tap(() => {
          const currentUser = this.userSubject.value;
          if (currentUser) {
            currentUser.favoriteMovieId = movieId;
            this.updateStorage(currentUser);
          }
        }),
      );
  }
  private updateStorage(user: User) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  login(data: any) {
    return this.http.post<User>(`${this.baseUrl}/login`, data).pipe(
      tap((user) => {
        user.roles = this.getRolesFromToken(user.accessToken);

        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        this.userSubject.next(user);

        this.http.get<User>(`${this.usersUrl}/me`).subscribe((fullUser) => {
          fullUser.roles = user.roles;
          fullUser.accessToken = user.accessToken;

          this.updateLocalUser(fullUser);
        });
      }),
    );
  }
  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout(router?: any) {
    if (this.isBrowser) {
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);

    if (router) {
      router.navigate(['/']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.roles?.includes('Admin') ?? false;
  }

  getToken(): string | null {
    return this.userSubject.value?.accessToken ?? null;
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getRolesFromToken(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      return Array.isArray(roles) ? roles : roles ? [roles] : [];
    } catch {
      return [];
    }
  }

  updateLocalUser(updatedUser: User) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    this.userSubject.next(updatedUser);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return (
        payload['unique_name'] ||
        payload['sub'] ||
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ||
        null
      );
    } catch (e) {
      return null;
    }
  }
}
