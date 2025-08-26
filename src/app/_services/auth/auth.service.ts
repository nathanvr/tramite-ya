import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private router = inject(Router);
  user$ = this.userSubject.asObservable();

  private CLIENT_ID =
    '522995033607-dv31b5ctao60pel1mhpnhep9l1oi7gi4.apps.googleusercontent.com';

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  initGoogleSignIn() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (response: any) => this.handleCredentialResponse(response),
    });
  }

  renderButton(elementId: string) {
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline',
      size: 'medium',
    });
  }

  private async handleCredentialResponse(response: any) {
    const token = response.credential;

    // Verificamos el token en Google
    const res = await fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + token
    );
    const data = await res.json();

    if (data.aud === this.CLIENT_ID) {
      const userData = {
        email: data.email,
        name: data.name,
        picture: data.picture,
        sub: data.sub, // ID único del usuario
        idToken: token, // 🔑 guardamos el token para mandarlo al backend
      };

      this.userSubject.next(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      this.router.navigate(['/main']);
    } else {
      alert('Token inválido');
      this.logout();
    }
  }

  get currentUser() {
    return this.userSubject.value;
  }
  startAutoRefresh() {
    setInterval(() => {
      google.accounts.id.refreshToken((response: any) => {
        if (response && response.credential) {
          this.handleCredentialResponse(response);
        }
      });
    }, 50 * 60 * 1000); // cada 50 min
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
