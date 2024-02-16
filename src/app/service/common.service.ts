import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { BehaviorSubject } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {AppConfigService} from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private dataSource = new BehaviorSubject([]);
  ApiUrl:string ="";
 // currentData = this.dataSource.asObservable();



  constructor(private http:Http,protected AppConfigService:AppConfigService,public spinnerService: Ng4LoadingSpinnerService) { 
   
    this.ApiUrl = AppConfigService.config.ApiUrl;
  
  }

  changeData(data: any) {       
    this.dataSource.next(data)
  }



  GetMentorList(data:any){
  
    return this.http.post(this.ApiUrl + '/mentor/mentor-list', data);
  }

  GetCountryCode(){
  
    return this.http.get(this.ApiUrl + '/Get-countries');
  }

  GetStates(countryCode:number,param:any){
    
    return this.http.get(this.ApiUrl + '/search-state/'+ countryCode + '/' + param);
  }


  GetPartnerAndClientPartners(param:any){
  return this.http.get(this.ApiUrl +'/Get-UserAutocomplete?query' + param);
  }

  showLoading() {
    this.spinnerService.show();
  }
  hideLoading() {
    this.spinnerService.hide();
  }

}
