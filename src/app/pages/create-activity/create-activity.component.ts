import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivityService } from '../../services/activities.service';
@Component({
  selector: 'app-create-activity',
  imports: [FormsModule],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.scss'
})
export class CreateActivityComponent implements OnInit {
  constructor(
    private activityService:ActivityService
  ){

  }
  ngOnInit(): void {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }
  activityDetails:any={
    name:"",
    description:"",
    startDate:"",
    endDate:""
  }
  minDate:string="";
  createActivity() {
    this.activityService.createActivity(this.activityDetails).subscribe(data => console.log(data));
  }
}
