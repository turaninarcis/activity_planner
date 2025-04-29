import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DetailsPayload } from '../../../Models/details-payload.model';
import {NavbarComponent} from '../../shared/navbar/navbar.component'
@Component({
  selector: 'app-user',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  userDetails!:DetailsPayload;
  isLoading: boolean = true;
  constructor(private userService: UserService){
  }
  ngOnInit(): void {
    this.userService.getDetails().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.isLoading = false;
        this.userService.setUserDetails(data);
      },
      error: (err) =>{
        console.error("Error fetching details");
        this.isLoading=false;
      }
    })
  }
  
}
