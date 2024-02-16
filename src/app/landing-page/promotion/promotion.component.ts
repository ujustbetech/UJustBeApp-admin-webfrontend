import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { RegistrationService } from "./../../service/registration.service";
import { PromotionService } from './../../service/promotion.service';
import * as moment from 'moment';
import { ExcelServiceService } from './../../service/excel-service.service';
import { Lightbox } from 'ngx-lightbox';
import { AppConfigService } from './../../service/app-config.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from "../../service/common.service";
import { CustomDateComponent } from "./../../manager/custom-date-component.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  Token: Token;
  userData;
  gridApi;
  gridColumnApi;
  gridOptions;
  ResponseHelper: ResponseHelper;
  PromotionForm: FormGroup;
  DisplayError: boolean = false;
  File;
  FileBase64;
  Filename = "No File Chosen";
  Mimetype: string;
  media: any = [];
  partnersList: any = [];
  Imagerequired: boolean = false;
  // ImageMax:boolean=false;
  rowData: any = [];
  editPromotion: any = '';
  IsImage: boolean = false;
  // min = new Date();
  exportToBtnDisable: boolean = false;
  Images_Album: any = [];
  PreviewFile: any;
  FileURL: any = '';
  FileUniqueName: any;
  content: any = '';
  control = new FormControl();
  Filesize: any;
  IsSizeExceed: boolean = false;
  SelectedClientPartner: string;
  PopulateData: any;
  IsAddPromotion: boolean = true;
  Isvalidratio: boolean = false;
  fileformat: any = '';
  formaterror: boolean = false;
  private frameworkComponents;
  public modules: any[] = AllCommunityModules;
  ImageIndex: any;

  @ViewChild('fileInput') fileInput: ElementRef;

  startDate: any;
  endDate: any;
  ApiUrl: string = "";


  columnDefs = [

    { headerName: 'Listed Partner', field: 'name' },
    {
      headerName: 'Start Date', field: 'startDate', suppressSizeToFit: false, minWidth: 130, width: 130, cellRenderer: this.StartDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let cdate = cellValue.split('T');
          let dateAsString = moment(cdate[0]).format('DD/MM/YYYY');
          var dateParts = dateAsString.split("/");
          var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }

        }
      }
    },
    {
      headerName: 'End Date', field: 'endDate', suppressSizeToFit: false, minWidth: 130, width: 130, cellRenderer: this.EndDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let cdate = cellValue.split('T');
          let dateAsString = moment(cdate[0]).format('DD/MM/YYYY');
          var dateParts = dateAsString.split("/");
          var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }

        }
      }
    },
    {
      headerName: 'Created Date', field: 'updated', suppressSizeToFit: false, minWidth: 130, width: 130, cellRenderer: this.CreatedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let cdate = cellValue.updated_On.split('T');
          let dateAsString = moment(cdate[0]).format('DD/MM/YYYY');
          var dateParts = dateAsString.split("/");
          var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }

        }
      }
    },
  ];

  constructor(protected AppConfigService: AppConfigService, private router: Router, private lightbox: Lightbox, private excelserviceService: ExcelServiceService, private promotionService: PromotionService, private registrationService: RegistrationService, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private commonservice: CommonService,
    private loggerService: LoggerService) {
      
    this.Token = new Token(this.router);
    this.frameworkComponents = { agDateInput: CustomDateComponent }
    this.ResponseHelper = new ResponseHelper(this.notificationservice)
    this.ApiUrl = AppConfigService.config.ApiUrl;
    this.userData = this.Token.GetUserData()
    

    var data = {
      "UserId":this.userData .UserId,
      "Url": "",
      "screen": "Promotion",
      "method": "constructor",
      "message": "Listed Business List Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":this.userData .UserId,
    }
    this.loggerService.Logger(data)

  }

  ngOnInit() {

    this.localStorage.removeItem('Partner_User_Id').subscribe(() => { }, () => { });

    this.GetUserList();
    this.createForm();
    this.GetPromotionList();
    this.media.length = 0;

    this.startDate = new Date();
    this.endDate = new Date('2099');


  }





  CreatedDate(params) {
    try {
      let promotioncdate = params.value.updated_On.split('T');
      let createddate = moment(promotioncdate[0]).format('DD/MM/YYYY');
      return createddate;
    } catch (err) {
      
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "CreatedDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }

  PromotioneDataxportAsXLSX(): void {
    try {
      ;
      this.exportToBtnDisable = true;
      var exportData = [];
      var count = this.gridApi.getDisplayedRowCount();
     
      for (var i = 0; i < count; i++) {
        var el = this.gridApi.getDisplayedRowAtIndex(i);
        var obj = new Object();  
  
        let stdate = moment(el.data.startDate).format('DD/MM/YYYY');

        let endate = moment(el.data.endDate).format('DD/MM/YYYY');

        let updateddate = moment(el.data.updated.updated_On).format('DD/MM/YYYY');

        obj['Listed Partner'] = el.data.name;
        obj['Start Date'] = stdate;
        obj['End Date'] = endate;
        obj['Created Date'] = updateddate;
      
        exportData.push(obj);
      }
      
      // this.rowData.forEach((el) => {
      //   var obj = new Object()

      //   let stdate = moment(el.startDate).format('DD/MM/YYYY');

      //   let endate = moment(el.endDate).format('DD/MM/YYYY');

      //   let updateddate = moment(el.updated.updated_On).format('DD/MM/YYYY');

      //   obj['Listed Partner'] = el.name;
      //   obj['Start Date'] = stdate;
      //   obj['End Date'] = endate;
      //   obj['Created Date'] = updateddate;

      //   exportData.push(obj);
      // })
      this.excelserviceService.exportAsExcelFile(exportData, 'Promotion-Export');
      this.exportToBtnDisable = false;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "PromotioneDataxportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }


  StartDate(params) {

    try {
      let sdate = moment(params.value).format('DD/MM/YYYY');
      return sdate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "Start Date",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  EndDate(params) {

    try {
      let edate = moment(params.value).format('DD/MM/YYYY');
      return edate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "End Date",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  onCellClicked(e) {
    ;

    try {
      window.scroll(0, 0);
      this.media=[];
      this.PromotionForm.patchValue({ 'PromotionId': e.data.id });

      this.promotionService.GetPromotionDetails(this.PromotionForm.value.PromotionId).subscribe(

        data => {
          
          this.editPromotion = data.json();

          //('promotion', this.editPromotion);
          var lpdetails = this.partnersList.find(x => x.userId == this.editPromotion.userId);
          if (lpdetails.isACtive) {
            document.getElementById("drplp").setAttribute("style", "background: white;");
          }
          else {
            document.getElementById("drplp").setAttribute("style", "background: #e9ecef;");
          }


          this.PromotionDetails(this.editPromotion);
       

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "onCellClicked",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  openImage(FileURL) {
    ;

    try {
      //this.Images_Album.push({ 'src': FileURL.currentSrc, 'caption': '', 'thumb': '' })

      this.Images_Album = [];
      //this.lightbox.open(this.Images_Album, 0);

      if (this.media) {

        for (let i = 0; i < this.media.length; i++) {

          this.Images_Album.push({ 'src': this.media[i].preview, 'caption': '', 'thumb': '' })

        }
        this.lightbox.open(this.Images_Album, FileURL);
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "openImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }

  }


  closeImage() {

    try {
      this.lightbox.close();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "closeImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  SelectClientPartner(event) {
    
    try {
      this.media = [];
      this.SelectedClientPartner = event.target.value;

      this.PopulateData = this.rowData.filter(a => a.userId == this.SelectedClientPartner);
    

      if (this.PopulateData.length > 0) {
        this.AddPromotionDetails(this.PopulateData);
      }
      else {
        this.ClearPromotionform();
        this.PromotionForm.patchValue({ 'userId': this.SelectedClientPartner })
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "SelectClientPartner",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }

  }


  AddPromotionDetails(Details) {
    try {

      this.PromotionForm.patchValue({ 'PromotionId': Details[0].id });

      this.PromotionForm.patchValue({ 'userId': Details[0].userId });
      this.PromotionForm.patchValue({ 'productServiceId': Details[0].productServiceId });
      this.PromotionForm.patchValue({ 'created_By': Details[0].userId });

      let date = Details[0].startDate.split('T');
      let date1 = Details[0].endDate.split('T');


      let sdate = date[0]

      let edate = date1[0]

      this.PromotionForm.patchValue({ 'startDate': new Date(sdate) });

      this.PromotionForm.patchValue({ 'endDate': new Date(edate) });


      this.media = [];
      this.IsImage = true;
      
      for (var i = 0; i <= Details[0].media.length; i++) {
        this.Filename = Details[0].media[i].fileName;

        this.FileURL = this.ApiUrl + '/Content' + Details[0].media[i].imageURL;
        //  

        let fileUrl = Details[0].media[i].imageURL

        this.FileUniqueName = Details[0].media[i].uniqueName;


        this.media.push({ 'FileName': this.Filename, 'FileURL': fileUrl, 'Base64string': '', 'FileUniqueName': this.FileUniqueName, 'preview': this.FileURL });
      }

      //this.Filename = Details[0].media[0].fileName;

      //let fileUrl = Details[0].media[0].imageURL

      //this.FileURL = this.ApiUrl + '/Content' + Details[0].media[0].imageURL;
      ////  this.ApiUrl +'/Content'+
      //this.FileUniqueName = Details[0].media[0].uniqueName;


      //this.media.push({ 'FileName': this.Filename, 'FileURL': fileUrl, 'Base64string': '', 'FileUniqueName': this.FileUniqueName });

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "AddPromotionDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }

  FormSubmit() {
    try {
      
      this.commonservice.showLoading();
      this.PromotionForm.patchValue({ Media: this.media });

      this.imageRequired();

      this.PromotionForm.patchValue({ created_By: this.PromotionForm.value.userId });



      this.startDate = this.ConvertDateFormat(this.PromotionForm.value.startDate);

      this.endDate = this.ConvertDateFormat(this.PromotionForm.value.endDate);

      // this.PromotionForm.patchValue({startDate:this.startDate});

      // this.PromotionForm.patchValue({endDate:this.endDate});
      this.PromotionForm.value.startDate = this.startDate;

      this.PromotionForm.value.endDate = this.endDate;


      if (this.PromotionForm.valid && this.formaterror == false && this.Imagerequired == false && this.IsSizeExceed == false && this.Isvalidratio == false) {

        this.DisplayError = false;

        this.promotionService.AddUpdatePromotion(this.PromotionForm.value)

          .subscribe(
            data => {



              this.ResponseHelper.GetSuccessResponse(data);

              this.ClearPromotionform();

              this.GetPromotionList();

              this.PromotionForm.patchValue({ 'userId': '' })

              this.FileURL = '';

              this.IsAddPromotion = true;

              this.commonservice.hideLoading();


            }, err => {
              this.ResponseHelper.GetFaliureResponse(err);
            }
          );

      }
      else {
        
        this.DisplayError = true;



        const invalid = [];
        const controls = this.PromotionForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.userData.UserId,
          "Url": "",
          "screen": "Promotion",
          "method": "FormSubmit",
          "message": "UserData :- " + JSON.stringify(this.PromotionForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.userData.UserId,
        }
        this.loggerService.Logger(invalidField)






        this.startDate = new Date();
        this.endDate = new Date('2099');
        this.commonservice.hideLoading();
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }



  ConvertDateFormat(getdate) {
    try {
      
      if (getdate._d) {
        var date = getdate._d;
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      }
      else {
        var date = getdate;
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "ConvertDateFormat",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }

  }


  PromotionDetails(Details) {
    try {
      
      this.media = [];
      this.PromotionForm.patchValue({ 'PromotionId': Details.id });

      if (this.PromotionForm.value.PromotionId != '') {

        this.IsAddPromotion = false;
      }
      else {
        this.IsAddPromotion = true;
      }

      this.PromotionForm.patchValue({ 'userId': Details.userId });
      this.PromotionForm.patchValue({ 'productServiceId': Details.productServiceId });
      this.PromotionForm.patchValue({ 'created_By': Details.userId });

      let date = Details.startDate.split('T');
      let date1 = Details.endDate.split('T');


      let sdate = date[0]

      let edate = date1[0]


      this.PromotionForm.patchValue({ 'startDate': new Date(sdate) });

      this.PromotionForm.patchValue({ 'endDate': new Date(edate) });

     // console.log(this.PromotionForm.value);

      
      this.IsImage = true;
      for (var i = 0; i <= Details.media.length; i++)
      {
        this.Filename = Details.media[i].fileName;

        this.FileURL = this.ApiUrl + '/Content' + Details.media[i].imageURL;
        //  

        let fileUrl = Details.media[i].imageURL

        this.FileUniqueName = Details.media[i].uniqueName;


        this.media.push({ 'FileName': this.Filename, 'FileURL': fileUrl, 'Base64string': '', 'FileUniqueName': this.FileUniqueName,'preview':this.FileURL });
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "PromotionDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }


  }



  // deleteimage(index){
  //   this.media.splice(index, 1);
  //   if(this.media.length < 1){   
  //     this.IsImage =false;
  //   }
  //   else{    
  //   this.IsImage =true;

  //   }
  // }

  imageRequired() {

    try {
      if (this.media.length < 1) {

        this.Imagerequired = true;
        this.IsImage = false;
      }
      else {

        this.Imagerequired = false;
        this.IsImage = true;

      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "imageRequired",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  // checkImagevalidation(){
  //   if(this.media.length > 5){

  //   this.ImageMax =true;
  //     }
  //   else{
  //   this.ImageMax =false;
  //     }
  //   }


  GetUploadFileData(event) {

    // this.media=[];
    try {
      let reader = new FileReader();

      if (event.target.files && event.target.files.length > 0) {
        for (var i = 0; i < event.target.files.length; i++) {
          this.File = event.target.files[i];

          this.Filename = this.File.name;

          this.fileformat = this.Filename.substr(this.Filename.lastIndexOf('.') + 1)


          this.Filesize = this.File.size / 1024 / 1024;

          //if (this.Filesize > 1) {

          //  this.IsSizeExceed = true;

          //} else {
          //  this.IsSizeExceed = false;
          //}

          //const img = new Image();
          //img.src = window.URL.createObjectURL(this.File);

          //reader.readAsDataURL(this.File);
          this.ConvertToBase64();
         // console.log(this.media);

          if (this.fileformat == "png" || this.fileformat == "jpg" || this.fileformat == "jpeg"
            || this.fileformat == "PNG" || this.fileformat == "JPG" || this.fileformat == "JPEG") {
            this.formaterror = false;
          }

          else {
            this.formaterror = true;
          }
        }

      }
      else {
        this.File = null;
        this.FileBase64 = null;
        this.Filename = "No File chosen"
      }
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "GetUploadFileData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    // event.srcElement.value = null;
  }

  ConvertToBase64() {

    try {
    //  this.media = [];

      let reader = new FileReader();
      reader.readAsDataURL(this.File);
      reader.onload = () => {

        this.FileURL = reader.result;

        this.FileBase64 = reader.result.toString().split(',')[1];

        this.Mimetype = reader.result.toString().split(',')[0];

        //if (this.editPromotion) {

        //  this.media.push({ 'FileName': this.Filename, 'FileURL': this.FileURL, 'Base64string': this.FileBase64, 'FileUniqueName': this.FileUniqueName });
        //}
        //else {
        this.media.push({ 'FileName': this.Filename, 'FileURL': '', 'Base64string': this.FileBase64, 'FileUniqueName': '', 'preview': this.FileURL });
       // }

        // let imageURL = this.media[0].FileURL;


        this.imageRequired();


      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "ConvertToBase64",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  deleteimage(index) {
    try {
      this.ImageIndex = index;

      document.getElementById("openModal_Delete").click();
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "deleteimage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }
  Deleteconfirm(flag: boolean) {
    try {
      if (flag) {
        this.PromotionForm.markAsDirty();
        this.media.splice(this.ImageIndex, 1);
       // this.checkImagevalidation();
      }
      else {

      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "Deleteconfirm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }

  ClearPromotionform() {

    //this.PromotionForm.reset();
    try {
      this.media = [];
      this.FileURL = "";
      this.DisplayError = false;
      this.PromotionForm.patchValue({ 'userId': "" })
      this.PromotionForm.patchValue({ 'PromotionId':"" });
      this.Imagerequired = false;
      this.startDate = new Date();
      this.endDate = new Date('2099');
      this.IsImage = false;
      //  this.Filename = "No File Chosen";
      this.fileInput.nativeElement.value = '';
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "ClearPromotionform",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetUserList() {
    try {
      
      this.promotionService.GetPromotionLPList()
        .subscribe(
          data => {
            let res = data.json();

            // a.isActive === true &&
          //  this.partnersList = res.data.partnersList.filter(a => a.role === 'Listed Partner');
            this.partnersList = res.data;
         //   console.log(this.partnersList)
            // console.log("a",this.partnersList);

            // for(let i = 0; i < this.partnersList.length; i++) {

            //   this.List.push(this.partnersList[i].userName)
            // }    

          }, err => {

          }
        );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "GetUserList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetPromotionList() {
    
    //  let userId=null;
    try {

      this.promotionService.GetPromotionList().subscribe(data => {
        let res = data.json();

        this.rowData = res.data;

       // console.log("a", this.rowData);

      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
      );
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "GetPromotionList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  createForm() {
    try {
      this.PromotionForm = this.fb.group({
        'PromotionId': [''],
        'userId': ['', Validators.required],
        'startDate': [''],
        'endDate': [''],
        'productServiceId': [''],
        'ReferenceUrl': [''],
        'created_By': [''],
        'Media': [[]]
      }

      );
    } catch (err) {

      
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  autoSizeAll() {
    try {
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
    } catch (err) {

            
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "autoSizeAll",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    // this.gridColumnApi.autoSizeColumns(allColumnIds);

  }


  onGridReady(params) {
    try {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Promotion Component",
        "method": "onGridReady",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }

}
