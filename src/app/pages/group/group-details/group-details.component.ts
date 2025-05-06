import { Component } from '@angular/core';
import { GroupsService } from '../../../services/groups.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../services/user.service';
import {Modal} from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../../../shared/chat/chat.component';
import { DetailsPayload } from '../../../../Models/details-payload.model';
@Component({
  selector: 'app-group-details',
  imports: [CommonModule, NgFor,NgIf, RouterLink, FormsModule, ChatComponent],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent {
  id!: string;
  groupDetails:any;
  selectedMember:any;
  editRoles:boolean = false;
  availableRoles = ['ADMINISTRATOR', 'MEMBER'];
  pastMessages:any;
  userDetails!:DetailsPayload|null;
  constructor(
    private groupService:GroupsService,
    private activatedRoute:ActivatedRoute,
    private userService:UserService,
    private router:Router,
  ){}
  
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;


    this.groupService.getGroupDetails(this.id).subscribe({
      next:(data)=>{
        this.groupDetails=data;
        console.log(this.groupDetails);
      }
    });
    this.userService.userDetails$.subscribe(details => this.userDetails=details);
  }

  copyText(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      console.log('Copied:', value);
    });
  }

  canModifyGroup(): boolean {
    const currentUsername = this.userDetails?.username; // from above

    if (!currentUsername || !this.groupDetails?.groupMembers) return false;
  
    const user = this.groupDetails.groupMembers.find(
      member => member.username === currentUsername
    );
  
    return !!user && (user.role === 'CREATOR'||user.role==='ADMINISTRATOR' ||user.role==='MODERATOR') ;
  }
  canUpdateMember(member: any): boolean {
    const currentUsername = this.userDetails?.username; // from above

    return this.canModifyGroup() && currentUsername !== member.username && member.role!=='CREATOR';
  }
  leaveGroup(){
      this.groupService.leaveGroup(this.id).subscribe(data=>console.log(data));
      this.closeLeaveGroupModal();
      this.router.navigate(['/home/groups']);
    }
  openLeaveGroupModal() {
          const modalElement = document.getElementById('leaveGroupModal');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
    }
    closeLeaveGroupModal() {
      const modalElement = document.getElementById('leaveGroupModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide(); // 🚀 This closes the modal
        }
      }
    }

    openKickModal(member: any) {
      this.selectedMember = member;
      console.log(this.selectedMember);
  
      const modal = new Modal(document.getElementById('kickMemberModal')!);
      modal.show();
    }

    openCopyTokenModal() {  
      const modal = new Modal(document.getElementById('copyTokenModal')!);
      modal.show();
    }

    kickMember() {
      if (this.selectedMember) {
        console.log(this.selectedMember.id);
        this.groupService.kickFromGroup(this.id,this.selectedMember.id).subscribe(data=>console.log(data));

        this.groupDetails.groupMembers = this.groupDetails.groupMembers.filter(member => member.id !== this.selectedMember.id);
  
        const modalElement = document.getElementById('kickMemberModal');
        const modalInstance = Modal.getInstance(modalElement!);
        modalInstance?.hide();
      }
    }

    toggleEditRoles(){
      this.editRoles = !this.editRoles;
    }

    onRoleChange(member: any) {
      // Call the backend service to update role
      let payload = {
        memberId: member.id,
        role: member.role
      }
      this.groupService.updateMemberRole(this.id, payload).subscribe({
        next: () => {
          // Success notification or silent update
        },
        error: err => {
          console.error('Failed to update role', err);
        }
      });
    }
}
