import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../../core/auth/token.service';
import { Router} from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Collapse} from 'bootstrap';
import { UserService } from '../../services/user.service';
import { DetailsPayload } from '../../../Models/details-payload.model';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  showLogoutModal:boolean = false;
  currentRoute: string = '';
  @ViewChild('navbarCollapse') navbarCollapse!:ElementRef;

  toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService:UserService
  ){}
  userDetails:DetailsPayload | null = null;
  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.userService.userDetails$.subscribe((data)=>{
      if(data){
        this.userDetails = data;
      }else{
        this.userService.getDetails().subscribe(details => this.userDetails = details);
      }
    })
  }

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
  changeRoute(route){
    this.currentRoute = route;
  }
  toggleNavbar(){
    const el = this.navbarCollapse.nativeElement;
    const collapse = Collapse.getInstance(el) || new Collapse(el, {toggle:false});
    el.classList.contains('show') ? collapse.hide():collapse.show();
  }
}
