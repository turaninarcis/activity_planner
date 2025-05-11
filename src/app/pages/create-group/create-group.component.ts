import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
@Component({
  selector: 'app-create-group',
  imports: [FormsModule, RouterLink, NavbarComponent],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  constructor(private groupService:GroupsService,
    private router:Router
  ){}
  groupDetails:any = {
    name:'',
    description:''
  }
  createGroup() {
    this.groupService.createGroup(this.groupDetails).subscribe({
      next:(data)=>{
        console.log(data);
        this.router.navigate(['/groups']);
      }
    });
  }

}
