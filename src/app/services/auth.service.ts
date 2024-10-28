import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  programId: number;
  passwordHash: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface Program {
  id: number;
  name: string;
  description: string;
}

export interface DecodedToken {
  uName: string | null;
  studentId: number;
  programId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5142/api';
  private tokenKey = 'authToken';
  private decodedToken: DecodedToken | null = null;
  private helper = new JwtHelperService();

  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserNameFromToken();
  }

  private loadUserNameFromToken(): void {
    const token = this.getToken();
    if (token) {
      this.setToken(token);
    }
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Students`, data).pipe(
      tap(() => console.log('User registered')),
      catchError(this.handleError('register'))
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, data).pipe(
      tap(response => {
        this.setToken(response.token);
      }),
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          console.error('Unauthorized access - redirecting to login');
        }
        return throwError(() => error);
      })
    );
  }


  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    try {
      this.decodedToken = this.helper.decodeToken(token) as DecodedToken;

      if (this.decodedToken.uName) {
        this.userNameSubject.next(this.decodedToken.uName);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      this.decodedToken = null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const isExpired = token ? this.helper.isTokenExpired(token) : true;
    if (isExpired) {
      this.logout();
    }
    return !isExpired;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserName(): string | null {
    return this.userNameSubject.value;
  }

  logout(): void {
    if (localStorage.getItem(this.tokenKey)) {
        localStorage.removeItem(this.tokenKey);
        this.decodedToken = null;
        this.userNameSubject.next(null);
        this.router.navigate(['/login']);
    } else {
        console.warn('No token found in localStorage');
    }
}


  getStudentId(): number | null {
    return this.decodedToken ? this.decodedToken.studentId : null;
  }

  getProgramId(): number | null {
    return this.decodedToken ? this.decodedToken.programId : null;
  }

  getPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.apiUrl}/Program`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
