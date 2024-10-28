import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;
  showNavbar = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUserName();

    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.userName = this.authService.getUserName();
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      });
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
  logout(): void {
    this.authService.logout();
  }
}
