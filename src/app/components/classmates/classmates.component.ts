import { Component, OnInit } from '@angular/core';
import { ClassmateService, ClassWithClassmates } from '../../services/classmate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-classmates',
  templateUrl: './classmates.component.html',
  styleUrls: ['./classmates.component.css']
})
export class ClassmatesComponent implements OnInit {
  classesWithClassmates: ClassWithClassmates[] = [];
  errorMessage: string | null = null;

  constructor(private classmateService: ClassmateService, private authService: AuthService) {}

  ngOnInit(): void {
    const studentId = this.authService.getStudentId();

    if (studentId) {
      this.classmateService.getClassesWithClassmates(studentId).subscribe(
        (data) => {
          this.classesWithClassmates = data;
          this.errorMessage = null;
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Error loading classes and classmates.';
        }
      );
    } else {
      this.errorMessage = 'Student ID not found. Please log in again.';
    }
  }
}
