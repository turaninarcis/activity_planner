import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    const savedheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-bs-theme',savedheme);
  }
  title = 'activity_planner';
}
