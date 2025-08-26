import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OptionsCardComponent } from './components/options-card/options-card.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OptionsCardComponent,
    RegisterFormComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Registro de Ventas y Gastos';
}
