import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isEnrollmentDisabled = false;

  constructor(private authService: AuthService, private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.checkCredits();
  }

  checkCredits(): void {
    const studentId = this.authService.getStudentId();
    if (studentId) {
      this.enrollmentService.getEnrolledCredits(studentId).subscribe(
        (totalCredits) => {
          console.log(totalCredits);
          this.isEnrollmentDisabled = totalCredits >= 9;
        },
        (error) => {
          console.error('Error checking enrolled credits', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
