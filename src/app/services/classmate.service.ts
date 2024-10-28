import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface ClassWithClassmates {
  subjectName: string;
  classmates: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error: any;
}

@Injectable({
  providedIn: 'root'
})
export class ClassmateService {
  private apiUrl = 'http://localhost:5142/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  getClassesWithClassmates(studentId: number): Observable<ClassWithClassmates[]> {
    const token = localStorage.getItem(this.tokenKey);

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<ApiResponse<ClassWithClassmates[]>>(`${this.apiUrl}/enrollment/student/${studentId}/classmates`, { headers }).pipe(
      map(response => response.data),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<ClassWithClassmates[]> {
    console.error('Error loading classes and classmates:', error.message);

    return of([]);
  }
}
