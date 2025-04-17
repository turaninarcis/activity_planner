import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TokenService } from '../../core/auth/token.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterOutlet, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ){}
  openLogoutModal() {
    this.showLogoutModal = true;
  }
  showLogoutModal:boolean = false;

  logout() {
    this.showLogoutModal = false;
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
  closeLogoutModal() {
    this.showLogoutModal = false;
  }

}
