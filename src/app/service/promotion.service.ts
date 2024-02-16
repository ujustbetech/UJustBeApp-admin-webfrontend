import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  ApiUrl:string='';

  constructor(private http:Http,protected AppConfigService:AppConfigService) { 
    this.ApiUrl = AppConfigService.config.ApiUrl;
  }


  AddUpdatePromotion(data:any){
   return this.http.post(this.ApiUrl + '/add-promotion-service', data);
 }

 GetPromotionList(){
  return this.http.get(this.ApiUrl + '/Get-promotion/1/1');
 }

 GetPromotionDetails(promotionid:string){
  return this.http.get(this.ApiUrl + '/Get-PromotionDetails-ById?PromotionId=' + promotionid);
  }

  GetPromotionLPList() {
    return this.http.get(this.ApiUrl + '/Promotion/LpList');
  }
}
