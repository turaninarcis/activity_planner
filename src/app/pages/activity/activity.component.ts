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
  checkDone = false;
  constructor(private route: ActivatedRoute,
    private activityService: ActivityService,
    private router:Router
  ){}
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      this.router.navigate(['/home/activities']);
      return;
    }

    this.activityService.getIsUserPartOfActivity(this.id).subscribe({
      next: (data) => {
        if (!data.joined) {
          this.router.navigate(['/home/activities']); // assuming '/' is your home page
          return;
        }

        this.activityService.getActivityDetails(this.id).subscribe({
          next:(data)=>{
            this.activityDetails = data.activityDetails;
            this.checkDone = true;
          },
          error:(err)=>{
            this.router.navigate(['/home/activities']); // optionally handle failure too
            return;
          }
        });

      },
      error: (err) => {
        this.router.navigate(['/home/activities']); // optionally handle failure too
        return;
      }
    });


  
  }
}
