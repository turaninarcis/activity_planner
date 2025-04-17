import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { DetailsPayload } from '../../../../Models/details-payload.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  constructor(private userService: UserService){}
  userDetails: DetailsPayload | undefined;

  ngOnInit(): void {
    this.userService.userDetails$.subscribe((data)=>{
      if(data){
        this.userDetails = data;
      }else{
        this.userService.getDetails().subscribe(details => this.userDetails = details);
      }
    })
  }
  
}
