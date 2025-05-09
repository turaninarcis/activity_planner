import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-group',
  imports: [RouterOutlet, NgIf, NavbarComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {
  id!: string | null;
  groupDetails:any;
  checkDone=false;
  constructor(
    private groupService:GroupsService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ){}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.groupService.getGroupDetails(this.id).subscribe({
      next:(data)=>{
        this.groupDetails=data;
        this.checkDone=true;
        // console.log(this.groupDetails);
      },
      error:(err)=>{
        this.router.navigate(['/home/groups']);
        return;
      }
    });
  }

}
