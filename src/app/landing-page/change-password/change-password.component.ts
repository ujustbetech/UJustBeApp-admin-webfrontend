import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './../../service/forgot-password.service';

import { NotificationService } from 'src/app/service/notification.service';
import { customValidation } from 'src/app/manager/customValidators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userData;
  ResetForm: FormGroup;
  DisplayError: boolean = false;
  ResponseHelper;
  DisableSubmit: boolean = false;
  Token: Token;
  UserId: string;
  Isspasswordsame: boolean = false;

  constructor(private forgotPasswordService: ForgotPasswordService, private notificationservice: NotificationService, private router: Router, private loggerService: LoggerService) {

    this.Token = new Token(this.router);
    var data = this.Token.GetUserData();
    this.UserId = data.UserId;
    var data1 = {
      "UserId": "",
      "Url": "",
      "screen": "Change Password",
      "method": "construction",
      "message": "Change Password Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": "",
    }
    this.loggerService.Logger(data1)
  }


  ngOnInit() {
    try {
      this.CreateResetForm();
      this.ResponseHelper = new ResponseHelper(this.notificationservice);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Change Password",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CreateResetForm() {

    try {
      this.ResetForm = new FormGroup({
        User_Id: new FormControl(''),
        oldpassword: new FormControl('', [Validators.required]),
        New_Password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
        confirmnewpass: new FormControl('', [Validators.required,])
      }, { validators: customValidation.MatchPassword })
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Change Password",
        "method": "CreateResetForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ResetPassword() {
    try {
      
      this.DisableSubmit = true;

      let resetobj = {
        'userId': this.UserId,
        'oldPassword': this.ResetForm.value.oldpassword,
        'newPassword': this.ResetForm.value.New_Password
      }

      if (this.ResetForm.valid && this.Isspasswordsame == false) {
        this.DisplayError = false;
        this.forgotPasswordService.ResetPassword(resetobj).subscribe(
          data => {

            this.ResponseHelper.GetSuccessResponse(data)
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);

          }, err => {
            
            this.ResponseHelper.GetFaliureResponse(err)
            this.DisableSubmit = false;

          })
      }
      else {
        this.DisplayError = true;
        this.DisableSubmit = false;

        const invalid = [];
        const controls = this.ResetForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.userData.userId,
          "Url": "",
          "screen": "Change Password",
          "method": "ResetPassword",
          "message": "UserData :- " + JSON.stringify(this.ResetForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.userData.userId,
        }
        this.loggerService.Logger(invalidField)
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Change Password",
        "method": "ResetPassword",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CheckoldAndNewPassword(oldpassword: any, newPassword: any) {

    try {
      if (oldpassword == newPassword) {
        this.Isspasswordsame = true;
      }
      else {
        this.Isspasswordsame = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Change Password",
        "method": "CheckoldAndNewPassword",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  checkMatchpassword(newpasword: string, confirmpass: string) {
    try {
      if (newpasword == confirmpass) {
        this.ResetForm.get('confirmnewpass').setErrors(null);
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Change Password",
        "method": "checkMatchpassword",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }

  }

}
