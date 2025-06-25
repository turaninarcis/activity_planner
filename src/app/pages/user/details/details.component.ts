import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { DetailsPayload } from '../../../../Models/details-payload.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../core/auth/token.service';
@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ){}
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
  deleteAccount(){
    this.userService.deleteUser().subscribe(data=>{
      this.tokenService.clearToken();
      this.router.navigate(["/login"]);
    })
  }
}
