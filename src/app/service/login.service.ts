import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  ApiUrl:string='';

  constructor(private http: Http,protected AppConfigService:AppConfigService) {
  this.ApiUrl = AppConfigService.config.ApiUrl;
  }
 

  Login(data: any) {

    return this.http.post(this.ApiUrl + '/admin-login', data);

  }

  AdminRegister(data: any) {
    return this.http.post(this.ApiUrl + '/admin-register', data);
  }
}
