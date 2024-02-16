import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AppConfigService } from './../service/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  ApiUrl: string = '';
  constructor(private http: Http, protected AppConfigService: AppConfigService) {

    this.ApiUrl = AppConfigService.config.ApiUrl;
  }



  Logger(data: any) {

     this.http.post(this.ApiUrl + '/error-log/insert', data).subscribe(res=>{

     },err=>{

     })
  }
}
