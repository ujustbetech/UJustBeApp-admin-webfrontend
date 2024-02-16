import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {AppConfigService} from './../service/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  ApiUrl:string='';

  constructor(private http:Http,protected AppConfigService:AppConfigService) { 

    this.ApiUrl = AppConfigService.config.ApiUrl;
  }


   SubmitBasicDetails(data:any){
  
    return this.http.post(this.ApiUrl + '/Adminpartnerregister', data);
  }

  SubmitOtherDetails(data:any){
    return this.http.put(this.ApiUrl + '/UpdateOtherDetails', data);
  }

  // UpdateBasicDetails(data:any){
  //   return this.http.post(this.ApiUrl + '/register', data);
  // }

  SubmitQuestionnairreDetails(data:any){
    return this.http.post(this.ApiUrl + '/enroll-partner/Details', data);
  }

  SaveKYCDeatils(data:any){
    return this.http.post(this.ApiUrl + '/add-admin-kyc-request', data);
  }

  SavePanDeatils(data:any){
    return this.http.post(this.ApiUrl + '/upload-pan', data);
  }

  SaveAdharDeatils(data:any){
    return this.http.post(this.ApiUrl + '/upload-aadhar', data);
  }

  SavebankDeatils(data:any){
    return this.http.post(this.ApiUrl + '/upload-bank-details', data);
  }

  Checkemail(data:any){
    return this.http.post(this.ApiUrl + '/email-check', data);
  }

  Checkmobile(data:any){
    return this.http.post(this.ApiUrl + '/mobile-check', data);
  }
  
  
  UserList(data:any){
    return this.http.get(this.ApiUrl + '/Get-partners/5/1', data);
  }

  AllUserDetails(data: any) {
    return this.http.get(this.ApiUrl + '/GetAllUserDetails', data);
  }

  GetUserDetails(id:string){
    return this.http.get(this.ApiUrl + '/GetPartnerDetails/By-Id?UserId=' + id);
  }

  Approve_Disapprove(data:any){
    return this.http.post(this.ApiUrl + '/Approve-Disapprove-BPCP', data);
  }

  GetConnectorList(partnerid:string){
    return this.http.get(this.ApiUrl + '/GetConnectors?UserId=' + partnerid);
  }

  AddProfileImage(ImageData:any){
    return this.http.post(this.ApiUrl + '/update-profile-image', ImageData);
  }

  RemoveProfileImage(ImageData:any){
    return this.http.post(this.ApiUrl + '/update-profile-image', ImageData);
  }
  GetUserInfo(UserId:any){
    return this.http.get(this.ApiUrl + '/user-info?userId='+ UserId);
  }
}
