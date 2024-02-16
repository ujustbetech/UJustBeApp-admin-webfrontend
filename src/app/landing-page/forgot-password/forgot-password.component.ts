import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './../../service/forgot-password.service';

import { NotificationService } from 'src/app/service/notification.service';
// import { customValidation } from 'src/app/manager/customValidators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';
import { LoggerService } from 'src/app/service/logger.service';
import { AppConfigService } from 'src/app/service/app-config.service';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  ForgotForm: FormGroup;
  ResponseHelper;
  DisableSubmit: boolean = false;
  DisplayError: boolean = false;


  constructor(private forgotPasswordService: ForgotPasswordService, private notificationservice: NotificationService, private router: Router, protected AppConfigService: AppConfigService, private loggerService: LoggerService) { 

    var data = {
      "UserId": "",
      "Url": "",
      "screen": "Forgot Password ",
      "method": "constructor",
      "message": "Forgot Password Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":"",
    }
    this.loggerService.Logger(data)

  }

  ngOnInit() {
   try {
      this.CreateForm();
      this.ResponseHelper = new ResponseHelper(this.notificationservice);
   } catch (err) {
    var data = {
      "UserId": "",
      "Url": "",
      "screen": "Forgot Password",
      "method": "ngOnInit",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": ""
    }
    this.loggerService.Logger(data)
     
   }
  }

  CreateForm() {
    try{
    this.ForgotForm = new FormGroup({
      Username: new FormControl('', Validators.required)
    })
  }catch (err){
    var data = {
      "UserId": "",
      "Url": "temp.com",
      "screen": "Forgot Password",
      "method": "FormSubmit",
      "message": "some error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": ""
    }
    this.loggerService.Logger(data)

  }
  }




  ForgotSubmit() {
    
    try {
      if (this.ForgotForm.valid) {
        this.DisplayError = false;
        this.forgotPasswordService.ForgotPassword(this.ForgotForm.value).pipe(finalize(() => {
          this.DisableSubmit = false;
        })).subscribe(
          async data => {

            // var userData = await this.Token.GetUserData()
            var logg: any =
            {
              "UserId": '',
              "Url": this.AppConfigService.config.ApiUrl + '/admin-forgot-password',
              "screen": "Forgot Password",
              "method": "ForgotSubmit",
              "message": "ForgotSubmit Successful for user:" + this.ForgotForm.value.Username,
              "error": "",
              "date": new Date(),
              "source": "WebSite",
              "createdBy": ''
            }
            this.loggerService.Logger(logg)

            this.ResponseHelper.GetSuccessResponse(data)
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }, err => {
            var logg: any =
            {
              "UserId": '',
              "Url": this.AppConfigService.config.ApiUrl + '/admin-forgot-password',
              "screen": "Forgot Password",
              "method": "ForgotSubmit",
              "message": "ForgotSubmit Successful for user" + this.ForgotForm.value.Username,
              "error": "statusText:" + err.statusText + '; status:' + err.status + '; ' + err._body,
              "date": new Date(),
              "source": "WebSite",
              "createdBy": ''
            }
            this.loggerService.Logger(logg)
            this.ResponseHelper.GetFaliureResponse(err)
          })
      }
      else {
        this.DisplayError = true;
        this.DisableSubmit = false;


        const invalid = [];
        const controls = this.ForgotForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": "",
          "Url": "",
          "screen": "Forgot Password",
          "method": "ForgotSubmit",
          "message": "UserData :- " + JSON.stringify(this.ForgotForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": "",
        }
        this.loggerService.Logger(invalidField)
      }
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "temp.com",
        "screen": "Forgot Password",
        "method": "FormSubmit",
        "message": "some error occured",
        "error": err,
        "date": "2012-02-02T01:01:01",
        "source": "WebSite",
        "createdBy": ""
      }
     this.loggerService.Logger(data)
    }
  }




}
