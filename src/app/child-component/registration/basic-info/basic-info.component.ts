import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customValidation } from './../../../manager/customValidators';
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { Token } from '../../../manager/token';
import { CommonService } from 'src/app/service/common.service';
import { Lightbox } from 'ngx-lightbox';
import { AppConfigService } from './../../../service/app-config.service';
import * as CryptoJS from 'crypto-js';
import { LoggerService } from 'src/app/service/logger.service';


@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
  providers: [RegistrationService]
})
export class BasicInfoComponent implements OnInit {
  BasicInfoForm: FormGroup;
  DisplayError: boolean = false;
  NextPage: string = "";
  ResponseHelper: ResponseHelper;
  data: any;
  @Output() next_page = new EventEmitter<any>();
  @Output() onRolePicked = new EventEmitter<any>();
  @Output() IsDirtyform = new EventEmitter<any>();
  @Input() UserData;
  @Input() UserDetails;
  @ViewChild('fileInput') fileInput: ElementRef;
  // @ViewQuery('fileInput') fileInput:ElementRef;
  // @ViewChild('password')
  emailmessage: any;
  mobilemessage: any;
  emailExist: boolean = false;
  mobileExist: boolean = false;
  message: string;
  mobile_message: string;
  UserId: string;
  IsUserIdExixt: boolean = false;
  Registered_User: any;
  Token: Token;
  CountryList: any[];
  editpartner: any;
  SelectedRole: string = "";
  IsRoleGuest: boolean = false;
  IsRolePartner: boolean = false;
  IsRoleClientPartner: boolean = false;
  InitRole: boolean = true;
  File_Profile;
  Filename_Profile: string = "No File chosen";
  fileformat_Profile;
  FileBase64_Profile: any;
  Images_Album: any[];
  // IsRemoveButtonActive:boolean=false;
  clickvalue: any;
  isSingleClick: Boolean = true;
  Profileerror: boolean = false;
  @Input() AddEdit: string;
  Partner_User_Id: string;
  ImageObj: any;
  FileURL_Profile: any = '';
  fileURL_Profile: any = '';
  UniqueName_Profile: any = '';
  Is_Profile_Image: boolean = false;
  validMobileNum: boolean = false;
  encryptSecretKey: any = '';
  BecomeAsMember: string;
  filebase64: any = '';
  ApiUrl: string = "";
  iscomment: boolean = false;
  altmobileExist: boolean = false;
  validAltMobileNum: boolean = false;
  DisplayCommentError: boolean = false;
  ActiveComment:string="";

  constructor(private loggerService: LoggerService, protected AppConfigService: AppConfigService,
    private lightbox: Lightbox, private commonService: CommonService, private router: Router,
    private fb: FormBuilder, private localStorage: LocalStorage,
    private notificationservice: NotificationService, private registrationservice: RegistrationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.Token = new Token(this.router);
    this.ApiUrl = AppConfigService.config.ApiUrl;

  }


