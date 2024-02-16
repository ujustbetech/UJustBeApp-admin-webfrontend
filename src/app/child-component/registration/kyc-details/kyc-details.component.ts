import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { Lightbox } from 'ngx-lightbox';
import { AppConfigService } from './../../../service/app-config.service';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.css']
})
export class KycDetailsComponent implements OnInit {
  ResponseHelper: ResponseHelper;
  KycForm: FormGroup;
  DisplayError: boolean = false;
  DisplayError1: boolean = false;
  Filename_front = "No File Chosen";
  Filename_pan = "No File Chosen";
  Filename_back = "No File Chosen";
  Filename_cheque = "No File Chosen";
  File_front;
  File_pan;
  File_back;
  File_cheque;
  FileBase64_Pan: any = '';
  FileBase64_Adhar_front: any = '';
  FileBase64_Adhar_back: any = '';
  FileBase64_cheque: any = '';
  fileformat_pan;
  fileformat_front;
  fileformat_back;
  fileformat_cheque;
  @Input() UserData;
  @Input() UserDetails;
  @Input() UserKycData;
  @Input() PartnerId;
  @Output() next_page = new EventEmitter<any>();
  @Output() previous_page = new EventEmitter<any>();
  @Output() iskycCompleted = new EventEmitter<any>();
  @Output() Addedit = new EventEmitter<any>();
  @Output() isPartnerActive = new EventEmitter<any>();
  @Output() IsDirtyform = new EventEmitter<any>();

  Panerror: boolean = false;
  Adharfronterror: boolean = false;
  Adharbackerror: boolean = false;
  chequeerror: boolean = false;
  Registered_User_Id: string;
  Partner_User_Id: string;
  @Input() AddEdit: string;
  editpartner: any;
  Images_Album: any[];
  ImagesAlbum: any[];
  PanUrl: any = '';
  FileURL_Adhar_front: any = '';
  FileURL_Adhar_back: any = '';
  FileURL_cheque: any = '';
  FileURL_Pan: any = '';
  isNan: boolean = false;
  UniqueName_Pan: any;
  UniqueName_front: any;
  UniqueName_back: any;
  UniqueName_cheque: any;
  panobj: any;
  adharobj: any;
  fileURL_Pan: any;
  fileURL_adhar_front: any;
  fileURL_adhar_back: any;
  fileURL_cheque: any;
  UserBankDetails: any = '';
  UserAdharDetails: any = '';
  UserPanDetails: any = '';
  IsApprovedFlag: boolean;
  @ViewChild('closekycmodal') closekycmodal: ElementRef;
  ApprovedForm: FormGroup;
  flag: boolean;
  IsReasonActive: boolean = false;
  reasonId: any;
  KYCCompleted: boolean;
  KYCApproved: boolean;
  KYCRejected: boolean = false;
  adharlength: any;
  ApiUrl: string = "";


  constructor(private loggerService: LoggerService,protected AppConfigService: AppConfigService, private lightbox: Lightbox, private commonService: CommonService, private router: Router, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private registrationservice: RegistrationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.ApiUrl = AppConfigService.config.ApiUrl;

    this.localStorage.getItem('Partner_User_Id').subscribe((Partner_User_Id) => {

      this.Partner_User_Id = Partner_User_Id;

    });

    var pageView = {
      "UserId": this.Partner_User_Id,
      "Url": "",
      "screen": "KYC Details",
      "method": "constuctor",
      "message": "KYC Details Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":  this.Partner_User_Id,
    }
    this.loggerService.Logger(pageView)
    
  }


