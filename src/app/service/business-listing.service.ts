import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// import { environment } from '../../environments/environment';
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessListingService {

  ApiUrl:string='';

  constructor(private http:Http,protected AppConfigService:AppConfigService) { 

    this.ApiUrl = AppConfigService.config.ApiUrl;
  }



  GetCategoryList(data:any){
  
 //  return this.http.get(this.ApiUrl + '/category/all?query' + data);
    return this.http.get(this.ApiUrl + '/category/all?query=&CurrentPage=0')
  }

  AddBusinessDetails(data:any){

    return this.http.post(this.ApiUrl + '/update-business' , data);
  }

  AddcompanyDetails(data:any){

    return this.http.post(this.ApiUrl + '/update-company' ,data);
  }

  AddcompanyLogoDetails(data:any){

    return this.http.post(this.ApiUrl + '/update-company-logo' ,data);
  }

  AddcompanyAddressDetails(data:any){

    return this.http.post(this.ApiUrl + '/update-company-address' ,data);

  }

  

  AddEditProductDetails(data:any){

    return this.http.post(this.ApiUrl + '/update-product-service' ,data);
    
  }

  GetProductServiceList(id:string,type:string){

    return this.http.get(this.ApiUrl + '/product-service/all?userId=' + id  +'&type=' + type);
  }

  getProductServiceData(id:any){
    return this.http.get(this.ApiUrl + '/product-service/details?prodServiceId=' + id);
  }

  GetBusinessList(){
  
    return this.http.get(this.ApiUrl + '/update-business');
  }

  AddcompanypanDetails(data:any){

    return this.http.post(this.ApiUrl + '/upload-pan', data);
  }

  GetBusinessDetails(id:string){
    return this.http.get(this.ApiUrl + '/client-partner/details?userId=' + id);
  }

  Business_Approve_Disapprove(obj){
    return this.http.put(this.ApiUrl + '/approve-business-kyc', obj);
  }
}
