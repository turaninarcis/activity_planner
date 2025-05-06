import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(
    private userService:UserService
  ){

  }
  ngOnInit(): void {
    const savedheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-bs-theme',savedheme);
    this.userService.getDetails().subscribe();
  }
  title = 'activity_planner';
}
