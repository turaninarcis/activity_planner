import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-activities-card',
  imports: [NgIf, CommonModule, RouterLink],
  templateUrl: './activities-card.component.html',
  styleUrl: './activities-card.component.scss'
})
export class ActivitiesCardComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() startDate!: string | null; // ISO format or null
}
