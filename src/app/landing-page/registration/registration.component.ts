import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../../src/app/service/common.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BusinessListingService } from '../../../../src/app/service/business-listing.service';
import { Router, NavigationEnd, Event, RoutesRecognized } from "@angular/router";
import { RegistrationService } from "../../../../src/app/service/registration.service";
import { LoggerService } from 'src/app/service/logger.service';
import { DOCUMENT } from '@angular/common';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';
import { filter, pairwise } from 'rxjs/operators';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  basicdetails: boolean = false;
  ShowTabName: string = 'basic';
  userData;
  UserComplete = true;
  editpartner: any;
  UserDetails: any;
  UserKycData: any;
  AddEdit: string = 'Add';
  PartnerId: string;
  editbusiness: any;
  IsPartnerActive: boolean = false;
  UserOtherDetails: any;
  PartnerRole: string;
  // PartnerBusinessData:any;
  isKYCComplete: boolean = false;
  Role: any;
  BusinessId: string;
  aceessflag: boolean = false;
  currentTab: string;
  nextTab: string;
  ReferralPercentageAmount: boolean = false;
  Dirtyform: any;
  SubscriptionToBusiness: string;
  BecomeAsMember: string;
  cnt: number = 0;

  constructor(@Inject(DOCUMENT) private _document: Document,
    private businessListingService: BusinessListingService, private localStorage: LocalStorage, private commonService: CommonService, private router: Router, private registrationservice: RegistrationService, private loggerService: LoggerService) {
    // window.scrollTo(0,document.body.scrollHeight);
    // this.localStorage.getItem('SetCurrentTab').subscribe((tab) => {
    //   if(tab=="business")
    //   {
    //     console.log(tab);
    //   this.router.events
    //   .pipe(filter((e: any) => e instanceof RoutesRecognized),
    //       pairwise()
    //   ).subscribe((e: any) => {
    //       console.log(e[0].urlAfterRedirects); // previous url

    //       if(e[0].urlAfterRedirects=="/fee-management")
    //       {
    //         window.scrollTo(0,document.body.scrollHeight);
    //       }
    //   });
    //   }

    // });

    var data = {
      "UserId": "",
      "Url": "",
      "screen": "registration",
      "method": "constructor",
      "message": "Registration Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": "",
    }
    this.loggerService.Logger(data)




  }

  ngOnInit() {

    try {
      // this.cnt=0;
      this.userData = {};
      this.userData.Is_BasicInfo_completed = false;
      this.userData.Is_Questionnarie_completed = false;
      this.userData.Is_Kyc_completed = false;
      this.userData.Is_Business_Completed = false;
      this.userData.Is_Product_Completed = false;
      this.userData.Is_Connection_Completed = false;
      this.userData.Is_OtherDetails_completed = false;
      // localStorage.removeItem('Registered_User');
      this.localStorage.removeItem('Businessdata');
      this.localStorage.getItem('NewPartner').subscribe((NewPartner) => {


        let AddNewPartner = NewPartner;
        // alert(AddNewPartner)
        if (AddNewPartner == "false") {

          this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {

            this.PartnerId = Id;

            this.localStorage.getItem('AddEdit').subscribe((value) => {

              this.AddEdit = value;
              this.GetUserInfo();
              if (this.Role == "Listed_Partner") {
                this.GetBusinessDetail();
              }

            });

          });

          this.localStorage.getItem('RefreshPage').subscribe((Id) => {
            if (Id == 'true') {
              // this.localStorage.removeItem('RefreshPage').subscribe(() => {  });
              this.localStorage.setItem('RefreshPage', 'false').subscribe(() => { });
              // this._document.defaultView.location.reload(); 
            }

          });

        }
        else {
          this.localStorage.removeItem('Partner_User_Id').subscribe(() => { });;
          this.localStorage.removeItem('Businessdata').subscribe(() => { });;
          this.localStorage.setItem('AddEdit', 'Add').subscribe(() => { });
          this.AddEdit = "Add";
          this.commonService.changeData("");
          this.changeTab("basic");
        }

      });

      this.localStorage.getItem('BecomeMember').subscribe((value) => {

        this.BecomeAsMember = value;


      });
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }

  }


  GetBusinessDetail() {

    try {
      this.businessListingService.GetBusinessDetails(this.PartnerId).subscribe((data) => {

        let response = data.json();

        this.BusinessId = response.data.businessId;

        // alert(this.BusinessId);
      });

    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "GetBusinessDetail",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)
    }
  }

  // Percentage_Share(event){

  //   if(event == 'Bothtrue' || event == 'Singletrue'){

  //       this.ReferralPercentageAmount = true;

  //   }
  //   else if(event == 'Bothfalse' || event == 'Singlefalse'){

  //     this.ReferralPercentageAmount = false;

  //   }

  // }

  IsDirtyform(e) {
    try {

      this.Dirtyform = e;
    } catch (err) {

      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "IsDirtyform",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }

  }

  next_page(e) {


    try {
      if (e == 'basic') {
        this.userData.Is_BasicInfo_completed = true;
        this.ShowTabName = 'questionnaire';
      }
      else if (e == 'questionnaire') {
        this.userData.Is_Questionnarie_completed = true;
        this.ShowTabName = 'kyc';
      }
      else if (e == 'kyc') {
        this.userData.Is_Kyc_completed = true;
        this.ShowTabName = 'otherdetails';
      }
      else if (e == 'otherdetails') {
        this.userData.Is_OtherDetails_completed = true;
        this.ShowTabName = 'business';
      }
      else if (e == 'business') {
        this.userData.Is_Business_Completed = true;
        this.ShowTabName = 'product';
      }
      else if (e == 'product') {
        this.userData.Is_Product_Completed = true;
        this.ShowTabName = 'connection';
      }
      else {
        this.userData.Is_Connection_Completed = true;
        this.ShowTabName = 'Referral';
      }
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "next_page",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }
  }

  navigation(access) {

    try {
      this.nextTab = access;
      this.currentTab = this.ShowTabName;



      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {


        this.PartnerId = Id;


        if (this.currentTab != 'connection' && this.currentTab != 'Referral') {

          if (this.PartnerId && this.Dirtyform) {

            document.getElementById("openModal_Button").click();
          }
          else {
            ''
            // this.changeTab(access);
            if (this.PartnerId == null || this.PartnerId == '') {
              alert("Please Fill Details marks with astriks and register partner");
            }
            else if (this.BecomeAsMember == 'BecomeMember' && this.PartnerId) {


              this.GetUserInfo();
              if ((this.nextTab != 'questionnaire' && this.nextTab != 'basic') && (this.UserDetails.gender == '' || this.UserDetails.gender == null)) {
                alert("Please Fill Details marks with astriks and register partner");
              }
              else if (this.nextTab == 'kyc' && this.UserDetails.gender) {
                this.changeTab(access);
              }
              else {
                this.IsPartnerActive = true;
                this.AddEdit = 'Edit';
                this.onRolePicked('Partner');
                this.Role = 'Partner';
                this.changeTab(access);

              }

            }

            else {
              this.changeTab(access);
            }
          }

        }

        else {
          this.changeTab(access);
        }


        // if(this.PartnerId == null || this.PartnerId == '' ){
        //   alert("Please Fill Details marks with astriks and register partner");
        // }
        // else{
        //   this.changeTab(access);
        // }

      });
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "navigation",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }

  }



  changeTab(access) {


    try {

      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {

        this.PartnerId = Id;

      });

      if (access == 'basic') {
        this.ShowTabName = 'basic';

      }
      else if (access == 'questionnaire') {
        this.userData.Is_BasicInfo_completed = true;
        this.ShowTabName = 'questionnaire';
      }
      else if (access == 'kyc') {
        this.userData.Is_Questionnarie_completed = true;
        this.ShowTabName = 'kyc';
      }
      else if (access == 'otherdetails') {
        this.userData.Is_Kyc_completed = true;
        this.ShowTabName = 'otherdetails';
      }
      else if (access == 'business') {
        this.userData.Is_OtherDetails_completed = true;
        this.ShowTabName = 'business';
      }
      else if (access == 'product') {
        this.userData.Is_Business_Completed = true;
        this.ShowTabName = 'product';
      }
      else if (access == 'partner_referal') {
        this.userData.Is_Connection_Completed = true;
        this.ShowTabName = 'Referral';
      }
      else if (access == 'connection') {
        this.userData.Is_Product_Completed = true;
        this.ShowTabName = 'connection';

      }
      else {
        this.ShowTabName = 'Basic';
      }

      this.localStorage.setItem('SetCurrentTab', access).subscribe(() => {


      });

    } catch (err) {

      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "changeTab",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)


    }

  }

  save(flag: boolean) {
    try {
      this.aceessflag = flag;
      var access = "";
      if (flag) {
        access = this.currentTab;
      }
      else {
        access = this.nextTab;
      }
      this.changeTab(access);

    } catch (err) {


      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "save",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }
  }

  previous_page(page) {
    try {

      if (page == 'questionnaire') {
        this.ShowTabName = 'basic';
      }
      else if (page == 'kyc') {
        this.ShowTabName = 'questionnaire';
      }
      else if (page == 'otherdetails') {
        this.ShowTabName = 'kyc';
      }
      else if (page == 'business') {
        this.ShowTabName = 'otherdetails';
      }
      else if (page == 'product') {
        this.ShowTabName = 'business';
      }
      else if (page == 'connection') {
        this.ShowTabName = 'product';
      }
    } catch (err) {

      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "previous_page",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }

  }

  iskycCompleted(iskyc: any) {
    try {
      this.isKYCComplete = iskyc;
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "iskycCompleted",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }
  }

  Addedit(value: any) {
    try {
      this.AddEdit = value;
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "Addedit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)


    }
  }

  isPartnerActive(ispartner: any) {
    try {
      this.IsPartnerActive = ispartner;
    } catch (err) {

      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "isPartnerActive",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)
    }
  }


  onRolePicked(role) {

    try {

      this.PartnerRole = role;


      if (this.PartnerRole == 'Partner') {
        this.isKYCComplete = false;

        this.IsPartnerActive = true;
      }
      else if (this.PartnerRole == 'Listed_Partner') {

        this.IsPartnerActive = true;

      }
      else {
        this.IsPartnerActive = false;
      }
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "onRolePicked",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }
    // alert("isKYCComplete : "+ this.isKYCComplete);
    // alert("AddEdit : "+ this.AddEdit);
    // alert("IsPartnerActive : "+ this.IsPartnerActive)
  }
  AddNewPartner() {

    try {
      this.localStorage.setItem('NewPartner', "true").subscribe(() => {
        this.localStorage.removeItem('Partner_User_Id').subscribe(() => { }, () => { });
        this.localStorage.removeItem('SetCurrentTab').subscribe(() => { }, () => { });
        this.localStorage.removeItem('Businessdata').subscribe(() => { }, () => { });

        // this.localStorage.removeItem('Partner_User_Id');
        // this.localStorage.removeItem('SetCurrentTab');
        // this.localStorage.removeItem('Businessdata');
        this.localStorage.setItem('AddEdit', 'Add');
        window.location.reload();
      });
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "AddNewPartner",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }

    // this.IsPartnerActive =false;

    //   this.commonService.changeData("");    
    //   this.changeTab("basic");
    //  // this.
    //this.router.navigate(['/registration']);
  }

  GetUserInfo() {

    try {
      this.registrationservice.GetUserInfo(this.PartnerId)
        .subscribe(
          data => {
            let res = data.json();

            this.UserDetails = res.data;
            this.Role = this.UserDetails.role;
            if (this.Role == "Listed Partner") {

              this.Role = "Listed_Partner";
              this.isKYCComplete = true;
            } else {
              if (this.UserDetails.kycApprovalStatus == "Approved") {
                // this.isKYCComplete = true;
              }
              else {
                this.isKYCComplete = false;
              }
            }
            if (this.Role == 'Partner' || this.Role == 'Listed_Partner') {

              this.IsPartnerActive = true;
            }
            else {
              this.IsPartnerActive = false;
            }

            this.localStorage.getItem('SetCurrentTab').subscribe((accessTab) => {

              if (accessTab == 'questionnaire') {
                this.Role = 'Partner';
                this.AddEdit = 'Edit';
                this.IsPartnerActive = true;
              }
              else if (accessTab == 'business') {
                this.isKYCComplete = true;
                this.AddEdit = 'Edit';
                this.IsPartnerActive = true;

              }

              if (this.BecomeAsMember == 'BecomeMember') {
                this.AddEdit = 'Edit';
                this.Role = 'Partner';
              }
              if (this.BecomeAsMember == 'ListYourBusiness') {
                this.AddEdit = 'Edit';
                this.Role = 'Listed_Partner';
              }

              // this.onRolePicked(this.Role);
              this.changeTab(accessTab);

            });

          }, err => {

          }
        );
    } catch (err) {
      var data = {
        "UserId": "",
        "Url": "",
        "screen": "registration",
        "method": "GetUserInfo",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": "",
      }
      this.loggerService.Logger(data)

    }
  }
}
