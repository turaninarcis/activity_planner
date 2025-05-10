import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivityService } from '../../services/activities.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivitiesCardComponent } from './activities-card/activities-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {Modal} from 'bootstrap';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { ActivityShortDTO } from '../../../Models/activities.model';
@Component({
  selector: 'app-activities',
  imports: [NgFor, ActivitiesCardComponent, RouterLink, FormsModule, NgIf, NavbarComponent, CalendarComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnInit{
  inviteToken: string = '';
  activities:ActivityShortDTO[] | null = null;
  joinErrorMessage: string = '';

  constructor(private activityService:ActivityService){
  }
  ngOnInit(): void {
    this.activityService.activitiesPayload$.subscribe((data)=>{
        if(data)this.activities = data.activities;
        else this.activityService.getJoinedActivities().subscribe((data) => this.activities = data.activities);
      })
  }

  joinActivity() {
    this.joinErrorMessage = '';
    if (this.inviteToken) {
      this.activityService.joinActivity(this.inviteToken).subscribe({
        next: (res) => {
          //console.log("Joined successfully!", res);
          this.inviteToken = '';
          this.activityService.getJoinedActivities().subscribe(data=>this.activities = data.activities);

          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.joinErrorMessage = err.error?.message || "An error occurred while joining the group.";
        }
      });
    }
  }
  closeModal() {
    const modalElement = document.getElementById('joinGroupModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
  
      // Optional: Remove leftover backdrop manually after a slight delay
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
      }, 300); // allow animation to finish
    }
  }
}
