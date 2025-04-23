import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ActivityService } from '../../services/activities.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-activity',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit{
  id!: string | null;
  activityDetails:any;
  constructor(private route: ActivatedRoute,
    private activityService: ActivityService,
    private router:Router
  ){}
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.activityService.getIsUserPartOfActivity(this.id ? this.id : "").subscribe({
      next: (data) => {
        if (!data.joined) {
          this.router.navigate(['/']); // assuming '/' is your home page
        }
      },
      error: (err) => {
        console.error('Error checking activity participation:', err);
        this.router.navigate(['/']); // optionally handle failure too
      }
    });


    this.activityService.getActivityDetails(this.id).subscribe(data => this.activityDetails = data.activityDetails);


    console.log('Activity id:', this.id)
  }
}
