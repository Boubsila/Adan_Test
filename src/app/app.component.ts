import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HusnaCardComponent } from './Adan/husna-card/husna-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HusnaCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Aladan';
}
