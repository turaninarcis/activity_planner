import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupsCardComponent } from "./groups-card/groups-card.component";
import { GroupsService } from '../../services/groups.service';
import { RouterLink } from '@angular/router';
import {Modal} from 'bootstrap';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
@Component({
  selector: 'app-groups',
  imports: [NgIf, FormsModule, GroupsCardComponent, NgFor, RouterLink, NavbarComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit{
  groups:any;
  inviteToken:string='';
  joinErrorMessage:string='';

  constructor(
    private groupsService:GroupsService
  ){

  }

  ngOnInit(): void {
    this.groupsService.getJoinedGroups().subscribe(data=>this.groups = data.joinedGroups)
  }

  
  joinGroup() {
    this.joinErrorMessage = '';
    if (this.inviteToken) {
      this.groupsService.joinGroup(this.inviteToken).subscribe({
        next: (res) => {
          console.log("Joined successfully!", res);
          this.inviteToken = '';
          this.groupsService.getJoinedGroups().subscribe(data=>this.groups = data.joinedGroups);
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
