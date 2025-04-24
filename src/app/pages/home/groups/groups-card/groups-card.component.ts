import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-groups-card',
  imports: [RouterLink, NgIf, CommonModule],
  templateUrl: './groups-card.component.html',
  styleUrl: './groups-card.component.scss'
})
export class GroupsCardComponent {
  @Input() id!: string;
  @Input() name!: string;
}
