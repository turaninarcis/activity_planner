import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivityService } from '../../services/activities.service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-create-activity',
  imports: [FormsModule, RouterLink, NavbarComponent, NgIf],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.scss'
})
export class CreateActivityComponent implements OnInit {
  constructor(
    private activityService:ActivityService,
    private router:Router
  ){

  }
  ngOnInit(): void {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }
  activityDetails:any={
    name:"",
    description:"",
    startDate:"",
    endDate:""
  }

  public image:File | null = null;
  public imageExists:boolean = false;
  public imageUrl?:string|null = null;
  public imagePreview:string|null = null;

  minDate:string="";
  createActivity() {
    this.activityService.createActivity(this.activityDetails).subscribe({
      next:(data:any)=>{
       if(this.imageExists)
          this.updateActivityImage(data);
        
       else this.goToActivitiesPage();
      }
    });
    
  }

  updateActivityImage(data:any){
     console.log(data);
     this.activityService.updateActivityImage(data.createdActivity.id, this.image!).subscribe({
      next:(data)=>{
        this.goToActivitiesPage();
      }
     });
  }

  goToActivitiesPage(){
    this.activityService.getJoinedActivities().subscribe({
          next:(data)=>{
            this.router.navigate(['/activities']);
          }
        }
    );
  }

   onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.image=file;
      this.imageExists=true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result?.toString() || '';
        //.log(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }

    (event.target as HTMLInputElement).files=null;
  }

  removeSelectedFile(){
    this.imageExists = false;
    this.image=null;
    this.imageUrl=null;
    setTimeout(()=>{
      this.imagePreview=null;
    },300)
    console.log(this.image);
  }
}
