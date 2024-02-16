import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Token } from '../../../manager/token';
import { Router } from '@angular/router';
import { CommonService } from '../../../service/common.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LoggerService } from 'src/app/service/logger.service';
@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {
  @Input() UserData;
  @Input() IsKYCComplete;
  @Input() PartnerId;
  @Input() UserOtherDetails;
  @Input() PartnerRole;
  @Input() AddEdit;
  @Output() next_page = new EventEmitter<any>();
  @Output() previous_page = new EventEmitter<any>();
  @Output() IsDirtyform = new EventEmitter<any>();
  ResponseHelper: ResponseHelper;
  OtherDetailsForm: FormGroup;
  DisplayError: boolean = false;
  Token: Token;
  UserId: string;

  constructor(private loggerService: LoggerService, private router: Router, private localStorage: LocalStorage, private fb: FormBuilder, private notificationservice: NotificationService, private registrationService: RegistrationService, private commonService: CommonService) {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.Token = new Token(this.router);
    var data = this.Token.GetUserData();
    this.UserId = data.UserId;

    var pageView = {
      "UserId": this.UserId,
      "Url": "",
      "screen": "Other Detail",
      "method": "constuctor",
      "message": "Other Details Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":  this.UserId,
    }
    this.loggerService.Logger(pageView)
  }

  ngOnInit() {
    
    try {
      this.CreateOtherDetailsForm();

      this.OtherDetailsForm.patchValue({ 'canImpartTraining': false });

      // if(this.UserOtherDetails){

      //   this.GetUpdatedData();
      // }
      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {
        
        console.log(" KYC ONinit : " + Id);
        //console.log("UserDetails : "+ this.UserDetails);
        this.PartnerId = Id;

        //if (this.UserDetails) {

        // this.addKycdata();
        // this.localStorage.getItem('AddEdit').subscribe((value) => {


        //   });
        if (this.AddEdit != 'Add') {

          if (this.PartnerId) {
            this.GetUpdatedData();
          }

        }


        // if (this.UserKycData == null && this.Partner_User_Id) {

        //  this.KycForm.patchValue({ userId: this.Partner_User_Id })
        // }
        // else if (this.AddEdit == 'Add') {

        //   this.KycForm.patchValue({ userId: this.Partner_User_Id});

        // }

        //   }


      });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }

  }



  ngDoCheck() {
    try {
      if (this.OtherDetailsForm.dirty) {

        this.IsDirtyform.emit(true)
      }
      else {

        this.IsDirtyform.emit(false)
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "ngDoCheck",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AddOtherDetails() {

    try {
      this.OtherDetailsForm.patchValue({ 'UserId': this.UserOtherDetails.userId });
      // this.OtherDetailsForm.patchValue({ 'father_Husband_Name':  this.UserOtherDetails.father_Husband_Name});
      this.OtherDetailsForm.patchValue({ 'maritalStatus': this.UserOtherDetails.maritalStatus });
      this.OtherDetailsForm.patchValue({ 'nationality': this.UserOtherDetails.nationality });
      this.OtherDetailsForm.patchValue({ 'phoneNo': this.UserOtherDetails.phoneNo });
      this.OtherDetailsForm.patchValue({ 'Hobbies': this.UserOtherDetails.hobbies });
      this.OtherDetailsForm.patchValue({ 'aboutMe': this.UserOtherDetails.aboutMe });
      this.OtherDetailsForm.patchValue({ 'areaOfInterest': this.UserOtherDetails.areaOfInterest });
      this.OtherDetailsForm.patchValue({ 'canImpartTraining': this.UserOtherDetails.canImpartTraining });
      this.OtherDetailsForm.patchValue({ 'updated_By': this.UserId });


    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "AddOtherDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)


    }
  }

  GetUpdatedData() {
    
    try {
      this.registrationService.GetUserDetails(this.PartnerId).subscribe((data) => {

        let response = data.json();

        // this.editpartner=response.data;

        this.UserOtherDetails = response.data.userOtherDetails;

        this.AddOtherDetails();

        this.ResponseHelper.GetSuccessResponse(data)


      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "GetUpdatedData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }




  OtherDetailsSubmit() {
    
    //  this.OtherDetailsForm.value;
    try {
      this.commonService.showLoading();
      this.OtherDetailsForm.patchValue({ 'UserId': this.PartnerId })
      this.OtherDetailsForm.patchValue({ 'updated_By': this.UserId })
    

      if (this.OtherDetailsForm.valid) {

        this.DisplayError = false;

        this.registrationService.SubmitOtherDetails(this.OtherDetailsForm.value)

          .subscribe(

            data => {
              
              let a = [{ message: "Other Details Updated Successfully", type: "SUCCESS" }]

              this.notificationservice.ChangeNotification(a);
              

              if (this.PartnerRole == '' || this.PartnerRole == 'Guest') {

                this.router.navigate(['/partner-list']);
              }
              else if (this.IsKYCComplete == true) {

                this.next_page.emit('otherdetails')

                this.UserData.Is_OtherDetails_completed = true;

              }
              else if (this.IsKYCComplete == false) {

                this.next_page.emit('product');

                this.UserData.Is_Product_Completed = true;


              }


              this.OtherDetailsForm.patchValue({ 'canImpartTraining': false });

              this.commonService.hideLoading();

            }, err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );



      }
      else {
        this.DisplayError = true;
        this.commonService.hideLoading();

        const invalid = [];
        const controls = this.OtherDetailsForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.UserId,
          "Url": "",
          "screen": "Basic Info",
          "method": "fromSubmit",
          "message": "UserData :- " + JSON.stringify(this.OtherDetailsForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.UserId,
        }
        this.loggerService.Logger(invalidField)

      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "OtherDetailsSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



  Skippage() {

    try {
      if (this.PartnerRole == '' || this.PartnerRole == 'Guest') {

        this.router.navigate(['/partner-list']);
      }
      else {

        this.next_page.emit('otherdetails')

        this.UserData.Is_OtherDetails_completed = true;
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "Skippage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Previouspage() {
    try {
      this.previous_page.emit('otherdetails');
      this.UserData.Is_BasicInfo_completed = false;
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "Previouspage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CheckcanImpartTraining(event) {
    try {
      if (event.target.checked == true) {

        this.OtherDetailsForm.patchValue({ 'canImpartTraining': true });

      }
      else {
        this.OtherDetailsForm.patchValue({ 'canImpartTraining': false });
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "CheckcanImpartTraining",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  CreateOtherDetailsForm() {
    try {
      this.OtherDetailsForm = this.fb.group({
        'UserId': [''],
        // 'father_Husband_Name':[''],
        'maritalStatus': [''],
        'nationality': [''],
        'phoneNo': [''],
        'Hobbies': [''],
        'aboutMe': [''],
        'areaOfInterest': [''],
        'canImpartTraining': [''],
        'updated_By': [''],

      });


    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Other Detail",
        "method": "CreateOtherDetailsForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)


    }
  }
}
