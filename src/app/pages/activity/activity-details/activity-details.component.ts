import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../../services/activities.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormsModule} from '@angular/forms';

import {Modal} from 'bootstrap';
@Component({
  selector: 'app-activity-details',
  imports: [CommonModule, RouterLink, NgIf, NgClass, FormsModule],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss'
})
export class ActivityDetailsComponent implements OnInit{
  availableRoles = ['ADMINISTRATOR', 'MODERATOR', 'PARTICIPANT'];
  editRoles:boolean = false;

  activityDetails:any;
  id!: string | null;
  selectedMember:any;

  selectedTask={
    id:'',
    name:'',
    description:'',
  };

  newTask = {
    id:'',
    name: '',
    description: ''
  };

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
  
    return !!user && (user.role === 'CREATOR'||user.role==='ADMINISTRATOR' ||user.role==='MODERATOR') ;
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

  openCreateTaskModal(){
    const modal = new Modal(document.getElementById('createTaskModal')!);
    modal.show();
  }
  createTask() {
    const modalElement = document.getElementById('createTaskModal');
    const modalInstance = Modal.getInstance(modalElement!);
    modalInstance?.hide();
    
    this.activityService.createTask(this.id, this.newTask).subscribe({
      next: (data) => {
        // Fetch updated details after task creation is confirmed
        this.activityService.getActivityDetails(this.id).subscribe(res => {
          this.activityDetails = res.activityDetails;
        });
  
        // Reset the form after success
        this.newTask = {
          id: '',
          name: '',
          description: ''
        };
      },
      error: (err) => {
        console.error('Failed to create task:', err);
      }
    });
    // You can now call your service to save it, then reset the form or close modal manually
  }


  openUpdateTaskModal(task:any){
    this.selectedTask = {
      id: task.id,
      name: task.name,
      description: task.description,
    };

    const modal = new Modal(document.getElementById('updateTaskModal')!);
    modal.show();
  }
  updateTask() {
    const modalElement = document.getElementById('updateTaskModal');
    const modalInstance = Modal.getInstance(modalElement!);
    modalInstance?.hide();
    
    this.activityService.updateTask(this.id,this.selectedTask).subscribe(data=>console.log(data));

    let taskToUpdate = this.activityDetails.tasks.find(x=>x.id===this.selectedTask.id);
    taskToUpdate.name = this.selectedTask.name;
    taskToUpdate.description = this.selectedTask.description;
    
    this.selectedTask = {
      id:'',
      name:'',
      description:'',
    };
    // You can now call your service to save it, then reset the form or close modal manually
  }



  openDeleteTaskModal(task:any){
    this.selectedTask = {
      id: task.id,
      name: task.name,
      description: task.description,
    };

    const modal = new Modal(document.getElementById('deleteTaskModal')!);
    modal.show();
  }
  deleteTask() {
    const modalElement = document.getElementById('deleteTaskModal');
    const modalInstance = Modal.getInstance(modalElement!);
    modalInstance?.hide();
    
    this.activityService.deleteTask(this.id,this.selectedTask).subscribe(data=>console.log(data));

    this.activityDetails.tasks = this.activityDetails.tasks.filter(x=>x.id!==this.selectedTask.id);
    
    
    this.selectedTask = {
      id:'',
      name:'',
      description:'',
    };
  }

  checkTaskAssignment(task):boolean{
    let user = this.getLoggedUser();
    let assignment = task.assignments.find(x=>x.username === user);
    if(assignment!=null){
      return true;
    }
    return false;
  }

  unassignYourself(task){
    this.activityService.deleteAssign(this.id,task.id).subscribe({
      next:(data)=>{
        this.updateActivityDetails();
      }
    });
  }
  assignYourself(task){
    this.activityService.createAssign(this.id,task.id).subscribe({
      next:(data)=>{
        this.updateActivityDetails();
      }
    });

  }
  changeAssignStatus(task){
    this.activityService.updateAssignStatus(this.id,task.id).subscribe({
      next:(data)=>{
        this.updateActivityDetails();
      }
    });
  }

  updateActivityDetails(){
    this.activityService.getActivityDetails(this.id).subscribe(data=>this.activityDetails=data.activityDetails);
  }


  onRoleChange(member: any) {
    // Call the backend service to update role
    let payload = {
      id: member.id,
      role: member.role
    }
    this.activityService.updateMemberRole(this.id, payload).subscribe({
      next: () => {
        // Success notification or silent update
      },
      error: err => {
        console.error('Failed to update role', err);
      }
    });
  }

  toggleEditRoles() {
    this.editRoles = !this.editRoles;
  }
}
