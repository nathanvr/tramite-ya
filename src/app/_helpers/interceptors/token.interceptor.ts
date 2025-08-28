import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../_services/auth/auth.service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        body: { ...req.body, accessToken: accessToken },
      });
    }

    return next.handle(authReq).pipe(
      switchMap((event: HttpEvent<any>) => {
        // ✅ Detectar si viene una respuesta de error en el body
        if (
          event instanceof HttpResponse &&
          event.body?.message === 'Token inválido o expirado'
        ) {
          // 👇 Intentar refrescar
          return this.authService.refreshAccessTokenAndWait().pipe(
            switchMap((newToken) => {
              if (!newToken) {
                this.authService.logout();
                return throwError(() => 'No se pudo refrescar el token');
              }

              const retryReq = req.clone({
                body: { ...req.body, accessToken: newToken },
              });
              return next.handle(retryReq);
            })
          );
        }
        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error inesperado en interceptor:', error);
        return throwError(() => error);
      })
    );
  }
}