  ngOnInit() {

    try {
      
      this.createForm();

      this.GetCountryCodes();
      // this.BasicInfoForm.value.userRole = 'Guest';

      this.IsUserIdExixt = false;
      this.localStorage.getItem('NewPartner').subscribe((NewPartner) => {
        if (NewPartner == "false") {
          this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {
            
            this.Partner_User_Id = Id;

            if (this.AddEdit != "Add") {

              if (this.Partner_User_Id) {
                this.GetUpdatedData();
              }

            }
          });
        }
        else {
          this.createForm();
          this.IsUserIdExixt = false;
          this.ClearProfileImage();
        }
      });

      this.localStorage.getItem('BecomeMember').subscribe((value) => {

        this.BecomeAsMember = value;

        if (this.BecomeAsMember == 'BecomeMember') {
          this.SelectedRole = "Partner";
          this.onRolePicked.emit('Partner');
        }
        else {
          this.BasicInfoForm.patchValue({ 'userRole': 'Guest' });
          this.SelectedRole = "Guest";
        }

      });
      var data2 = this.Token.GetUserData();
      this.UserId = data2.UserId;
      var pageView = {
        "UserId": this.UserData.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "constructor",
        "message": "Basic info Screen viewed",
        "error": '',
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserData.UserId,
      }
      this.loggerService.Logger(pageView)
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data);
    }
  }

  ngDoCheck() {
    try {
      if (this.BasicInfoForm.dirty) {
        // alert('true');
        this.IsDirtyform.emit(true)
      }
      else {
        // alert('false');
        this.IsDirtyform.emit(false)
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
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


  addetails() {
    try {

      this.BasicInfoForm.patchValue({ 'firstName': this.UserDetails.firstName });
      this.BasicInfoForm.patchValue({ 'middleName': this.UserDetails.middleName });
      this.BasicInfoForm.patchValue({ 'lastName': this.UserDetails.lastName });
      this.BasicInfoForm.patchValue({ 'email': this.UserDetails.emailId });
      this.BasicInfoForm.patchValue({ 'mobileNumber': this.UserDetails.mobileNumber });
      this.BasicInfoForm.patchValue({ 'password': this.UserDetails.password });
      this.BasicInfoForm.patchValue({ 'alternateMobileNumber': this.UserDetails.alternateMobileNumber });
      this.BasicInfoForm.patchValue({ 'alternateCountryCode': this.UserDetails.alternateCountryCode });
      if (this.UserDetails.isActiveComment != "" && this.UserDetails.isActiveComment != null) {
        this.ActiveComment= this.UserDetails.isActiveComment;
        this.BasicInfoForm.patchValue({ 'isActiveComment': this.UserDetails.isActiveComment });
        this.iscomment = true;
      }
      if (this.BecomeAsMember == 'BecomeMember') {
        this.BasicInfoForm.patchValue({ 'userRole': 'Guest' });
        // this.SelectedRole = "Partner";
        // this.onRolePicked.emit('Partner');
      }
      else {
        this.BasicInfoForm.patchValue({ 'userRole': this.UserDetails.role });
      }

      this.BasicInfoForm.patchValue({ 'countryCode': this.UserDetails.countryCode });
      this.BasicInfoForm.patchValue({ 'Id': this.UserDetails._id });
      this.BasicInfoForm.patchValue({ 'createdBy': this.UserDetails._id });
      this.BasicInfoForm.patchValue({ 'isActive': this.UserDetails.isActive });


      this.FileURL_Profile = this.ApiUrl + "/" + this.UserDetails.imageURL;
      if (this.UserDetails.imageURL) {
        this.Is_Profile_Image = true;
      }
      this.fileURL_Profile = this.UserDetails.imageURL;
      this.Filename_Profile = this.UserDetails.fileName;
      this.UniqueName_Profile = this.UserDetails.uniqueName;

      if (this.BasicInfoForm.value.Id) {
        this.IsUserIdExixt = true;
      }
      else {
        this.IsUserIdExixt = true;
      }
      // alert(this.IsUserIdExixt);

      var fieldElement = <HTMLInputElement>document.getElementById('pass');
      fieldElement.readOnly = true;

      // this.BasicInfoForm.controls['email'].markAsDirty();

      if (this.BasicInfoForm.value.userRole == 'Guest') {
        
        this.IsRoleGuest = true;
        this.IsRoleClientPartner = false;
        this.IsRolePartner = false;
        if (this.BecomeAsMember == 'BecomeMember') {
          this.onRolePicked.emit('Partner');
        }
        else {
          this.onRolePicked.emit('Guest');
        }
        this.IsUserIdExixt = false;
        this.InitRole = false;
      }
      else if (this.BasicInfoForm.value.userRole == 'Partner') {
        this.IsRolePartner = true;
        this.IsRoleClientPartner = false;
        this.IsRoleGuest = false;
        this.InitRole = false;
        this.onRolePicked.emit('Partner');
        this.IsUserIdExixt = true;

      }
      else {
        this.IsRoleClientPartner = true;
        this.IsRoleGuest = false;
        this.InitRole = false;
        this.IsRolePartner = false;
        this.onRolePicked.emit('Listed_Partner');
        this.IsUserIdExixt = true;
      }


    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "addetails",
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
      this.registrationservice.GetUserDetails(this.Partner_User_Id).subscribe((data) => {

        let response = data.json();

        this.editpartner = response.data;

        this.UserDetails = this.editpartner.userInfo;

        this.addetails();

        this.ResponseHelper.GetSuccessResponse(data)


      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
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

  GetCountryCodes() {
    
    try {

      this.commonService.GetCountryCode().subscribe(data => {
        this.CountryList = data.json().data.countries;
      },
      );
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "GetCountryCodes",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  checkIsPartnerValue(event: any) {
    try {
      
      let isative = event.target.checked;
      this.DisplayCommentError = false;
      if (this.UserDetails.isActive != isative || this.BasicInfoForm.controls['isActiveComment'].value != "") {
        this.iscomment = true;
        this.BasicInfoForm.get('isActiveComment').setValidators([Validators.required]);
        this.BasicInfoForm.patchValue({ 'isActiveComment': "" });
      }
      else if (this.ActiveComment!="") {
        this.iscomment = true;
        this.BasicInfoForm.get('isActiveComment').setValidators([Validators.required]);
        this.BasicInfoForm.patchValue({ 'isActiveComment':this.ActiveComment });        
      }
      else
      {
        this.iscomment = false;
        this.BasicInfoForm.get('isActiveComment').setValidators([null]);
        this.BasicInfoForm.patchValue({ 'isActiveComment':this.ActiveComment }); 
      }
      if (isative == true) {
        this.BasicInfoForm.patchValue({ 'isActive': true });
      }
      else {
        this.BasicInfoForm.patchValue({ 'isActive': false });

      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "checkIsPartnerValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  FormSubmit() {
    try {
      
      this.DisplayCommentError = false;
      // this.encryptData(this.BasicInfoForm.value.password);
      if (this.UserDetails != null) {
        if (this.UserDetails.isActive != this.BasicInfoForm.controls['isActive'].value) {

          if (this.iscomment && this.BasicInfoForm.controls['isActiveComment'].value == "") {

            this.DisplayCommentError = true;
          }
        }
        else
        {
          if (this.iscomment && this.BasicInfoForm.controls['isActiveComment'].value == "" && this.ActiveComment!="" && this.ActiveComment!=null) {

            this.DisplayCommentError = true;
          }
        }
      }


      this.localStorage.removeItem('Partner_User_Id');
      this.localStorage.removeItem('AddEdit');

      this.BasicInfoForm.patchValue({ 'createdBy': this.UserId });
      this.SelectedRole = this.BasicInfoForm.controls['userRole'].value;

      if (this.BasicInfoForm.valid && this.validMobileNum == false && this.emailExist == false && this.mobileExist == false && this.Profileerror == false) {

        this.DisplayError = false;
        this.registrationservice.SubmitBasicDetails(this.BasicInfoForm.value)
          .subscribe(
            data => {
              
              this.Registered_User = data.json().data;
              this.commonService.showLoading();
              if (this.UserDetails) {
                this.GetupdatedData();
              }

              this.localStorage.setItem('Partner_User_Id', this.Registered_User.userId).subscribe(() => {
                this.localStorage.setItem('NewPartner', "false").subscribe(() => { });
              });

              this.localStorage.setItem('AddEdit', 'Add').subscribe(() => { });

              this.AddProfileImage();

              let a = [{ message: "Basic Details Saved Successfully", type: "SUCCESS" }]

              this.notificationservice.ChangeNotification(a);


              if (this.SelectedRole == 'Partner' || this.SelectedRole == 'Listed Partner') {

                this.next_page.emit('basic')

                this.UserData.Is_BasicInfo_completed = true;

              }
              else {
                this.router.navigate(['/partner-list']);
              }

              //if (this.UserDetails) {


              //  if (this.UserDetails.role == 'Guest' && (this.SelectedRole == 'Partner' || this.SelectedRole == 'Listed Partner')) {

              //    this.next_page.emit('basic')

              //    this.UserData.Is_BasicInfo_completed = true;
              //  }
              //  else if (this.UserDetails.role == 'Partner' || this.UserDetails.role == 'Listed Partner') {

              //    this.next_page.emit('basic')

              //    this.UserData.Is_BasicInfo_completed = true;

              //  }
              //  else if (this.SelectedRole == '' || this.SelectedRole == 'Guest') {

              //    this.router.navigate(['/partner-list']);
              //  }
              //  else {
              //    this.router.navigate(['/partner-list']);
              //  }
              //}
              //else {

              //  if (this.SelectedRole == '' || this.SelectedRole == 'Guest') {

              //    this.router.navigate(['/partner-list']);
              //  }
              //  else if (this.SelectedRole == 'Partner' || this.SelectedRole == 'Listed_Partner') {


              //    this.next_page.emit('basic')

              //    this.UserData.Is_BasicInfo_completed = true;

              //  }
              //}

              this.commonService.hideLoading();



            }, err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );



      }
      else {
        
        this.DisplayError = true;
        const invalid = [];
        const controls = this.BasicInfoForm.controls;
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
          "message": "UserData :- " + JSON.stringify(this.BasicInfoForm.value),
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
        "screen": "Basic Info",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  getemailvalue(value: any) {
    
    try {

      let obj = { EmailId: value }

      this.registrationservice.Checkemail(obj)
        .subscribe(
          data => {

            this.emailmessage = data.json();

            this.message = this.emailmessage.message[0].message;

            let a = this.message.substring(this.message.length - 6);
            let b = this.message.substring(this.message.length - 10);

            if (a == "Exists" && b != "not Exists") {

              if (this.UserDetails != undefined) {
                if (this.UserDetails != null) {
                  if (this.UserDetails.emailId == value) {
                    this.emailExist = false;
                  }
                  else {
                    this.emailExist = true;
                  }
                }
                else {
                  this.emailExist = true;
                }
              }
              else {
                this.emailExist = true;
              }
            }
            else {
              this.emailExist = false;
            }
          }, err => {

          }
        );
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "getemailvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  Changecountrycode() {
    try {

      this.BasicInfoForm.patchValue({ 'mobileNumber': '' });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "Changecountrycode",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  getmobilevalue(value: any) {
    
    try {

      let obj = { MobileNo: value }

      this.CheckMobileStartvalue(value);
      this.registrationservice.Checkmobile(obj)
        .subscribe(
          data => {
            
            this.mobilemessage = data.json();

            this.mobile_message = this.mobilemessage.message[0].message;

            let a = this.mobile_message.substring(this.mobile_message.length - 6);
            let b = this.mobile_message.substring(this.mobile_message.length - 10);

            if (a == "Exists" && b != "not Exists") {
              if (this.UserDetails != null) {
                if (this.UserDetails.mobileNumber == value) {
                  this.mobileExist = false;
                }
                else {
                  this.mobileExist = true;
                }
              }
              else {
                this.mobileExist = true;
              }
            }
            else {

              this.mobileExist = false;
            }

          }, err => {
            
            let a = err.json().message[0].message.substring(err.json().message[0].message.length - 6);
            let b = err.json().message[0].message.substring(err.json().message[0].message.length - 10);

            if (a != "Exists" && b == "not Exists") {

              if (this.UserDetails != undefined) {
                this.mobileExist = false;
              }
              else {
                this.mobileExist = true;
              }
            }
            else {

              this.mobileExist = false;
            }
          }
        );

      if (value == this.BasicInfoForm.controls['alternateMobileNumber'].value) {
        this.altmobileExist = true;
      }
      else {
        this.altmobileExist = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "getmobilevalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  getAltMobileValue(value: any) {
    
    try {
      
      this.altmobileExist = false;
      this.validAltMobileNum = false;
      this.altmobileExist = false;
      if (value != "" && value != null) {
        //this.CheckAltMobileStartvalue(value);
        if (this.BasicInfoForm.controls['mobileNumber'].value == value) {
          this.altmobileExist = true;
        }
        else {
          this.altmobileExist = false;
        }
      }
      else {
        this.altmobileExist = false;
        this.validAltMobileNum = false;
        this.altmobileExist = false;
      }

    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "getmobilevalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetupdatedData() {
    try {
      this.registrationservice.GetUserDetails(this.BasicInfoForm.value.Id).subscribe((data) => {

        let response = data.json();

        this.editpartner = response.data;

        this.commonService.changeData(this.editpartner)
        this.ResponseHelper.GetSuccessResponse(data)


      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "GetupdatedData",
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
      

      if (this.SelectedRole == '' || this.SelectedRole == 'Guest') {

        this.router.navigate(['/partner-list']);
      }
      else if ((this.SelectedRole == 'Partner' || this.SelectedRole == 'Listed Partner') && this.UserDetails.role == 'Guest') {


        this.next_page.emit('basic')

        this.UserData.Is_BasicInfo_completed = true;

      }
      else if (this.SelectedRole == 'Partner' || this.SelectedRole == 'Listed Partner') {


        this.next_page.emit('basic')

        this.UserData.Is_BasicInfo_completed = true;
      }
      else {
        this.router.navigate(['/partner-list']);
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
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



  // SelectProfileImage() {
  //   
  //   let ele: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
  //   ele.click();

  // }

  ClearProfileImage() {

    try {
      this.FileBase64_Profile = 'assets/images/user.png'
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "ClearProfileImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetUpalodedProfileImage(event) {
    
    try {
      this.BasicInfoForm.markAsDirty();




      if (event.target.files && event.target.files.length > 0) {

        this.File_Profile = event.target.files[0];
        this.Filename_Profile = this.File_Profile.name;
        this.fileformat_Profile = this.Filename_Profile.substr(this.Filename_Profile.lastIndexOf('.') + 1)

        this.ConvertToBase64_Profile();

        if (this.fileformat_Profile == "png" || this.fileformat_Profile == "jpg" || this.fileformat_Profile == "jpeg"
          || this.fileformat_Profile == "PNG" || this.fileformat_Profile == "JPG" || this.fileformat_Profile == "JPEG") {
          this.Profileerror = false;
        }

        else {
          this.Profileerror = true;
        }
      }
      else {
        this.File_Profile = null;
        this.Filename_Profile = null;
        this.Filename_Profile = "No File chosen"
      }
      this.fileInput.nativeElement.value = '';
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "GetUpalodedProfileImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CheckMobileStartvalue(mobileNo: any) {
    
    this.validMobileNum = false
    try {
      let countryCode = this.BasicInfoForm.value.countryCode;
      if (countryCode == '+91') {
        //
        if (mobileNo.charAt(0) == '6' || mobileNo.charAt(0) == '7' || mobileNo.charAt(0) == '8' || mobileNo.charAt(0) == '9') {
          this.validMobileNum = false
        }
        else {
          this.validMobileNum = true
        }
      } else {
        this.validMobileNum = false
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "CheckMobileStartvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CheckAltMobileStartvalue(mobileNo: any) {
    
    this.validAltMobileNum = false
    try {
      let countryCode = this.BasicInfoForm.value.countryCode;
      if (countryCode == '+91') {
        //
        if (mobileNo.charAt(0) == '6' || mobileNo.charAt(0) == '7' || mobileNo.charAt(0) == '8' || mobileNo.charAt(0) == '9') {
          this.validAltMobileNum = false
        }
        else {
          this.validAltMobileNum = true
        }
      } else {
        this.validAltMobileNum = false
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "CheckMobileStartvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  // fileInputclick(){
  //   
  //   let ele: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
  //     // let ele=this.fileInput.nativeElement;
  //           ele.click;

  // }


  openImageBox() {
    
    try {

      if (this.fileURL_Profile || this.filebase64) {
        this.Images_Album = [{ src: this.FileURL_Profile, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "openImageBox",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }


  }


  close() {

    try {
      this.lightbox.close();
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "close",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  ConvertToBase64_Profile() {
    
    try {
      let reader = new FileReader();
      reader.readAsDataURL(this.File_Profile);
      reader.onload = () => {

        this.FileURL_Profile = reader.result;
        this.filebase64 = reader.result;


        if (this.FileURL_Profile != '') {
          this.Is_Profile_Image = true;
        }
        this.FileBase64_Profile = reader.result.toString().split(',')[1];

      }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "ConvertToBase64_Profile",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AddProfileImage() {
    
    try {
      if (this.UserDetails) {

        var userId = this.BasicInfoForm.value.Id

        this.ImageObj = {
          userId: userId,
          ImageBase64: this.FileBase64_Profile,
          FileName: this.Filename_Profile,
          ImageURL: this.fileURL_Profile,
          UniqueName: this.UniqueName_Profile
        }
      }
      else {
        var userId = this.Registered_User.userId

        this.ImageObj = {
          userId: userId,
          ImageBase64: this.FileBase64_Profile,
          FileName: this.Filename_Profile,
          ImageURL: '',
          UniqueName: ''
        }
      }




      this.registrationservice.AddProfileImage(this.ImageObj).subscribe((data) => {

        // this.ResponseHelper.GetSuccessResponse(data)
        // let msg = [{ message: "Partner Profile Added Successfully", type: "SUCCESS" }]

        // this.notificationservice.ChangeNotification(msg);


      }, err => {
        // this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "AddProfileImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  RemoveImageConfirmation(flag: any) {
    if (flag) {
      this.RemoveProfileImage();
    }
    else {

    }
  }

  RemoveProfileImage() {

    try {
      this.BasicInfoForm.markAsDirty();

      this.FileBase64_Profile = '';

      if (this.BasicInfoForm.value.Id) {
        let ImageremoveObj = {
          userId: this.BasicInfoForm.value.Id,
          ImageBase64: '',
          FileName: '',
          ImageURL: '',
          UniqueName: ''
        }

        this.registrationservice.RemoveProfileImage(ImageremoveObj).subscribe((data) => {

          // let msg = [{ message: "Profile Image Removed", type: "SUCCESS" }]

          // this.notificationservice.ChangeNotification(msg);
          this.FileURL_Profile = "assets/images/user.png";
          this.Is_Profile_Image = false;
          this.FileBase64_Profile = '';
          this.fileURL_Profile = '';


        }, err => {
          // this.ResponseHelper.GetFaliureResponse(err)
        });
      }
      else {
        let msg = [{ message: "Profile Image Removed", type: "SUCCESS" }]
        this.notificationservice.ChangeNotification(msg);
        this.FileURL_Profile = "assets/images/user.png";
        this.Is_Profile_Image = false;
        this.FileBase64_Profile = '';
        this.fileURL_Profile = '';
      }

    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "RemoveProfileImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }

  }



  OnRoleSelect(event) {
    
    try {
      this.SelectedRole = event.target.value;

      if (this.AddEdit != "Add") {
        this.onRolePicked.emit(this.SelectedRole);
      }


      if (this.SelectedRole == 'Guest') {
        this.IsUserIdExixt = false;
      }
      // else if(this.SelectedRole == 'Partner'){
      //   this.IsUserIdExixt = true;      
      // }
    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "OnRoleSelect",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  createForm() {
    try {
      this.BasicInfoForm = this.fb.group({
        'firstName': ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
        'middleName': ['', Validators.pattern('^[a-zA-Z ]*$')],
        'lastName': ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
        // 'email': ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
        'email': [null, Validators.required],
        'mobileNumber': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
        'userRole': ['Guest', Validators.required],
        'countryCode': ['+91', Validators.required],
        'socialMediaId': [''],
        'socialMediaType': [''],
        'createdBy': [''],
        'Id': [''],
        'isActive': ['true'],
        'altcountryCode': ['+91'],
        'alternateMobileNumber': ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
        'isActiveComment': ['']
      }, {
          validator: Validators.compose([customValidation.isEmailValid])
        });


    } catch (err) {
      var data = {
        "UserId": this.UserId,
        "Url": "",
        "screen": "Basic Info",
        "method": "createForm",
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
