import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface StudentRecord {
  id: number;
  fullName: string;
  programName: string;
  subjects: {
    id: number;
    name: string;
    teacherName: string;
    credits: number;
  }[];
}

interface ApiResponse {
  success: boolean;
  data: StudentRecord[];
  message: string;
  error: any;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5142/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  getAllStudentRecords(): Observable<StudentRecord[]> {
    const token = localStorage.getItem(this.tokenKey);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<ApiResponse>(`${this.apiUrl}/students/all-students`, { headers }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al cargar los registros de estudiantes:', error);

        if (error.status === 401) {
          this.router.navigate(['/login']);
        }

        return of([]);
      })
    );
  }
}
