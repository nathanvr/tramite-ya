import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUserString = localStorage.getItem('user');

  if (currentUserString) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
