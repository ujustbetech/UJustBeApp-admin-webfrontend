import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  ApiUrl:string='';


  constructor(private http:Http,protected AppConfigService:AppConfigService) {
    this.ApiUrl = AppConfigService.config.ApiUrl;
   }

  ForgotPassword(formbody) {
    return this.http.post(this.ApiUrl + '/admin-forgot-password', formbody);
  }

  ResetPassword(formbody) {
    return this.http.put(this.ApiUrl + '/admin/change-password', formbody);
  }
}
