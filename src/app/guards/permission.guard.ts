import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {IndexedDbService} from '../core/indexed-db/indexed-db.service';

export const permissionGuard: CanActivateFn = async (route, state) => {

  const authService = inject(IndexedDbService)
  const router = inject(Router)
  const auth = await authService.dbAuthorization()

  if (!auth) router.navigate(["sign-in"]).then()

  return true
};
