import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, mergeMap, Observable, of, throwError} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from "@angular/router";

const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    this.loadCurrentUser();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    if (username === 'test' && password === 'test') {
      return this.generateToken().pipe(
        mergeMap((token) => {
          this.storeCurrentUser(username, token.access_token);
          return this.currentUser;
        })
      );
    }
    return throwError({ error: { message: 'Username or password is incorrect' } });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({});
  }

  isAuthenticated(): boolean {
    const token = this.currentUserValue?.token;
    return !this.jwtHelper.isTokenExpired(token);
  }

  private generateToken(): Observable<{ access_token: string }> {
    return of ({access_token: TEST_TOKEN});
  }

  private loadCurrentUser(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject.next(storedUser);
  }

  private storeCurrentUser(username: string, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify({ username, token }));
    this.currentUserSubject.next({ username, token });
  }
}

