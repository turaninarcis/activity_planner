import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivityService } from '../../services/activities.service';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card.component';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CalendarComponent, FeatureCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(
    private activityService:ActivityService
  ){}

  activities:any|null = null;

  ngOnInit(): void {
      //this.activityService.getJoinedActivities().subscribe(data => this.activities=data.activities);

      this.activityService.activitiesPayload$.subscribe((data)=>{
        if(data)this.activities = data.activities;
        else this.activityService.getJoinedActivities().subscribe((data) => this.activities = data.activities);
      })
  }

}
