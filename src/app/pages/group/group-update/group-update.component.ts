import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../../services/groups.service';
import {Modal} from 'bootstrap';
@Component({
  selector: 'app-group-update',
  imports: [FormsModule, RouterLink],
  templateUrl: './group-update.component.html',
  styleUrl: './group-update.component.scss'
})
export class GroupUpdateComponent implements OnInit {
  id!: string | null;
  groupDetails={
    name:'',
    description:'',
    inviteToken:'',
    id:''
  };

  constructor(
    private groupService:GroupsService,
    private route:ActivatedRoute,
    private router:Router
  ){

  }
  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.groupService.getGroupDetails(this.id).subscribe(data => {
          this.groupDetails = data;
        });
      }
    });
  }


    
  deletegroup() {
    this.groupService.deleteGroup(this.id === null ? '' : this.id).subscribe({
      next:(data)=>{
        //console.log(data);
        this.closeDeleteModal();
        this.router.navigate(['/home/groups']);
      }
    })
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
    
  updateInviteToken() {
    this.groupService.getNewInviteToken(this.id).subscribe(data=>this.groupDetails.inviteToken=data.newToken);
  }
  updateGroup() {
    let payload = {
      name:this.groupDetails.name,
      description: this.groupDetails.description
    }
    //console.log(payload);
    this.groupService.updateGroup(this.id,payload).subscribe({
      next:(data)=>{
        //console.log(data);
        this.router.navigate(['/group',this.id]);
      }
    });
  }

}
