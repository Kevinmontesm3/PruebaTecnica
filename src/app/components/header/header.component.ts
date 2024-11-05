import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  isAdmin: boolean = false;
  isMenuOpen = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  goTo(route: string) {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }
}
