import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  ngAfterViewInit(): void {
    this.auth.initGoogleSignIn();
    this.auth.renderButton('googleBtn');
  }
}
