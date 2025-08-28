import { Component, inject } from '@angular/core';
import { OptionsCardComponent } from '../../components/options-card/options-card.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { AuthService } from '../../_services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { StatusUpdateFormComponent } from '../../components/status-update-form/status-update-form.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    OptionsCardComponent,
    RegisterFormComponent,
    AsyncPipe,
    StatusUpdateFormComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private auth = inject(AuthService);

  user$ = this.auth.user$;

  cardInfo = [
    {
      icon: 'bi bi-coin',
      title: 'Registrar Movimiento',
      description: 'Añade un nuevo movimiento de venta o gasto.',
      form: 'registerMovement',
    },
    {
      icon: 'bi bi-signpost-split',
      title: 'Actualizar Estados',
      description: 'Actualiza los estados de tus registros.',
      form: 'getRecords',
    },
  ];

  formStatus: string = '';

  userName: string = '';

  constructor() {
    this.userName = this.auth.getUser().name;
  }

  openForm(formName: string) {
    this.formStatus = formName;
  }
  closeModal() {
    this.formStatus = '';
  }

  logout() {
    this.auth.logout();
  }
}
