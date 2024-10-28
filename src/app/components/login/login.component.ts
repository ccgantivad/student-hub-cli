import { Component } from '@angular/core';
import { AuthService, LoginData } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginData = { username: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  login() {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        console.log('Usuario ha iniciado sesión correctamente');
        this.errorMessage = null;
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.errorMessage = error.status === 401
          ? 'Credenciales inválidas. Por favor verifica tu nombre de usuario y contraseña.'
          : 'Error en el inicio de sesión. Por favor intenta de nuevo más tarde.';
        console.error('Error de inicio de sesión:', error);
      }
    });
  }
 }

