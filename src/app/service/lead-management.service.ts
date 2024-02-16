import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LeadManagementService {

  ApiUrl:string='';


  constructor(private http:Http,protected AppConfigService:AppConfigService) { 
    this.ApiUrl = AppConfigService.config.ApiUrl;
  }

  GetReferralList(partnerid:string){

    return this.http.get(this.ApiUrl + '/referral-list?UserId=' + partnerid);
  }

  GetReferralDetails(referralId:string){
    
    return this.http.get(this.ApiUrl + '/referral/details?referralId=' + referralId);
  }
  
  SubmitPaymentDetails(paymentobj: any) {

    return this.http.post(this.ApiUrl + '/Payment-Details', paymentobj);

  }

  GetReferralTrackingList(Searchobj: any){
    return this.http.post(this.ApiUrl + '/Report/Referral', Searchobj);
    //return this.http.get(this.ApiUrl + '/Report/Referral');
  }

  GetReferralTrackingExcel(Searchobj: any) {
    return this.http.put(this.ApiUrl + '/Excel/Referral', Searchobj);
    //return this.http.get(this.ApiUrl + '/Report/Referral');
  }

  UpdateDealValue(dealobj: any) {

    return this.http.put(this.ApiUrl + '/referral/updateDealValue', dealobj);

  }

  PaymentDetailsList(referralId:string) {

    return this.http.get(this.ApiUrl + '/Get-PaymentList?LeadId='+ referralId);

  }

  UpdateDealStatus(dealstatus:any){
    return this.http.put(this.ApiUrl + '/referral-status/update', dealstatus);
  }

  GetDealStatus(currentstatus:number){
    return this.http.get(this.ApiUrl + '/referral-status/Get-status/' + currentstatus);
  
  }

  GetBalanace(dataobj:any){
    return this.http.put(this.ApiUrl + '/Get-Balanace',dataobj);
  }

  GetPaymentDetailsDetails(paymentid:string){
    return this.http.get(this.ApiUrl + '/ById?PaymentId=' + paymentid);
  }


  getProductServiceData(id: any) {
    return this.http.get(this.ApiUrl + '/referral/GetProductDetails/' + id);
  }
}
