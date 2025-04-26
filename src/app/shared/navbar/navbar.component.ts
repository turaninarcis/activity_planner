import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/auth/token.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showLogoutModal:boolean = false;

  toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  constructor(
    private tokenService: TokenService,
    private router: Router
  ){}

  openLogoutModal() {
    this.showLogoutModal = true;
  }
    
  logout() {
    this.showLogoutModal = false;
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
  closeLogoutModal() {
    this.showLogoutModal = false;
  }
}
