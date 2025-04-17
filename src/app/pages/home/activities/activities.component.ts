import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../../services/activities.service';
import { NgFor } from '@angular/common';
import { ActivitiesCardComponent } from './activities-card/activities-card.component';
@Component({
  selector: 'app-activities',
  imports: [NgFor, ActivitiesCardComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnInit{
  activities:any;
  constructor(private activityService:ActivityService){
  }
  ngOnInit(): void {
    this.activityService.getDetails().subscribe(data => this.activities=data.activities);
  }

}
