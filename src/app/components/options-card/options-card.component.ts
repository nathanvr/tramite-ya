import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-options-card',
  standalone: true,
  imports: [],
  templateUrl: './options-card.component.html',
  styleUrl: './options-card.component.scss',
})
export class OptionsCardComponent {
  @Input() cardData!: { icon: string; title: string; description: string };
}
