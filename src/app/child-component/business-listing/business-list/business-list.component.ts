import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BusinessListingService } from './../../../service/business-listing.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { Router, NavigationEnd, Event, RoutesRecognized } from "@angular/router";
import { CommonService } from '../../../../../src/app/service/common.service';
import { Lightbox } from 'ngx-lightbox';
import { AppConfigService } from './../../../service/app-config.service';
import { customValidation } from './../../../manager/customValidators';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';
import { filter, pairwise } from 'rxjs/operators';
import { RegistrationService } from "./../../../service/registration.service";


@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  Token: Token;
  user;
  categoryList: any[];
  BusinessForm: FormGroup;
  DisplayError: boolean = false;
  ResponseHelper: ResponseHelper;
  UserId: string;
  File;
  FileBase64;
  Filename: string;
  fileformat: string;
  typeerror: boolean = false;
  selectedvalue: string;
  // BusinessId:string;
  Partner_User_Id: string;
  lengthError: boolean = false;
  File_Pan;
  FileBase64_Pan: any = '';
  Filename_Pan: string;
  fileformat_Pan: string;
  typeerror_pan: boolean = false;
  editbusiness: any;
  BusinessPanData: any = '';
  BusinessLogoData: any = '';
  Categories: any = [];
  @Input() PartnerId;
  @Input() isKYCComplete;
  @Input() Role;
  @Input() UserData;
  @Output() next_page = new EventEmitter<any>();
  @Output() IsDirtyform = new EventEmitter<any>();
  // @Output() Percentage_Share = new EventEmitter<any>();
  @Output() previous_page = new EventEmitter<any>();
  @ViewChild('closemodal') closemodal: ElementRef;
  AddEdit: string;
  Images_Album: any;
  IsReasonActive: boolean = false;
  BusiessApprovedForm: FormGroup;
  DisplayError1: boolean = false;
  Pan64: any;
  IsApprovedBusiness: boolean = true;
  AlreadyApproved: boolean = false;
  approvedvalue: any;
  IsFeePending: boolean = false;
  IsBusinessRejected: boolean = false;
  panobj: any;
  companylogodetails: any;
  fileURL_Pan: any = '';
  FileURL_Pan: any = '';
  UniqueName_Pan: any = '';
  selectedCategories: any = [];
  IspercentageShare: boolean = false;
  percentageShareList: any = [];
  FileURL_Logo: any = '';
  fileURL_Logo: any = '';
  logoImageType: any = '';
  logoImageName: any = '';
  IsPartnershipFirm: boolean = false;
  IsLLP: boolean = false;
  isNan: boolean = false;
  isNan1: boolean = false;

  ApiUrl: string = "";
  previousUrl: string;


  constructor(protected AppConfigService: AppConfigService, private lightbox: Lightbox, private commonService: CommonService, private router: Router, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private businessListingService: BusinessListingService, private loggerService: LoggerService, private registrationservice: RegistrationService, private el: ElementRef) {


    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Token = new Token(this.router);
    this.user = this.Token.GetUserData()
    this.ApiUrl = AppConfigService.config.ApiUrl;

    this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {

      this.Partner_User_Id = Id;

    });

    this.localStorage.getItem('AddEditBusiness').subscribe((value) => {

      this.AddEdit = value;

    });


    var pageView = {
      "UserId": this.Partner_User_Id,
      "Url": "",
      "screen": "Business List",
      "method": "constuctor",
      "message": "Business List Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.Partner_User_Id,
    }
    this.loggerService.Logger(pageView)


  }

  ngOnInit() {
      try {
      this.GetCategoryList();
      this.createForm();
      // this.BusinessForm.patchValue({ 'UserType': ''})
      this.createAppproveForm();
      this.ClearbusinessApprovedForm();
      this.GetUpdatedData();
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }


  }

  ngDoCheck() {
    try {
      if (this.BusinessForm.dirty) {

        this.IsDirtyform.emit(true)
      }
      else {

        this.IsDirtyform.emit(false)
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "ngDoCheck",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AddBusinessDetails() {
    try {
    
      this.BusinessForm.patchValue({ 'userId': this.editbusiness.userId });
      this.BusinessForm.patchValue({ 'businessId': this.editbusiness.businessId });
      this.BusinessForm.patchValue({ 'tagLine': this.editbusiness.tagline });
      this.BusinessForm.patchValue({ 'BusinessDescription': this.editbusiness.businessDescription });
      this.BusinessForm.patchValue({ 'WebsiteUrl': this.editbusiness.businessUrl });
      this.BusinessForm.patchValue({ 'Location': this.editbusiness.address.location });
      this.BusinessForm.patchValue({ 'Flat_Wing': this.editbusiness.address.flat_Wing });
      this.BusinessForm.patchValue({ 'Locality': this.editbusiness.address.locality });
      this.BusinessForm.patchValue({ 'GSTNumber': this.editbusiness.businessGST });
      this.BusinessForm.patchValue({ 'companyName': this.editbusiness.businessName });
      this.BusinessForm.patchValue({ 'BusinessEmail': this.editbusiness.businessEmail });
      this.BusinessForm.patchValue({ 'panNumber': this.editbusiness.businessPan.panNumber });
      this.BusinessForm.patchValue({ 'NameofPartner': this.editbusiness.nameofPartner });
      this.BusinessForm.patchValue({ 'UserType': this.editbusiness.userTypeId });


      if (this.editbusiness.userTypeId == '1') {
        this.IsPartnershipFirm = false;
        this.IsLLP = false;
        //this.BusinessForm.get('companyName').setErrors(null);
        this.BusinessForm.get('NameofPartner').setErrors(null);

      }
      else if (this.editbusiness.userTypeId == '2') {
        this.IsPartnershipFirm = true;
        this.IsLLP = false;
        this.BusinessForm.get('NameofPartner').setValidators([Validators.required]);
        this.BusinessForm.get('companyName').setValidators([Validators.required]);

      }
      else if (this.editbusiness.userTypeId == '3') {
        this.IsLLP = true;
        this.IsPartnershipFirm = false;
        this.BusinessForm.get('NameofPartner').setValidators([Validators.required]);
        this.BusinessForm.get('companyName').setValidators([Validators.required]);

      }
      else if (this.editbusiness.userTypeId == '4') {

        this.IsPartnershipFirm = false;
        this.IsLLP = false;
        this.BusinessForm.get('NameofPartner').setErrors(null);
        this.BusinessForm.get('companyName').setValidators([Validators.required])

      }
      else {

        this.IsPartnershipFirm = false;
        this.IsLLP = false;
        this.BusinessForm.get('NameofPartner').setErrors(null);
        this.BusinessForm.get('companyName').setErrors(null);
      }

      if (this.editbusiness.businessLogo) {

        this.BusinessForm.patchValue({ 'logoBase64': this.editbusiness.businessLogo.logoBase64 });

        this.FileBase64 = this.editbusiness.businessLogo.logoBase64;

        this.FileURL_Logo = this.ApiUrl + "/" + this.editbusiness.businessLogo.logoImageURL;
        this.fileURL_Logo = this.editbusiness.businessLogo.logoImageURL;


        this.logoImageName = this.editbusiness.businessLogo.logoImageName;
        this.logoImageType = this.editbusiness.businessLogo.logoImageType;
      }
     
      this.FileURL_Pan = this.ApiUrl + "/" + this.editbusiness.businessPan.imageURL;
      this.fileURL_Pan = this.editbusiness.businessPan.imageURL;
      this.Filename_Pan = this.editbusiness.businessPan.fileName;
      this.UniqueName_Pan = this.editbusiness.businessPan.uniqueName;


      for (let i = 0; i < this.editbusiness.categories.length; i++) {

        this.Categories.push(this.editbusiness.categories[i].id);
      }

      this.BusinessForm.patchValue({ 'categories': this.Categories });
      //  this.SelectedCategories();

      if (this.editbusiness.isApproved.flag == 2) {
       
        this.BusiessApprovedForm.patchValue({ 'isApproved': "2" });
        this.IsReasonActive = true;
        this.BusiessApprovedForm.patchValue({ 'rejectedReason': this.editbusiness.isApproved.reason });

      }
      else {
        this.IsReasonActive = false;

      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "AddBusinessDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }


  }


  GetUpdatedData() {
    try {
      if (this.PartnerId) {

        this.businessListingService.GetBusinessDetails(this.PartnerId).subscribe((data) => {

          let response = data.json();

          this.editbusiness = response.data;

         // console.log("Business", this.editbusiness);

          this.BusinessPanData = this.editbusiness.businessPan;

          this.BusinessLogoData = this.editbusiness.businessLogo;

          this.IsFeePending = this.editbusiness.isFeePending;

          if (this.editbusiness.businessId) {

            this.IsApprovedBusiness = false;

          }

          if (this.editbusiness.isApproved != null) {

            if (this.editbusiness.isApproved.flag == 1) {

              this.IsApprovedBusiness = true;

              this.IsBusinessRejected = false;

              // this.BusinessForm.get('categories').disable();      
              var fieldElement = <HTMLInputElement>document.getElementById('cat');
              //fieldElement.disabled = true;

            }
            else if (this.editbusiness.isApproved.flag == 2) {

              this.IsApprovedBusiness = false;
              this.IsBusinessRejected = true;

            }
            else {
              this.IsApprovedBusiness = false;

              this.IsBusinessRejected = false;
            }

          }

          //console.log("business", this.editbusiness);

          this.localStorage.setItem('edit_business_id', this.editbusiness.businessId);

          // if(this.editbusiness.userId){

          this.AddBusinessDetails();

          // }
        }
        );
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetUpdatedData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  onKey() {
    try {
   
      if (this.BusinessForm.value.Locality == undefined || this.BusinessForm.value.Locality == "") {

        this.isNan = false;
      } else {

        if (isNaN(Number(this.BusinessForm.value.Locality))) {
  
          this.isNan = false;

        } else {
          this.isNan = true;

        }
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "onKey",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  onKey1() {
    try {
   
      if (this.BusinessForm.value.Location == undefined || this.BusinessForm.value.Location == "") {

        this.isNan1 = false;
      } else {

        if (isNaN(Number(this.BusinessForm.value.Location))) {
        
          this.isNan1 = false;

        } else {
          this.isNan1 = true;

        }
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "onKey1",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  openImage(ImageName) {
   
    try {
      if (ImageName == 'CompanyLogo' && this.fileURL_Logo) {
        this.Images_Album = [{ src: this.FileURL_Logo, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }
      else if (ImageName == 'CompanyPan' && this.fileURL_Pan) {
        this.Images_Album = [{ src: this.FileURL_Pan, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);

      }

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "openImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  closeImage() {

    try {
      this.lightbox.close();
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "closeImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }
  }


  SelectedCategories() {
    try {

      this.Checkcategorieslenght();

      this.percentageShareList = [];

      this.selectedCategories = this.BusinessForm.value.categories;

      for (let i = 0; i < this.selectedCategories.length; i++) {

        let Id = this.selectedCategories[i]

        let category = this.categoryList.filter(a => a.catId === Id);

        this.percentageShareList.push(category[0].percentageShare);
      }

      // console.log("a",this.percentageShareList);

      if (this.percentageShareList.length == 2) {

        if (this.percentageShareList.every(v => v === true)) {

          this.IspercentageShare = false;


        }
        else if (this.percentageShareList.every(v => v === false)) {

          this.IspercentageShare = false;

        }
        else {

          this.IspercentageShare = true;


        }
      }
      else {

        this.IspercentageShare = false;

        if (this.percentageShareList[0] == true) {

          // this.Percentage_Share.emit('Singletrue');
        }
        else {
          // this.Percentage_Share.emit('Singlefalse');
        }


      }

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "SelectedCategories",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  Checkcategorieslenght() {
    try {

      if (this.BusinessForm.value.categories.length > 2) {

        this.lengthError = true;
      }
      else {
        this.lengthError = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "Checkcategorieslenght",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  FormSubmit() {
    try {
   
      this.commonService.showLoading();
      for (const key of Object.keys(this.BusinessForm.controls)) {
        if (this.BusinessForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }

      this.BusinessForm.patchValue({ 'userId': this.Partner_User_Id });
      this.BusinessForm.patchValue({ 'createdBy': this.Partner_User_Id });
      this.BusinessForm.patchValue({ 'logoBase64': this.FileBase64 });
      this.BusinessForm.patchValue({ 'logoImageType': this.fileformat });
      this.BusinessForm.patchValue({ 'logoImageName': this.Filename });
      this.BusinessForm.patchValue({ 'panImgBase64': this.FileBase64_Pan });
      this.BusinessForm.patchValue({ 'panImgType': this.fileformat_Pan });

      let businessdetails = {
        // userId:'5cefc68ec299d1993ee5133b',
        userId: this.BusinessForm.value.userId,
        businessId: this.BusinessForm.value.businessId,
        categories: this.BusinessForm.value.categories,
        tagline: this.BusinessForm.value.tagLine,
        CompanyName: this.BusinessForm.value.companyName,
        UserType: this.BusinessForm.value.UserType,
        NameofPartner: this.BusinessForm.value.NameofPartner,
        location: this.BusinessForm.value.Location,
        flatWing: this.BusinessForm.value.Flat_Wing,
        locality: this.BusinessForm.value.Locality,
        BusinessDescription: this.BusinessForm.value.BusinessDescription,
        Updatedby: this.BusinessForm.value.userId
      };
  
      if (this.BusinessForm.valid && this.lengthError == false && this.IspercentageShare == false && this.isNan == false
        && this.isNan1 == false) {


        this.DisplayError = false;

        //business details

        if (businessdetails && this.lengthError == false) {

          this.businessListingService.AddBusinessDetails(businessdetails).subscribe(data => {
         
            if (this.BusinessForm.value.businessId == null || this.BusinessForm.value.businessId == "") {
              this.BusinessForm.patchValue({ 'businessId': data.json().data });
            }

            // this.BusinessId = data.json().data;

            // this.ResponseHelper.GetSuccessResponse(data);    

            this.UpdateOtherDetails();
            this.commonService.hideLoading();

          },
            err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );

        }



      }
      else {
        this.DisplayError = true;
        this.commonService.hideLoading();

        if (this.BusinessForm.controls.categories.hasError('required')) {
          document.querySelector('#CategoryRequired').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (this.BusinessForm.controls.UserType.hasError('required')) {
          document.querySelector('#areyou').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const invalid = [];
        const controls = this.BusinessForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.user.UserId,
          "Url": "",
          "screen": "Fee Management",
          "method": "PaymentDetailsSubmit",
          "message": "UserData :- " + JSON.stringify(this.BusinessForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.user.UserId,
        }
        this.loggerService.Logger(invalidField)
      }

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }
  }


  GetCategoryList() {

    try {

      var obj = new Object();

      obj['searchTerm'] = '';

      this.businessListingService.GetCategoryList(obj)

        .subscribe(data => {

          let obj = data.json().data;

          this.categoryList = obj.categories;

          this.SelectedCategories();

        },
        );
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetCategoryList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  UpdateOtherDetails() {
    try {

      let companydetails = {
        businessId: this.BusinessForm.value.businessId,
        type: 'Description',
        value: this.BusinessForm.value.BusinessDescription,
        Updatedby: this.BusinessForm.value.userId
      };

      let companydetails2 = {
        businessId: this.BusinessForm.value.businessId,
        type: 'Email',
        value: this.BusinessForm.value.BusinessEmail
      };

      let companydetails3 = {
        businessId: this.BusinessForm.value.businessId,
        type: 'URL',
        value: this.BusinessForm.value.WebsiteUrl
      };

      let companydetails4 = {
        businessId: this.BusinessForm.value.businessId,
        type: 'GST',
        value: this.BusinessForm.value.GSTNumber
      };

      //  let companydetails5 = {
      //   businessId:this.BusinessForm.value.businessId,
      //   type:'Name',
      //   value:this.BusinessForm.value.companyName
      //  };
      if (this.BusinessForm.value.logoBase64 == undefined) {

        this.BusinessForm.value.logoBase64 = "";
      }
      if (this.BusinessForm.value.logoImageType == undefined) {
        this.BusinessForm.value.logoImageType = "";
      }
      if (this.BusinessLogoData.logoImageURL) {

        this.companylogodetails = {
          businessId: this.BusinessForm.value.businessId,
          logoBase64: this.BusinessForm.value.logoBase64,
          logoImgType: this.BusinessForm.value.logoImageType,
          logoImgName: this.logoImageName,
          logoImageURL: this.fileURL_Logo

        };
      }
      else {
        this.companylogodetails = {

          businessId: this.BusinessForm.value.businessId,
          logoBase64: this.BusinessForm.value.logoBase64,
          logoImgType: this.BusinessForm.value.logoImageType,
          logoImgName: this.BusinessForm.value.logoImageName,
          logoImageURL: '',


        };
      }


      let companyaddress = {
        businessId: this.BusinessForm.value.businessId,
        location: this.BusinessForm.value.Location,
        flatWing: this.BusinessForm.value.Flat_Wing,
        locality: this.BusinessForm.value.Locality
      };

      if (this.BusinessPanData.imageURL) {

        this.panobj = {
          userId: this.BusinessForm.value.userId,
          panNumber: this.BusinessForm.value.panNumber,
          panImgBase64: this.FileBase64_Pan,
          panType: 'Business',
          ImageURL: this.fileURL_Pan,
          FileName: this.Filename_Pan,


        };
      }
      else {
      
        this.panobj = {
          userId: this.BusinessForm.value.userId,
          panNumber: this.BusinessForm.value.panNumber,
          panImgBase64: this.BusinessForm.value.panImgBase64,
          panType: 'Business',
          ImageURL: '',
          FileName: this.Filename_Pan,


        };
      }




      // if (companydetails) {

      //   this.businessListingService.AddcompanyDetails(companydetails).subscribe(data => {
      //     // this.ResponseHelper.GetSuccessResponse(data);
      //   },
      //     err => {
      //       //  this.ResponseHelper.GetFaliureResponse(err);
      //     }
      //   );
      // }

      if (companydetails2) {
        this.businessListingService.AddcompanyDetails(companydetails2).subscribe(data => {

          // this.ResponseHelper.GetSuccessResponse(data);
        },
          err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }

      if (companydetails3) {
        this.businessListingService.AddcompanyDetails(companydetails3).subscribe(data => {

          // this.ResponseHelper.GetSuccessResponse(data);
        },
          err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }

      if (companydetails4) {
     
        this.businessListingService.AddcompanyDetails(companydetails4).subscribe(data => {
          // this.ResponseHelper.GetSuccessResponse(data);

        },
          err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }
     
      //company logo
      if (this.companylogodetails) {

        this.businessListingService.AddcompanyLogoDetails(this.companylogodetails).subscribe(data => {
          // this.ResponseHelper.GetSuccessResponse(data);
        
        },
          err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }

      //pan
      if (this.panobj) {
        
        this.businessListingService.AddcompanypanDetails(this.panobj).subscribe(data => {
       
          this.File_Pan = null;
          this.FileBase64_Pan = null;
          this.Filename_Pan = "No File chosen"

          let b = [{ message: "Business Details Saved Successfully", type: "SUCCESS" }]
          this.notificationservice.ChangeNotification(b);

          this.BusinessForm.reset();

          this.File = null;
          this.FileBase64 = null;
          this.Filename = "No File chosen"

          if (this.PartnerId) {

            this.GetBusinessDetail();
          }


          if (this.PartnerId) {

            this.next_page.emit('business');

            this.UserData.Is_Business_Completed = true;
          }
          else {
            // this.router.navigate(['/Business-list'])
            this.next_page.emit('business');
            this.UserData.Is_Business_Completed = true;
          }


          this.commonService.changeData("");

        },
          err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }
      //address
      //if (companyaddress) {

      //  this.businessListingService.AddcompanyAddressDetails(companyaddress).subscribe(data => {

      //    // if(this.BusinessForm.value.businessId){
      //    //   let a = [{ message: "Business Details Updated Successfully", type: "SUCCESS" }]
      //    //   this.notificationservice.ChangeNotification(a);
      //    // }
      //    // else{

      //    // }




      //  },
      //    err => {
      //      // this.ResponseHelper.GetFaliureResponse(err);
      //    }
      //  );
      //}
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "UpdateOtherDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetBusinessDetail() {
    try {
     
      this.businessListingService.GetBusinessDetails(this.PartnerId).subscribe((data) => {

        let response = data.json();

        this.editbusiness = response.data;
      });

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetBusinessDetail",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  getvalue(value) {
    try {
      this.selectedvalue = value;

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "getvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  Skippage() {
    try {

      this.next_page.emit('business');

      this.UserData.Is_Business_Completed = true;

      this.commonService.changeData("");
      this.localStorage.removeItem('Businessdata');
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "Skippage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }
  }

  YouAreSelect(event) {
    try {
     
      this.BusinessForm.patchValue({ 'NameofPartner': '' });
      this.BusinessForm.patchValue({ 'companyName': '' });

      if (event.target.value == '1') {
        //  this.BusinessForm.get('companyName').setErrors(null);
        this.BusinessForm.get('NameofPartner').setErrors(null);

        this.registrationservice.GetUserDetails(this.Partner_User_Id).subscribe((data) => {

          let response = data.json();
          // console.log(response);
          // console.log(response.data.userInfo)
          // console.log(response.userInfo);
          this.BusinessForm.patchValue({ 'companyName': response.data.userInfo.firstName + " " + response.data.userInfo.lastName });

        });

        this.IsPartnershipFirm = false;
        this.IsLLP = false;
      }
      else if (event.target.value == '2') {
        this.BusinessForm.patchValue({ 'companyName': '' });
        this.BusinessForm.get('NameofPartner').setValidators([Validators.required]);
        this.BusinessForm.get('companyName').setValidators([Validators.required]);
        this.IsPartnershipFirm = true;
        this.IsLLP = false;
      }
      else if (event.target.value == '3') {
        this.BusinessForm.patchValue({ 'companyName': '' });
        this.BusinessForm.get('NameofPartner').setValidators([Validators.required]);
        this.BusinessForm.get('companyName').setValidators([Validators.required]);
        this.IsLLP = true;
        this.IsPartnershipFirm = false;
      }
      else if (event.target.value == '4') {
        this.BusinessForm.get('NameofPartner').setErrors(null);
        this.BusinessForm.get('companyName').setValidators([Validators.required])
        this.IsPartnershipFirm = false;
        this.IsLLP = false;
      }
      else {
        this.BusinessForm.get('NameofPartner').setErrors(null);
        this.BusinessForm.get('companyName').setErrors(null);
        this.IsPartnershipFirm = false;
        this.IsLLP = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "YouAreSelect",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetUploadFileData(event) {

    try {
      this.BusinessForm.get('logoBase64').markAsDirty();

      if (event.target.files && event.target.files.length > 0) {

        this.File = event.target.files[0];
        this.Filename = this.File.name;
        this.fileformat = this.Filename.substr(this.Filename.lastIndexOf('.') + 1);

        this.ConvertToBase64();

        if (this.fileformat == "png" || this.fileformat == "jpg" || this.fileformat == "jpeg"
          || this.fileformat == "PNG" || this.fileformat == "JPG" || this.fileformat == "JPEG") {
          this.typeerror = false;
        }

        else {
          this.typeerror = true;
        }
      }
      else {
        this.File = null;
        this.FileBase64 = null;
        this.Filename = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetUploadFileData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ConvertToBase64() {
    try {

      let reader = new FileReader();
      reader.readAsDataURL(this.File);
      reader.onload = () => {

        this.FileURL_Logo = reader.result;
        //  this.Pan64=reader.result;
        this.FileBase64 = reader.result.toString().split(',')[1];

      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "ConvertToBase64",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetUploadFileData_Pan(event) {
    try {

      this.BusinessForm.get('panImgBase64').markAsDirty();

      if (event.target.files && event.target.files.length > 0) {

        this.File_Pan = event.target.files[0];
        this.Filename_Pan = this.File_Pan.name;
        this.fileformat_Pan = this.Filename_Pan.substr(this.Filename_Pan.lastIndexOf('.') + 1);

        this.ConvertToBase64_Pan();

        if (this.fileformat_Pan == "png" || this.fileformat_Pan == "jpg" || this.fileformat_Pan == "jpeg") {
          this.typeerror_pan = false;
        }

        else {
          this.typeerror_pan = true;
        }
      }
      else {
        this.File_Pan = null;
        this.Filename_Pan = null;
        this.fileformat_Pan = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetUploadFileData_Pan",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ConvertToBase64_Pan() {
    try {

      let reader = new FileReader();
      reader.readAsDataURL(this.File_Pan);
      reader.onload = () => {
        this.FileURL_Pan = reader.result;
        //  this.Pan64=reader.result;
        this.FileBase64_Pan = reader.result.toString().split(',')[1];
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "ConvertToBase64_Pan",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Backpage() {
    try {

      this.previous_page.emit('business');

      this.UserData.Is_Kyc_completed = false;
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "Backpage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }
  }

  GetApprovedtvalue(event) {
    try {
    
      this.approvedvalue = event.target.value;

      if (this.approvedvalue == '2') {

        this.IsReasonActive = true;

        this.BusiessApprovedForm.get('rejectedReason').setValidators([Validators.required]);
      }
      else {

        this.IsReasonActive = false;

        this.BusiessApprovedForm.get('rejectedReason').clearValidators();

      }

    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "GetApprovedtvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Getprevioddata() {
    this.GetUpdatedData();
  }


  ClearbusinessApprovedForm() {
    try {
      this.BusiessApprovedForm.reset();
      this.IsReasonActive = false;
      this.BusiessApprovedForm.patchValue({ isApproved: '' });
      this.DisplayError1 = false;
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "ClearbusinessApprovedForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  createAppproveForm() {
    try {
      this.BusiessApprovedForm = this.fb.group({
        'businessId': [''],
        'isApproved': ['', Validators.required],
        'rejectedReason': [''],
        'updatedBy': [''],

      });
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "createAppproveForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



  BusinessApprovedFormSubmit() {
    try {

      this.DisplayError1 = true;
      this.commonService.showLoading();

      if (this.BusiessApprovedForm.valid) {

        // this.SelectedCategories();

        this.BusiessApprovedForm.patchValue({ businessId: this.BusinessForm.value.businessId });
        this.BusiessApprovedForm.patchValue({ updatedBy: this.Partner_User_Id });

        this.DisplayError1 = false;

        this.businessListingService.Business_Approve_Disapprove(this.BusiessApprovedForm.value).subscribe(
          data => {

            // this.ResponseHelper.GetSuccessResponse(data);
            this.closemodal.nativeElement.click();
            this.ClearbusinessApprovedForm();
            this.GetUpdatedData();

            this.commonService.hideLoading();
            window.scroll(0, 0);
            if (this.approvedvalue == '1') {
              let msg = [{ message: "Partner Business Approved successfully", type: "SUCCESS" }]
              this.notificationservice.ChangeNotification(msg)
              this.IsApprovedBusiness = true;
            }
            else {
              let msg = [{ message: "Partner Business Rejected", type: "SUCCESS" }]
              this.notificationservice.ChangeNotification(msg)
            }



          }, err => {

            setTimeout(() => {
              if (this.IsFeePending == true) {
                window.scroll(0, 0);
                let msg = [{ message: "Subscription Fee is Pending", type: "ERROR" }]
                this.notificationservice.ChangeNotification(msg);
              }
            }, 3000);

            this.closemodal.nativeElement.click();
            this.GetUpdatedData();
            this.commonService.hideLoading();

            // this.ClearbusinessApprovedForm();
          }
        );
      }
      else {
        this.DisplayError = true;
        this.commonService.hideLoading();
      }
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "BusinessApprovedFormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  OpenSubscriptionfee() {
    try {
      this.router.navigate(['/fee-management']);
      this.localStorage.setItem('SubscriptionFrom', 'BusinessDetails').subscribe(() => { });
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "OpenSubscriptionfee",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)


    }
  }


  createForm() {
    try {
      this.BusinessForm = this.fb.group({
        'businessId': [''],
        'userId': [],
        'categories': [[], Validators.required],
        'tagLine': [''],
        'BusinessEmail': [''],
        'companyName': ['', Validators.required],
        'UserType': ['', Validators.required],
        'NameofPartner': [''],
        'logoBase64': [''],
        'logoImageType': [''],
        'logoImageName': [''],
        'Location': ['', Validators.required],
        'Flat_Wing': ['', Validators.required],
        'Locality': ['', Validators.required],
        'BusinessDescription': ['', Validators.required],
        'WebsiteUrl': ['', Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$')],
        'createdBy': [''],
        'panNumber': ['', Validators.pattern('^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$')],
        'panImgBase64': [''],
        'panImgType': [''],
        'GSTNumber': ['', Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')],
      }
        ,
        {
          validator: Validators.compose([customValidation.isBusinessEmailValid])
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.user.UserId,
        "Url": "",
        "screen": "Business List",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.user.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



}

