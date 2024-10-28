import { Component, OnInit } from '@angular/core';
import { StudentService, StudentRecord } from '../../services/student.service';

@Component({
  selector: 'app-student-records',
  templateUrl: './student-records.component.html',
  styleUrls: ['./student-records.component.css']
})
export class StudentRecordsComponent implements OnInit {
  studentRecords: StudentRecord[] = [];
  errorMessage: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudentRecords();
  }

  loadStudentRecords(): void {
    this.studentService.getAllStudentRecords().subscribe(
      (data) => {
        this.studentRecords = data;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error al cargar los registros de estudiantes:', error);
        this.errorMessage = 'Error al cargar los registros de estudiantes. Por favor, intenta de nuevo.';
      }
    );
  }
}
