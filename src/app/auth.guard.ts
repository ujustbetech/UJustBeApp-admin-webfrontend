import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from '../app/manager/token';
import { NotificationService } from '../app/service/notification.service';
import { Router } from "@angular/router";
import * as RoleHelper from 'src/app/manager/role';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token: Token;
  currentPage;
  event: Event;
  FirstLogin;
  uri;
  userRole;
  currentURI = window.location.origin
  constructor(public router: Router, private service: NotificationService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let page = next.data["route"];
    this.token = new Token(this.router);
    this.userRole = this.token.GetUserData();



    if (this.token.Exists()) {

      if (!page[0].includes("login", "forgot-password", "register")) {
        return true;
      }
      else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
