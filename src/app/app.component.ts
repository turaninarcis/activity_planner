import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { FooterComponent } from './shared/footer/footer.component';
import { InterceptorService } from './services/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerService } from './services/error-handler.service';
import { ErrorHandler } from '@angular/core';
import { ActivityService } from './services/activities.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    }
  ]
})
export class AppComponent implements OnInit{
  constructor(
    private userService:UserService,
    private activityService:ActivityService
  ){

  }
  ngOnInit(): void {
    const savedheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-bs-theme',savedheme);
    
    this.userService.getDetails().subscribe();
    this.activityService.getJoinedActivities().subscribe();
  }
  title = 'activity_planner';
}
