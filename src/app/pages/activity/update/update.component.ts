import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActivityService } from '../../../services/activities.service';
import {Modal} from 'bootstrap'
@Component({
  selector: 'app-activity-update',
  imports: [FormsModule, RouterLink],
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
    this.activityService.updateActivity(this.id,this.activityDetails).subscribe(data=> console.log(data));
    this.router.navigate([`/activity/${this.id}`]);
  }

  deleteActivity() {
    this.activityService.deleteActivity(this.id).subscribe(data=>console.log(data));
    this.closeDeleteModal();
    this.router.navigate(['']);
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
}
