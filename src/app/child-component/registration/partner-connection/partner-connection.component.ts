import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LoggerService } from 'src/app/service/logger.service';
import { Token } from 'src/app/manager/token';
import { Router } from '@angular/router';
@Component({
  selector: 'app-partner-connection',
  templateUrl: './partner-connection.component.html',
  styleUrls: ['./partner-connection.component.css']
})
export class PartnerConnectionComponent implements OnInit {
  @Input() PartnerId;
  Token: Token;
  userData;
  ConnectorList: any;
  MentorList: any;
  ResponseHelper: ResponseHelper;
  @Output() previous_page = new EventEmitter<any>();
  @Output() next_page = new EventEmitter<any>();
  @Input() UserData;
  IsNOConnets: boolean = false;


  constructor(private loggerService: LoggerService,private router: Router,  private notificationservice: NotificationService, private registrationService: RegistrationService, private localStorage: LocalStorage, ) {
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  ngOnInit() {
    try {
      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {
        
        // console.log(" KYC ONinit : "+Id);
        // console.log("UserDetails : "+ this.UserDetails);
        this.PartnerId = Id;
        if (this.PartnerId) {
          this.GetConnectorList();
        }


      });

      
    var pageView = {
      "UserId":  this.UserData.UserId,
      "Url": "",
      "screen": "Partner Connection",
      "method": "constuctor",
      "message": "Partner Connection Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":   this.UserData.UserId,
    }
    this.loggerService.Logger(pageView)


    } catch (err) {
      var data = {
        "UserId": this.UserData.UserId,
        "Url": "",
        "screen": "Partner Connection ",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetConnectorList() {
    
    try {
      this.registrationService.GetConnectorList(this.PartnerId).subscribe(
        data => {

          this.MentorList = data.json().data.mentorUserInfo;
          this.ConnectorList = data.json().data.connectorUserInfo;

          if (this.ConnectorList == null) {

            // let msg = [{ message: "No Connects Yet", type: "ERROR" }]


            // this.notificationservice.ChangeNotification(msg);

            this.IsNOConnets = true;
          }
          else {

            this.IsNOConnets = false;
          }


        }, err => {
          // this.ResponseHelper.GetFaliureResponse(err);   
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.UserData.UserId,
        "Url": "",
        "screen": "Partner Connection ",
        "method": "GetConnectorList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Backpage() {
    try {

      this.previous_page.emit('connection');

      this.UserData.Is_Product_Completed = false;
    } catch (err) {
      var data = {
        "UserId": this.UserData.UserId,
        "Url": "",
        "screen": "Partner Connection ",
        "method": "Backpage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  GoToNext() {
    try {
      this.next_page.emit('connection');

      this.UserData.Is_Connection_Completed = false;
    } catch (err) {
      var data = {
        "UserId": this.UserData.UserId,
        "Url": "",
        "screen": "Partner Connection ",
        "method": "GoToNext",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }
}
