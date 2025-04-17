import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit{
  id!: string | null;
  constructor(private route: ActivatedRoute){}
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Activity id:', this.id)
  }

}
