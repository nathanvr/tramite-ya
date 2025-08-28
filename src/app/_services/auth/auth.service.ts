import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private CLIENT_ID =
    '522995033607-dv31b5ctao60pel1mhpnhep9l1oi7gi4.apps.googleusercontent.com';

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  private refreshInterval: any;

  private tokenClient: any;

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      this.userSubject.next(parsed);
      if (parsed.accessToken) {
        this.accessTokenSubject.next(parsed.accessToken);
      }
    }
  }

  initGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: () => {
        this.initTokenClient();
        this.tokenClient.requestAccessToken({ prompt: '' });
      },
    });
  }

  renderButton(elementId: string) {
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline',
      size: 'medium',
    });
  }

  private initTokenClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope:
        'openid profile email https://www.googleapis.com/auth/userinfo.email',
      callback: async (resp: any) => {
        if (resp.error) {
          console.error('❌ No se pudo obtener access_token', resp);
          return;
        }

        const accessToken = resp.access_token;

        // 🔎 Obtener info de usuario con access_token
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const userInfo = await res.json();

        const user = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
          accessToken,
        };

        // Guardar en BehaviorSubject y LocalStorage
        this.userSubject.next(user);
        this.accessTokenSubject.next(accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/main']);

        // 🔄 Auto-refresh cada 50 minutos
        if (!this.refreshInterval) {
          this.refreshInterval = setInterval(() => {
            this.refreshAccessToken();
          }, 50 * 60 * 1000);
        }
      },
    });
  }

  refreshAccessToken() {
    if (!this.tokenClient) {
      this.initTokenClient();
    }
    this.tokenClient.requestAccessToken({ prompt: '' }); // silencioso
  }

  get currentUser() {
    return this.userSubject.value;
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  logout() {
    this.userSubject.next(null);
    this.accessTokenSubject.next(null);
    localStorage.removeItem('user');
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/']);
  }

  refreshAccessTokenAndWait(): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      // 👇 Asegura inicialización
      if (!this.tokenClient) {
        this.initTokenClient();
      }

      if (!this.tokenClient) {
        console.error('❌ TokenClient no se pudo inicializar');
        observer.next(null);
        observer.complete();
        return;
      }
      this.tokenClient.callback = (response: any) => {
        if (response.error) {
          console.error('❌ Error al refrescar token:', response);
          observer.next(null);
          observer.complete();
          return;
        }
        const accessToken = response.access_token;
        const user = { ...this.currentUser, accessToken };
        this.userSubject.next(user);
        this.accessTokenSubject.next(accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        observer.next(accessToken);
        observer.complete();
      };

      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }
}
