import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../../services/activities.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {Modal} from 'bootstrap';
@Component({
  selector: 'app-activity-details',
  imports: [CommonModule, RouterLink, NgIf, NgClass],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss'
})
export class ActivityDetailsComponent implements OnInit{

  activityDetails:any;
  id!: string | null;
  selectedMember:any;

  constructor(private activityService:ActivityService,
    private route:ActivatedRoute,
    private userService:UserService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.activityService.getActivityDetails(this.id).subscribe(data => this.activityDetails = data.activityDetails);

  }

  copyText(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      console.log('Copied:', value);
    });
  }
  canModifyActivity(): boolean {
    const currentUsername = this.userService.getCurrentUsername(); // from above

    if (!currentUsername || !this.activityDetails?.members) return false;
  
    const user = this.activityDetails.members.find(
      member => member.username === currentUsername
    );
  
    return !!user && (user.role === 'CREATOR'|| user.role==='MODERATOR') ;
  }
  getLoggedUser():any{
    return this.userService.getCurrentUsername();
  }
  leaveActivity(){
    this.activityService.leaveActivity(this.id).subscribe(data=>console.log(data));
    this.closeLeaveActivityModal();
    this.router.navigate(['/home/activities']);
  }
  openLeaveActivityModal() {
        const modalElement = document.getElementById('leaveActivityModal');
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        }
  }
  closeLeaveActivityModal() {
    const modalElement = document.getElementById('leaveActivityModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // 🚀 This closes the modal
      }
    }
  }

  getUserConfirmation():boolean{
    let member = this.activityDetails?.members.find(x=>x.username===this.getLoggedUser());
    return member?.confirmed;
  }

  changeUserConfirmation(){
    this.activityService.changeConfirmation(this.id).subscribe(data=>console.log(data));
    let member = this.activityDetails?.members.find(x=>x.username===this.getLoggedUser());
    member.confirmed = !member.confirmed;
  }

  openKickModal(member: any) {
    this.selectedMember = member;
    console.log(this.selectedMember.id);

    const modal = new Modal(document.getElementById('kickMemberModal')!);
    modal.show();
  }
  kickMember() {
    if (this.selectedMember) {
      console.log(this.selectedMember.id);
      this.activityService.kickFromActivity(this.id,this.selectedMember.id).subscribe(data=>console.log(data));
      this.activityService.getActivityDetails(this.id).subscribe(data => this.activityDetails = data.activityDetails);

      const modalElement = document.getElementById('kickMemberModal');
      const modalInstance = Modal.getInstance(modalElement!);
      modalInstance?.hide();
    }
  }
}
