import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  ApiUrl:string='';

  constructor(private http:Http,protected AppConfigService:AppConfigService) { 
    this.ApiUrl = AppConfigService.config.ApiUrl;
  }


  AdminAddUpdate(data:any){
   return this.http.post(this.ApiUrl + '/admin-register', data);
 }


 AdminUserList(data:any){
  return this.http.post(this.ApiUrl + '/admin-user-list',data);
}
 

getUser(userId:any){
  return this.http.get(this.ApiUrl + '/admin-user-info?userId=' + userId);
}

}