  ngOnInit() {

    try {
      this.createForm();
      this.createAppproveForm();


      this.ApprovedForm.patchValue({ Flag: '' });
      this.ApprovedForm.patchValue({ reasonId: '' });

      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {


        this.Partner_User_Id = Id;
        this.KycForm.patchValue({ userId: this.Partner_User_Id })

        if (this.AddEdit != 'Add') {
          if (this.Partner_User_Id) {
            this.GetUpdatedData();
          }

        }



      });
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)


    }

  }


  ngDoCheck() {
    try {
      if (this.KycForm.dirty) {

        this.IsDirtyform.emit(true)
      }
      else {

        this.IsDirtyform.emit(false)
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ngDoCheck",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  GetUpdatedData() {
    
    try {
      this.registrationservice.GetUserDetails(this.Partner_User_Id).subscribe((data) => {

        let response = data.json();

        this.KYCCompleted = response.data.isKYCComplete;

        // console.log("KYCCompleted :", this.KYCCompleted);

        // console.log("KYCCompleted :", this.Partner_User_Id);

        this.UserKycData = response.data.userKycInfo;

        if (this.UserKycData) {
          this.UserBankDetails = this.UserKycData.bankDetails;
          this.UserAdharDetails = this.UserKycData.adharCard;
          this.UserPanDetails = this.UserKycData.panCard;

          this.KYCApproved = this.UserKycData.isApproved.flag;
          if (this.UserKycData.isApproved.reasonId != 0) {
            this.KYCRejected = true;
          }
          else {
            this.KYCRejected = false;
          }

        //  console.log("KYCApproved :", this.UserKycData.isApproved);
        }

        // if(this.UserKycData.isApproved.flag){
        //   this.iskycCompleted.emit(true);
        //   this.Addedit.emit('Edit');
        //   this.isPartnerActive.emit(true);        
        // }

        this.addKycdata();

        this.ResponseHelper.GetSuccessResponse(data)

      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetUpdatedData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }




  addKycdata() {
    
    try {

      this.KycForm.patchValue({ userId: this.Partner_User_Id })
      this.KycForm.patchValue({ panNumber: this.UserKycData.panCard.panNumber })


      if (this.UserKycData.adharCard.adharNumber != null || this.UserKycData.adharCard.adharNumber != '') {
        if (this.UserKycData.adharCard.adharNumber.includes(' ')) {
          this.KycForm.patchValue({ aadharNumber: this.UserKycData.adharCard.adharNumber })
        } else {
          this.AdharNumberSpace(this.UserKycData.adharCard.adharNumber)
          // this.KycForm.patchValue({ aadharNumber: this.UserKycData.adharCard.adharNumber })
        }

      }




      this.KycForm.controls['BankDetails'].patchValue({
        accountHolderName: this.UserKycData.bankDetails.accountHolderName,
        accountNumber: this.UserKycData.bankDetails.accountNumber,
        bankName: this.UserKycData.bankDetails.bankName,
        IFSCCode: this.UserKycData.bankDetails.ifscCode,
        FileName: this.UserKycData.bankDetails.fileName,
        // ImageURL: this.UserKycData.bankDetails.imageURL,      
        UniqueName: this.UserKycData.bankDetails.uniqueName,
      });
      this.FileURL_cheque = this.ApiUrl + '/' + this.UserKycData.bankDetails.imageURL;
      this.fileURL_cheque = this.UserKycData.bankDetails.imageURL;
      
      this.fileURL_Pan = this.UserKycData.panCard.imageURL;
      this.FileURL_Pan = this.ApiUrl + '/' + this.UserKycData.panCard.imageURL;
      this.Filename_pan = this.UserKycData.panCard.fileName;
      this.UniqueName_Pan = this.UserKycData.panCard.uniqueName;

      // console.log(this.UserKycData.adharCard);

      this.Filename_front = this.UserKycData.adharCard.frontFileName;
      this.UniqueName_front = this.UserKycData.adharCard.frontUniqueName;
      this.Filename_back = this.UserKycData.adharCard.backFileName;
      this.UniqueName_back = this.UserKycData.adharCard.backUniqueName;
      this.FileURL_Adhar_front = this.ApiUrl + '/' + this.UserKycData.adharCard.frontImageURL;
      this.FileURL_Adhar_back = this.ApiUrl + '/' + this.UserKycData.adharCard.backImageURL;
      this.fileURL_adhar_front = this.UserKycData.adharCard.frontImageURL;
      this.fileURL_adhar_back = this.UserKycData.adharCard.backImageURL;
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "addKycdata",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  open(ImageName) {
    try {
      
      if (ImageName == 'Pan' && this.fileURL_Pan) {
        this.Images_Album = [{ src: this.FileURL_Pan, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }
      else if (ImageName == 'Adhar_front' && this.fileURL_adhar_front) {
        this.Images_Album = [{ src: this.FileURL_Adhar_front, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }
      if (ImageName == 'Adhar_back' && this.fileURL_adhar_back) {
        this.Images_Album = [{ src: this.FileURL_Adhar_back, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }
      if (ImageName == 'Cheque' && this.fileURL_cheque) {
        this.Images_Album = [{ src: this.FileURL_cheque, caption: "", thumb: "" }],
          this.lightbox.open(this.Images_Album, 0);
      }


    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "open",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  close() {

    this.lightbox.close();
  }

  FormSubmit() {
    //this.BecomeApproved();
    
    try {


      this.KycForm.controls.BankDetails.patchValue({ cancelChequebase64Img: this.FileBase64_cheque });
      this.KycForm.controls.BankDetails.patchValue({ FileName: this.Filename_cheque });
      this.KycForm.controls.BankDetails.patchValue({ ImageURL: "" });
      this.KycForm.controls.BankDetails.patchValue({ UniqueName: "" });

      this.KycForm.patchValue({ panImgBase64: this.FileBase64_Pan });

      this.KycForm.patchValue({ aadharFrontBase64: this.FileBase64_Adhar_front });

      this.KycForm.patchValue({ aadharBackBase64: this.FileBase64_Adhar_back });

      // let pannumber = this.KycForm.value.panNumber;panImgBase64

      if (this.UserPanDetails.imageURL) {
        this.panobj = {
          userId: this.KycForm.value.userId,
          panNumber: this.KycForm.value.panNumber,
          panImgBase64: this.FileBase64_Pan,
          ImageURL: this.fileURL_Pan,
          panType: 'Individual',
          FileName: this.Filename_pan,
          // UniqueName:this.UniqueName_Pan
        };
      }
      else {
        this.panobj = {
          userId: this.KycForm.value.userId,
          panNumber: this.KycForm.value.panNumber,
          panImgBase64: this.KycForm.value.panImgBase64,
          ImageURL: '',
          panType: 'Individual',
          FileName: this.Filename_pan,
          // UniqueName:''
        };
      }

      if (this.UserAdharDetails.frontImageURL && this.UserAdharDetails.backImageURL) {
        this.adharobj = {
          userId: this.KycForm.value.userId,
          aadharNumber: this.KycForm.value.aadharNumber,
          aadharFrontBase64: this.FileBase64_Adhar_front,
          FrontFileName: this.Filename_front,
          FrontUniqueName: this.UniqueName_front,
          FrontImageURL: this.fileURL_adhar_front,
          aadharBackBase64: this.FileBase64_Adhar_back,
          BackFileName: this.Filename_back,
          BackUniqueName: this.UniqueName_back,
          BackImageURL: this.fileURL_adhar_back

        };

      }
      else if (this.UserAdharDetails.frontImageURL) {
        this.adharobj = {
          userId: this.KycForm.value.userId,
          aadharNumber: this.KycForm.value.aadharNumber,
          aadharFrontBase64: this.FileBase64_Adhar_front,
          FrontFileName: this.Filename_front,
          FrontUniqueName: this.UniqueName_front,
          FrontImageURL: this.fileURL_adhar_front,
          aadharBackBase64: this.KycForm.value.aadharBackBase64,
          BackFileName: this.Filename_back,
          BackUniqueName: '',
          BackImageURL: ''

        };

      }
      else if (this.UserAdharDetails.backImageURL) {
        this.adharobj = {
          userId: this.KycForm.value.userId,
          aadharNumber: this.KycForm.value.aadharNumber,
          aadharFrontBase64: this.KycForm.value.aadharFrontBase64,
          FrontFileName: this.Filename_front,
          FrontUniqueName: '',
          FrontImageURL: '',
          aadharBackBase64: this.FileBase64_Adhar_back,
          BackFileName: this.Filename_back,
          BackUniqueName: this.UniqueName_back,
          BackImageURL: this.fileURL_adhar_back

        };

      }
      else {
        this.adharobj = {
          userId: this.KycForm.value.userId,
          aadharNumber: this.KycForm.value.aadharNumber,
          aadharFrontBase64: this.KycForm.value.aadharFrontBase64,
          FrontFileName: this.Filename_front,
          FrontUniqueName: '',
          FrontImageURL: '',
          aadharBackBase64: this.KycForm.value.aadharBackBase64,
          BackFileName: this.Filename_back,
          BackUniqueName: '',
          BackImageURL: ''
        };
      }


      if (this.UserBankDetails.imageURL) {

        this.KycForm.controls['BankDetails'].patchValue({
          ImageURL: this.fileURL_cheque,
          UniqueName: this.UserKycData.bankDetails.uniqueName,
          cancelChequebase64Img: this.FileBase64_cheque

        });
      }
      else {
        this.KycForm.controls['BankDetails'].patchValue({
          ImageURL: '',
          UniqueName: '',
          cancelChequebase64Img: this.KycForm.value.BankDetails.cancelChequebase64Img
        });
      }
      





      this.KycForm.get('aadharNumber').setErrors(null);


      if (this.KycForm.valid) {

        if (this.Panerror == false) {
          
          this.registrationservice.SavePanDeatils(this.panobj).subscribe(data => {

            // this.ResponseHelper.GetSuccessResponse(data); 

            // this.AddAdhardetails();


            this.commonService.hideLoading();
          },
            err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );

        }

        if (this.Adharfronterror == false && this.Adharbackerror == false) {

          this.registrationservice.SaveAdharDeatils(this.adharobj).subscribe(data => {

            // this.ResponseHelper.GetSuccessResponse(data);        

            // this.AddBankDetails();
          },
            err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );
        }


        let bankobj = {
          userId: this.KycForm.value.userId,

          BankDetails: this.KycForm.value.BankDetails

        };


        if (this.chequeerror == false) {

          this.registrationservice.SavebankDeatils(bankobj).subscribe(

            data => {
              this.commonService.showLoading();

              if (this.IsApprovedFlag) {
                let msg = [{ message: "KYC Saved & Auto Approved Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(msg);
              }
              else {
                let msg = [{ message: "KYC Saved Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(msg);
              }


              if (this.IsApprovedFlag) {
                this.AppprovedKYC(this.IsApprovedFlag);

              }
              else {
                this.GetUpdatedData();
              }

              if (this.UserKycData) {

                this.GetupdatedData();
                // this.GetUpdatedData();

              }



              // this.GetUpdatedData(); 

              if (this.Partner_User_Id || this.UserKycData) {


                //  if(this.IsApprovedFlag) {
                //   this.iskycCompleted.emit(true);
                //   this.Addedit.emit('Edit');
                //   this.isPartnerActive.emit(true);
                //  }


                this.next_page.emit('kyc');

                this.UserData.Is_Kyc_completed = true;

              } else {

                this.router.navigate(['/partner-list']);

              }
              window.scroll(0, 0);
              this.commonService.hideLoading();

            }, err => {
              this.ResponseHelper.GetFaliureResponse(err);
              window.scroll(0, 0);
            }
          );
        }
      } else {


        if(this.KycForm.controls.panNumber.hasError('pattern')){
          document.querySelector('#scrollTarget').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }    
  
        const invalid = [];
        const controls = this.KycForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.Partner_User_Id,
          "Url": "",
          "screen": "Basic Info",
          "method": "fromSubmit",
          "message": "UserData :- " + JSON.stringify(this.KycForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.Partner_User_Id,
        }
        this.loggerService.Logger(invalidField)




      }

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }



  BecomeApproved() {
    
    try {

      if (this.UserKycData) {


        this.KycForm.patchValue({ panImgBase64: this.UserPanDetails.imageURL });

        if (this.UserAdharDetails.frontImageURL == "") {
          this.KycForm.patchValue({ aadharFrontBase64: this.FileBase64_Adhar_front });

        }
        else {
          this.KycForm.patchValue({ aadharFrontBase64: this.UserAdharDetails.frontImageURL });
        }

        if (this.UserAdharDetails.backImageURL == "") {
          this.KycForm.patchValue({ aadharBackBase64: this.FileBase64_Adhar_back });
        }
        else {
          this.KycForm.patchValue({ aadharBackBase64: this.UserAdharDetails.backImageURL });
        }

      }
      else {
        this.KycForm.patchValue({ aadharFrontBase64: this.FileBase64_Adhar_front });
        this.KycForm.patchValue({ aadharBackBase64: this.FileBase64_Adhar_front });
        this.KycForm.patchValue({ panImgBase64: this.FileBase64_Pan });
        this.KycForm.controls.BankDetails.patchValue({ FileName: this.Filename_cheque });
      }
      



      const valid = [];
      const controls = this.KycForm.controls;
      for (const name in controls) {
        if (name == 'BankDetails') {
          // if ((controls[name].value.accountHolderName != '' && controls[name].value.accountHolderName != null)
          //   && (controls[name].value.bankName != '' && controls[name].value.bankName != null)
          //   && (controls[name].value.accountNumber != '' && controls[name].value.accountNumber != null)
          //   && (controls[name].value.IFSCCode != '' && controls[name].value.IFSCCode != null)
          //   && (controls[name].value.FileName != '' && controls[name].value.FileName != null)
          // ) {

            valid.push(name);
          //}
        }
        else {
          if (controls[name].value != '' && controls[name].value != null) {

            valid.push(name);
          }
        }

        
            // if (controls[name].value != '' && controls[name].value != null) {
  
            //   valid.push(name);
            // }
          

      }
      // valid.pop()
      
      // alert(valid.length);
      if (this.UserKycData) {
        if (this.UserKycData.isApproved.flag) {
          this.FormSubmit();
        }
        else {
          if (valid.length == 7) {
            document.getElementById("openModalButton").click();
          }
          else {
            this.FormSubmit();
            // this.AppprovedKYC(false);

          }
        }
      }
      else {
        if (valid.length == 7) {
          document.getElementById("openModalButton").click();
        }
        else {
          this.FormSubmit();
          // this.AppprovedKYC(false);

        }
      }

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "BecomeApproved",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)


    }

  }

  GetupdatedData() {
    
    try {
      this.registrationservice.GetUserDetails(this.KycForm.value.userId).subscribe((data) => {

        let response = data.json();

        this.editpartner = response.data;

        this.commonService.changeData(this.editpartner)

        this.ResponseHelper.GetSuccessResponse(data)


      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetupdatedData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  createForm() {
    try {
      this.KycForm = this.fb.group({
        'userId': [''],
        'panNumber': ['', Validators.pattern('^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$')],
        'panImgBase64': [''],
        'aadharNumber': ['', Validators.compose([Validators.minLength(14), Validators.maxLength(14), Validators.pattern('^[0-9]*$')])],
        'aadharFrontBase64': [''],
        'aadharBackBase64': [''],
        'BankDetails': this.fb.group({
          'bankName': [''],
          'accountHolderName': [''],
          'accountNumber': ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(17), Validators.minLength(6)])],
          'IFSCCode': ['', Validators.pattern('^[a-zA-Z]{4}[0][a-zA-Z0-9]{6}$')],
          'cancelChequebase64Img': [''],
          'FileName': [''],
          'ImageURL': [''],
          'UniqueName': [''],
        }),

      });

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  GetUploadFileData_Pan(event) {
    
    try {

      this.KycForm.get('panImgBase64').markAsDirty();

      let fileformat_pan1;

      if (event.target.files && event.target.files.length > 0) {

        this.File_pan = event.target.files[0];
        this.Filename_pan = this.File_pan.name;
        this.fileformat_pan = this.Filename_pan.substr(this.Filename_pan.lastIndexOf('.') + 1)

        this.ConvertToBase64_Pan()

        if (this.fileformat_pan == "png" || this.fileformat_pan == "jpg" || this.fileformat_pan == "jpeg"
          || this.fileformat_pan == "PNG" || this.fileformat_pan == "JPG" || this.fileformat_pan == "JPEG") {
          this.Panerror = false;
        }

        else {
          this.Panerror = true;
        }
      }
      else {
        this.File_pan = null;
        this.FileBase64_Pan = null;
        this.Filename_pan = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetUploadFileData_Pan",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  ConvertToBase64_Pan() {
    
    try {

      let reader = new FileReader();
      reader.readAsDataURL(this.File_pan);
      reader.onload = () => {

        this.FileURL_Pan = reader.result;
        this.FileBase64_Pan = reader.result.toString().split(',')[1];

        // if(this.UserKycData.userId ){    
        //   this.panobj = {
        //     userId: this.KycForm.value.userId,
        //     panNumber: this.KycForm.value.panNumber,
        //     panImgBase64: this.FileBase64_Pan,
        //     imageURL:this.fileURL_Pan,
        //     panType: 'Individual',
        //     FileName:this.Filename_pan,
        //     UniqueName:this.UniqueName_Pan
        //   };
        // }
        // else{
        //   this.panobj = {
        //     userId: this.KycForm.value.userId,
        //     panNumber: this.KycForm.value.panNumber,
        //     panImgBase64:'',
        //     imageURL: '',
        //     panType: 'Individual',
        //     FileName:this.Filename_pan,
        //     UniqueName:''
        //   };
        // }

      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ConvertToBase64_Pan",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  GetUploadFileData_Adhar_front(event) {

    try {
      this.KycForm.get('aadharFrontBase64').markAsDirty();

      if (event.target.files && event.target.files.length > 0) {

        this.File_front = event.target.files[0];
        this.Filename_front = this.File_front.name;
        this.fileformat_front = this.Filename_front.substr(this.Filename_front.lastIndexOf('.') + 1)

        this.ConvertToBase64_Adhar_front()

        if (this.fileformat_front == "png" || this.fileformat_front == "jpg" || this.fileformat_front == "jpeg"
          || this.fileformat_front == "PNG" || this.fileformat_front == "JPG" || this.fileformat_front == "JPEG") {
          this.Adharfronterror = false;
        }

        else {
          this.Adharfronterror = true;
        }
      }
      else {
        this.File_front = null;
        this.FileBase64_Adhar_front = null;
        this.Filename_front = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetUploadFileData_Adhar_front",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  ConvertToBase64_Adhar_front() {

    try {
      let reader = new FileReader();
      reader.readAsDataURL(this.File_front);
      reader.onload = () => {
        this.FileURL_Adhar_front = reader.result;
        this.FileBase64_Adhar_front = reader.result.toString().split(',')[1];



      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ConvertToBase64_Adhar_front",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  GetUploadFileData_Adhar_back(event) {
    try {

      this.KycForm.get('aadharBackBase64').markAsDirty();

      if (event.target.files && event.target.files.length > 0) {

        this.File_back = event.target.files[0];
        this.Filename_back = this.File_back.name;
        this.fileformat_back = this.Filename_back.substr(this.Filename_back.lastIndexOf('.') + 1)

        this.ConvertToBase64_Adhar_back();

        if (this.fileformat_back == "png" || this.fileformat_back == "jpg" || this.fileformat_back == "jpeg"
          || this.fileformat_back == "PNG" || this.fileformat_back == "JPG" || this.fileformat_back == "JPEG"
        ) {
          this.Adharbackerror = false;
        }

        else {
          this.Adharbackerror = true;
        }
      }
      else {
        this.File_back = null;
        this.FileBase64_Adhar_back = null;
        this.Filename_back = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetUploadFileData_Adhar_back",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  ConvertToBase64_Adhar_back() {

    try {
      let reader = new FileReader();
      reader.readAsDataURL(this.File_back);
      reader.onload = () => {
        this.FileURL_Adhar_back = reader.result;
        this.FileBase64_Adhar_back = reader.result.toString().split(',')[1];
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ConvertToBase64_Adhar_back",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  GetUploadFileData_cheque(event) {
    try {

      this.KycForm.get('BankDetails').get('cancelChequebase64Img').markAsDirty();

      if (event.target.files && event.target.files.length > 0) {

        this.File_cheque = event.target.files[0];
        this.Filename_cheque = this.File_cheque.name;
        this.fileformat_cheque = this.Filename_cheque.substr(this.Filename_cheque.lastIndexOf('.') + 1)

        this.ConvertToBase64_Adhar_cheque();

        if (this.fileformat_cheque == "png" || this.fileformat_cheque == "jpg" || this.fileformat_cheque == "jpeg"
          || this.fileformat_cheque == "PNG" || this.fileformat_cheque == "JPG" || this.fileformat_cheque == "JPEG") {
          this.chequeerror = false;
        }

        else {
          this.chequeerror = true;
        }
      }
      else {
        this.File_cheque = null;
        this.FileBase64_cheque = null;
        this.Filename_cheque = "No File chosen"
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "GetUploadFileData_cheque",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  ConvertToBase64_Adhar_cheque() {

    try {
      let reader = new FileReader();
      reader.readAsDataURL(this.File_cheque);
      reader.onload = () => {
        this.FileURL_cheque = reader.result;
        this.FileBase64_cheque = reader.result.toString().split(',')[1];
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ConvertToBase64_Adhar_cheque",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)
    }
  }

  Skippage() {
    
    try {
      if (this.PartnerId || this.UserKycData) {

        this.next_page.emit('kyc');

        this.UserData.Is_Kyc_completed = true;
      }
      else {

        this.router.navigate(['/partner-list']);
      }

      this.commonService.changeData("")
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "Skippage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)
    }
  }

  Backpage() {

    try {
      this.previous_page.emit('kyc');
      this.UserData.Is_Questionnarie_completed = false;

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "Backpage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }
  AdharNumberSpace(val) {
    
    try {

      this.validateIsNan(val)


      if (!this.isNan) {
        /**code to give a space after 4 digits */

        let char = val.split(' ').join('');
        this.adharlength = val.length;
        if (val.length >= 4) {
          char = val.split(' ').join('');
          if (char.length > 0) {
            let abc = char.match(new RegExp('.{1,4}', 'g'));
            char = char.match(new RegExp('.{1,4}', 'g')).join(' ');
          }
        }

        this.KycForm.patchValue({ aadharNumber: char });
      }
      else {
        return false;
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "AdharNumberSpace",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)


    }
  }
  onKey(event) {
    this.validateIsNan(event.srcElement.value)
  }

  validateIsNan(value) {
    
    try {
      let temp = value.split(' ').join('')

      if (isNaN(Number(temp))) {
        this.isNan = true
      } else {
        if (temp.indexOf(".") > -1) {
          this.isNan = true
        } else {
          this.isNan = false
        }
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "validateIsNan",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)


    }
  }



  AppprovedKYC(Flag: boolean) {
    try {
      
      if (Flag) {

        var approvobj = {
          UserId: this.KycForm.value.userId,
          Flag: true,
          reason: '',
          reasonId: 0,
          Updated_by: this.KycForm.value.userId
        }
      }
      else {
        var approvobj = {
          UserId: this.KycForm.value.userId,
          Flag: false,
          reason: '',
          reasonId: 0,
          Updated_by: this.KycForm.value.userId
        };
      }
      // }

      this.registrationservice.Approve_Disapprove(approvobj).subscribe(
        data => {

          this.GetUpdatedData();

        }, err => {
          // this.ResponseHelper.GetFaliureResponse(err);
        }
      );

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "AppprovedKYC",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }


  }

  saveForm(flag) {
    this.FormSubmit();
    this.IsApprovedFlag = flag;
    // this.AppprovedKYC(flag);
  }


  ApprovedClick() {
    try {

      if (this.UserKycData.isApproved.reasonId != 0) {

        this.ApprovedForm.patchValue({ Flag: 'Reject' });
        this.IsReasonActive = true;
        this.ApprovedForm.patchValue({ reasonId: this.UserKycData.isApproved.reasonId });

      }
      else {
        this.IsReasonActive = false;
        this.ApprovedForm.patchValue({ Flag: '' });
      }
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ApprovedClick",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  ApprovedFormSubmit() {
    
    try {

      if (this.IsReasonActive == true) {
        this.reasonId = this.ApprovedForm.value.reasonId;
        this.ApprovedForm.get('reasonId').clearValidators();
      }


      this.DisplayError1 = true;
      if (this.ApprovedForm.valid) {

        this.ApprovedForm.patchValue({ UserId: this.KycForm.value.userId });
        this.ApprovedForm.patchValue({ Flag: this.flag });
        this.ApprovedForm.patchValue({ reasonId: this.reasonId });
        this.ApprovedForm.patchValue({ Updated_by: this.KycForm.value.userId });

        this.DisplayError1 = false;

        this.registrationservice.Approve_Disapprove(this.ApprovedForm.value).subscribe(
          data => {
            
            window.scroll(0, 0);
            // this.ResponseHelper.GetSuccessResponse(data);
            if (this.flag == true) {
              let msg = [{ message: "Partner KYC Approved successfully", type: "SUCCESS" }]
              this.notificationservice.ChangeNotification(msg)
            }
            else {
              let msg = [{ message: "Partner KYC Rejected", type: "SUCCESS" }]
              this.notificationservice.ChangeNotification(msg)
            }

            this.closekycmodal.nativeElement.click();
            this.clearApprovedForm();
            this.GetUpdatedData();
            this.createAppproveForm();
           

          }, err => {
            // this.ResponseHelper.GetFaliureResponse(err);
          }
        );
      }
      else {
        this.DisplayError1 = true;
      }

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "ApprovedFormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  getvalue(event) {
    try {
      let value;
      value = event.target.value;
      
      if (value == 'Approved') {
        this.flag = true;
        this.IsReasonActive = false;
        this.reasonId = 0;
        this.ApprovedForm.get('reasonId').clearValidators();
      }
      else {
        this.flag = false;
        this.IsReasonActive = true;
        this.ApprovedForm.get('reasonId').setValidators([Validators.required]);

      }

    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "getvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  clearApprovedForm() {
    try {
      this.ApprovedForm.reset();
      this.IsReasonActive = false;
      this.ApprovedForm.patchValue({ Flag: '' });
      this.ApprovedForm.patchValue({ reasonId: '' });
      this.DisplayError1 = false;
    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "clearApprovedForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  createAppproveForm() {
    try {
      this.ApprovedForm = this.fb.group({
        'UserId': [''],
        'Flag': ['', Validators.required],
        'reason': [''],
        'reasonId': [''],
        'Updated_by': [''],

      });


    } catch (err) {
      var data = {
        "UserId": 'Partner Id'+this.Partner_User_Id,
        "Url": "",
        "screen": "KYC Details",
        "method": "createAppproveForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":  this.Partner_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }
}
