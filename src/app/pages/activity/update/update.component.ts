import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActivityService } from '../../../services/activities.service';
import {Modal} from 'bootstrap'
import { NgClass, NgIf } from '@angular/common';
@Component({
  selector: 'app-activity-update',
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})


export class ActivityUpdateComponent {

  activityDetails:any ={
    name:"",
    description:"",
    startDate:"",
    endDate:""
  };
  id!: string | null;
  minDate: string = '';

  constructor(private activityService:ActivityService,
    private route:ActivatedRoute,
    private router:Router
  ){}

  public image:File | null = null;
  public imageExists:boolean = false;
  public imageUrl?:string|null = null;
  public imagePreview:string|null = null;

  ngOnInit(): void {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"

    this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.activityService.getActivityDetails(this.id).subscribe(data => {
          this.activityDetails = data.activityDetails;
        });
      }
    });
  }
  updateInviteToken() {
    this.activityService.generateNewInviteToken(this.id).subscribe(data => this.activityDetails.inviteToken = data.newToken);
  }
  updateActivity() {
    this.activityService.updateActivity(this.id,this.activityDetails).subscribe({
      next:(data)=>{
        //console.log(data);
      }
    });

    if(this.image){
      this.activityService.updateActivityImage(this.id, this.image).subscribe({
        next:(data)=>{
          this.activityService.getJoinedActivities().subscribe();
          this.router.navigate([`/activity/${this.id}`]);
        }
      });
    }
    else this.router.navigate([`/activity/${this.id}`]);
  }

  deleteActivity() {
    this.activityService.deleteActivity(this.id).subscribe({
      next:(data)=>{
         this.activityService.getJoinedActivities().subscribe({
          next:(data)=>{
            this.closeDeleteModal();
            this.router.navigate(['/activities']);
          }});
      }
    });
    
    }

    closeDeleteModal() {
      const modalElement = document.getElementById('deleteConfirmModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide(); // 🚀 This closes the modal
        }
      }
    }

    openDeleteModal() {
      const modalElement = document.getElementById('deleteConfirmModal');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
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
