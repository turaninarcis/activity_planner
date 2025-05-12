import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-card',
  imports: [RouterLink],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss'
})
export class FeatureCardComponent {
  @Input() cardHeader!:string;
  @Input() cardBody!:string;
  @Input() callToActionRoute!:string;
}
