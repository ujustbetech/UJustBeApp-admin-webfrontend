import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { LoginService } from './../../service/login.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import { AppConfigService } from 'src/app/service/app-config.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  DisplayError: Boolean = false;
  ResponseHelper: ResponseHelper;
  Token: Token;
  @ViewChild('loginbtn') loginbtn: ElementRef;


  constructor(private notificationservice: NotificationService, private localStorage: LocalStorage, private loginservice: LoginService, private router: Router, protected AppConfigService: AppConfigService, private loggerService: LoggerService) {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Token = new Token(this.router);
    this.Token.ClearUserData();

    var data = {
      "UserId": "",
      "Url": "",
      "screen": "Login",
      "method": "constructor",
      "message": "Login Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": "",
    }
    this.loggerService.Logger(data)
  }


  ngOnInit() {
    this.createForm();
  }

  FormSubmit() {
    try {
      this.localStorage.clear();

      this.loginbtn.nativeElement.disabled = true;

      if (this.LoginForm.valid) {

        this.DisplayError = false;

        this.loginservice.Login(this.LoginForm.value).subscribe(
          data => {

            this.Token.SetLoginToken(JSON.stringify(data.json().data));



            // setTimeout(() => {   

            //     this.router.navigate(['/change-password']);

            // }, 2000);

            // this.router.navigate(['/dashboard']);

            // this.localStorage.removeItem('Partner_User_Id').subscribe(() => {}, () => {});

            this.router.navigate(['/partner-list']);

          }, err => {
            let a = [{ message: "Please enter valid credentials", type: "ERROR" }]

            this.notificationservice.ChangeNotification(a)
          }
        );
      }
      else {
        this.DisplayError = true;
        const invalid = [];
        const controls = this.LoginForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": "",
          "Url": "",
          "screen": "Login",
          "method": "FormSubmit",
          "message": "UserData :- " + JSON.stringify(this.LoginForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": "",
        }
        this.loggerService.Logger(invalidField)

      }

      setTimeout(() => {


        this.loginbtn.nativeElement.disabled = false;


      }, 1 * 3000);
    } catch (error) {

    
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "Login",
        "method": "FormSubmit",
        "message": "error occured",
        "error": error.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": ""
      }
      this.loggerService.Logger(data)
      //
    }



  }

  Getchange() {
    try {

      this.loginbtn.nativeElement.disabled = false;

    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "Login",
        "method": "Getchange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": ""
      }
      this.loggerService.Logger(data)
    }
  }


  createForm() {
    try {
      this.LoginForm = new FormGroup({
        Username: new FormControl('', [Validators.required
        ]),
        Password: new FormControl('', [Validators.required
        ])
      })
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "Login",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": ""
      }
      this.loggerService.Logger(data)
    }
  }
}
