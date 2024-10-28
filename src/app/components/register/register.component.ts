import { Component, OnInit } from '@angular/core';
import { AuthService, RegisterData, Program } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerData: RegisterData = {
    fullName: '',
    username: '',
    email: '',
    programId: 0,
    passwordHash: ''
  };
  programs: Program[] = [];
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.authService.getPrograms().subscribe(
      (data) => {
        this.programs = data;
      },
      (error) => {
        console.error('Failed to load programs', error);
        this.errorMessage = 'Could not load programs. Please try again later.';
      }
    );
  }

  register(): void {
    this.authService.register(this.registerData).subscribe(
      () => {
        console.log('User registered successfully');
        this.router.navigate(['/login']); // Redirige al login después de registrarse
      },
      error => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
