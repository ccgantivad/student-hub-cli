import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: any;
}

export interface Subject {
  id: number;
  name: string;
  teacherName: string;
  credits: number;
  isDisabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:5142/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getSubjectsByProgram(programId: number): Observable<Subject[]> {
    return this.http.get<ApiResponse<Subject[]>>(`${this.apiUrl}/subjects/program/${programId}`, {
      headers: this.createAuthHeaders()
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  enrollSubjects(studentId: number, subjectIds: number[]): Observable<any> {
    const payload = { studentId, subjectIds };
    return this.http.post(`${this.apiUrl}/enrollment/enroll`, payload, {
      headers: this.createAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getEnrolledCredits(studentId: number): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/enrollment/credits/${studentId}`, {
      headers: this.createAuthHeaders()
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
