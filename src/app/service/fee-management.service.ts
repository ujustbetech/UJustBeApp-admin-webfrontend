import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FeeManagementService {

  ApiUrl:string='';

  constructor(private http:Http,protected AppConfigService:AppConfigService) {
    this.ApiUrl = AppConfigService.config.ApiUrl;
   }

  
  GetUserDetails(userid:any){
    
    return this.http.get(this.ApiUrl + '/User/Details?UserId='+ userid);
  }

    
  GetFeeTypes(userid:any){    
    return this.http.get(this.ApiUrl + '/Get-FeeType?UserId='+ userid);
    
  }

  SubmitPaymentDetails(paymentobj){
    return this.http.post(this.ApiUrl + '/AddPaymentDetails', paymentobj);
    

  }

  GetFeeStatus(userId:string,feetype:string){    
  return this.http.get(this.ApiUrl + '/Get-FeeBreakup?UserId=' + userId+ '&FeeType='+ feetype);
  
  }

}
