import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BusinessListingService } from './../../../service/business-listing.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ExcelServiceService } from './../../../service/excel-service.service';
import { Lightbox } from 'ngx-lightbox';
import * as moment from 'moment';
import { CommonService } from "../../../service/common.service";
import { AppConfigService } from './../../../service/app-config.service';
import '@ag-grid-community/client-side-row-model';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import { Router } from '@angular/router';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module } from '@ag-grid-community/core';




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  Token: Token;
  userData;
  gridApi;
  prevSingleVal: Number = 0;
  prevMultipleVal: Number[] = []
  prevProd = []
  prevProd1 = []
  prevSlab = []
  gridColumnApi;
  IsSingle: boolean = true;
  IsMultiple: boolean = false;
  IsProduct: boolean = false;
  IsSlab: boolean = false;
  ProductForm: FormGroup;
  DisplayError: boolean = false;
  ResponseHelper: ResponseHelper;
  UserId: string;
  File;
  FileBase64;
  Filename: string;
  fileformat: string;
  // BusinessId:string;
  selectedValue: any = '%';
  value: string;
  imageList: any = [];
  AddMoreImgae: boolean = true;
  sharetype: string;
  editdata: Info;
  Imagelength: boolean = false;
  hideaddmore: boolean = false;
  @Input() PartnerId;
  @Input() BusinessId;
  @Input() UserData;
  // @Input() ReferralPercentageAmount;
  @Output() previous_page = new EventEmitter<any>();
  @Output() next_page = new EventEmitter<any>();
  ServiceexportToBtnDisable: boolean = false;
  ProductexportToBtnDisable: boolean = false;
  accepted: boolean = false;
  // ProductImagerequired:boolean=false;
  Images_Album: any = [];
  rowData: any = [];
  rowData1: any = [];
  album: any = [];
  IsAddMore: boolean = true;
  IsProductServiceActive: boolean = false;
  isDealvalueGreater: boolean = false;
  // IsServiceActive:boolean=false;
  disableType: boolean = false;
  IsReset: boolean = false;
  IsPercentageValidation: boolean = false;
  Categories: any = [];
  percentageShareList: any = [];
  categoryList: any = [];
  ReferralPercentageAmount: boolean = true;
  BusinessData: any = '';
  IsBusinessAdded: boolean;
  isfromvalueGreater: boolean = false;
  isRupeesvalueGreater: boolean = false;
  isfromtozero: boolean = false;
  IsSlabOverlapped: boolean = false;
  @Output() IsDirtyform = new EventEmitter<any>();
  FileURL: any = '';
  isDefaultImg: any;
  ImageIndex: any;
  prod_index: any;
  IsDelete: boolean = false;
  Dateafter3months: any;
  todaysDate: any;
  ApiUrl: string = "";
  typeOf: string = "";
  chageShare_Type: string = "";
  strchanges: string = "";
  Previous_typeof: number;
  Previous_ShareType: number;
  modules: Module[] = [ClientSideRowModelModule];


  columnDefs = [

    { headerName: 'Name', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, field: 'name' },
    { headerName: 'Description', field: 'description', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, autoHeight: true },
    { headerName: 'URL', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, field: 'url' },
    { headerName: 'Price', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, field: 'productPrice' },
    { headerName: 'Minimum Deal Value', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, field: 'minimumDealValue' },
    // { headerName: 'Created Date', field: 'productsOrServices',cellRenderer: this.CreatedDate},  

  ];

  constructor(protected AppConfigService: AppConfigService, private lightbox: Lightbox, private excelserviceService: ExcelServiceService, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private businessListingService: BusinessListingService, private commonService: CommonService, private router: Router, private loggerService: LoggerService) {

    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.ApiUrl = AppConfigService.config.ApiUrl;

    this.editdata = new Info();

    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Product List",
      "method": "constructor",
      "message": "Product List Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)



  }


  ngOnInit() {

    try {

      this.createForm();

      this.GetBusinessCategories();

      this.GetCategoryList();

      this.ProductForm.patchValue({ 'isActive': true })

      this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].type.patchValue(1);

      this.editdata.typeOf = 1;

      this.UserId = this.PartnerId;

      this.GetProductServiceList();

      this.GetServiceList();
      this.ProductForm.value.productId = '';
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
    // this.GetDisabledata();


  }

  ngDoCheck() {
    try {
      if (this.ProductForm.dirty) {

        this.IsDirtyform.emit(true)
      }
      else {

        this.IsDirtyform.emit(false)
      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ngDoCheck",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }


  CreatedDate(params) {


    try {
      let createddate = moment(params.value.createdOn).format('DD/MM/YYYY');
      return createddate;
    }
    catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "CreatedDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


    }
  }

  ProductDataxportAsXLSX(): void {

    try {
      this.ProductexportToBtnDisable = true;
      var exportData = [];

      this.rowData.forEach((el) => {
        var obj = new Object()

        obj['Name'] = el.name;
        obj['Description'] = el.description;
        obj['URL'] = el.url;
        obj['Price'] = el.productPrice;
        obj['Minimum Deal Value'] = el.minimumDealValue;


        exportData.push(obj);
      })
      this.excelserviceService.exportAsExcelFile(exportData, 'Product-Export');
      this.ProductexportToBtnDisable = false;
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ProductDataxportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

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
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetCategoryList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  GetBusinessCategories() {

    try {
      if (this.PartnerId) {


        this.businessListingService.GetBusinessDetails(this.PartnerId).subscribe((data) => {

          let response = data.json();
          this.BusinessId = response.data.businessId;

          this.BusinessData = response.data;

          this.IsBusinessAdded = true;


          for (let i = 0; i < this.BusinessData.categories.length; i++) {

            this.Categories.push(this.BusinessData.categories[i].id);
          }
          this.GetCategoryList();
        },
          err => {
            if (err.status == 404) {

              this.IsBusinessAdded = false;

              // let msg = [{ message: "Business should be added First", type: "ERROR" }]

              //   this.notificationservice.ChangeNotification(msg);
            }
          }
        );
      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetBusinessCategories",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }


  SelectedCategories() {

    try {
      this.percentageShareList = [];

      for (let i = 0; i < this.Categories.length; i++) {

        let Id = this.Categories[i]

        let category = this.categoryList.filter(a => a.catId === Id);

        this.percentageShareList.push(category[0].percentageShare);
      }

      //if (this.percentageShareList.length == 2) {
      //  if (this.percentageShareList.every(v => v === true)) {

      //    this.ReferralPercentageAmount = true;
      //  }
      //  else if (this.percentageShareList.every(v => v === false)) {

      //    this.ReferralPercentageAmount = false;

      //  }
      // else{
      //   this.ReferralPercentageAmount = false;

      // }
      //}
      //else {

      //  if (this.percentageShareList[0] == true) {

      //    this.ReferralPercentageAmount = true;
      //  }
      //  else {
      //    this.ReferralPercentageAmount = false;

      //  }

      //}

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "SelectedCategories",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }



  ServiceDataxportAsXLSX(): void {
    try {

      this.ServiceexportToBtnDisable = true;
      var exportData = [];

      this.rowData1.forEach((el) => {
        var obj = new Object()

        obj['Name'] = el.name;
        obj['Description'] = el.description;
        obj['URL'] = el.url;
        obj['Price'] = el.productPrice;
        obj['Minimum Deal Value'] = el.minimumDealValue;

        exportData.push(obj);
      })

      this.excelserviceService.exportAsExcelFile(exportData, 'Service-Export');
      this.ServiceexportToBtnDisable = false;
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ServiceDataxportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


    }
  }

  checkImagevalidation() {
    try {

      if (this.imageList.length == 5 || this.imageList.length > 5) {
        this.hideaddmore = true;
      }
      else {
        this.hideaddmore = false;
      }

      if (this.imageList.length >= 5) {
        this.Imagelength = true;
      }
      else {

        this.Imagelength = false;

      }


    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkImagevalidation",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  // ProductimageRequired(){

  //   if(this.imageList.length < 1){

  //     this.ProductImagerequired =true;

  //   }
  //   else{

  //   this.ProductImagerequired =false;


  //   }
  // }

  openImage(index: number) {

    try {
      if (this.imageList) {

        for (let i = 0; i < this.imageList.length; i++) {

          this.Images_Album.push({ 'src': this.imageList[i].prodImgBase64, 'caption': '', 'thumb': '' })

        }
        this.lightbox.open(this.Images_Album, index);
      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "openImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  closeImage() {

    try {
      this.lightbox.close();

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "closeImage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  checkDealValue(dealvalue: any, price: number) {

    try {
      if (dealvalue != '') {

        if (Math.round(dealvalue) < Math.round(price)) {

          this.isDealvalueGreater = true;
        }
        else {

          this.isDealvalueGreater = false;

        }
      }
      else {
        this.isDealvalueGreater = false;

      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkDealValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

    // this.isDealvalueGreater=true;
  }

  GetFromToValues(from: any, to: any, i: any) {

    try {


      if (from != "" && to != "") {

        if ((Math.round(from) == 0) || (Math.round(to) == 0)) {

          this.isfromtozero = true;

        }
        else {
          this.isfromtozero = false;
        }

        if (Math.round(from) > Math.round(to)) {

          this.isfromvalueGreater = true;
        }
        else {

          this.isfromvalueGreater = false;
        }
      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetFromToValues",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }

  OnProductServiceChange(event) {
    try {

      let selectedprod = event.target.value;
      this.ResetProductForm();
      // this.editdata.typeOf= 1; 
      this.ProductForm.patchValue({ 'type': selectedprod });
      // this.editdata.typeOf= 1;  
      this.ProductForm.patchValue({ 'typeOf': 1 });
      this.GetDisabledata();
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "OnProductServiceChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  //checkValidations(shareType, typeOf)
  //{
  //    if (typeOf == 2) {
  //        if (shareType == 2) {
  //            this.ProductForm.get('from').clearValidators();
  //            this.ProductForm.get('to').clearValidators();
  //            this.ProductForm.get('productName').setValidators([Validators.required]);
  //        }
  //        else {
  //            this.ProductForm.get('from').setValidators([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
  //            this.ProductForm.get('to').setValidators([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
  //            this.ProductForm.get('productName').clearValidators();
  //        }
  //    }
  //    else
  //    {
  //        this.ProductForm.get('from').clearValidators();
  //        this.ProductForm.get('to').clearValidators();
  //        this.ProductForm.get('productName').clearValidators();
  //    }
  //}

  //checkSlabProductValidations(shareType, typeOf)
  //{
  //    if (typeOf == 2) {
  //        if (shareType == 2) {
  //            this.validateProducts();
  //        }
  //        else {
  //            this.validateSlabs();
  //        }
  //    }
  //}

  //validateProducts()
  //{
  //    for (const field in this.ProductForm.get("productName") as FormArray) { // 'field' is a string

  //        const prdName = this.ProductForm.get(field); // 'control' is a FormControl

  //        if (prdName.value == "")
  //        {

  //        }

  //    }
  //}

  //validateSlabs() {
  //    for (const field in this.ProductForm.get("ProductsOrServices") as FormArray) { // 'field' is a string

  //        const control = this.form.get(field); // 'control' is a FormControl

  //    }
  //}

  FormSubmit() {
    try {
      window.scroll(0, 0);

      if (this.IsBusinessAdded == true) {

        var drpProductService = <HTMLInputElement>document.getElementById("drpProductService");
        drpProductService.disabled = false;
        this.ProductForm.patchValue({ 'createdBy': this.UserId });
        this.ProductForm.patchValue({ 'businessId': this.BusinessId });



        if (this.imageList.length > 0) {


          for (let index = 0; index < this.imageList.length; index++) {

            if (this.imageList[index].prodImgBase64.indexOf(";base64,") < 0) {


              this.imageList[index].prodImgBase64 = '';

            }
            else {
              this.imageList[index].prodImgBase64 = this.imageList[index].prodImgBase64;
            }

          }
          this.ProductForm.value.productImages = this.imageList;
        }
        else {
          this.ProductForm.value.productImages = [];
        }


        if (this.ProductForm.value.productId == "") {
          this.checkProductServiceCount();
        }

        //if (this.ReferralPercentageAmount == false) {

        // this.ProductForm.value.ProductsOrServices = [];

        // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.setErrors(null);

        // }


        if (this.ProductForm.valid && this.Imagelength == false && this.isfromvalueGreater == false &&
          this.IsProductServiceActive == false && this.isDealvalueGreater == false && this.isfromtozero == false
          && this.isRupeesvalueGreater == false && this.IsSlabOverlapped == false) {
          this.commonService.showLoading();

          this.DisplayError = false;

          this.disableType = false;

          for (var i = 0; i < this.ProductForm.value.ProductsOrServices.length; i++) {
            if (this.Previous_typeof != this.ProductForm.value.typeOf) {
              this.ProductForm.value.ProductsOrServices[i].productDetailsId = "";
              //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
            }
            if (this.Previous_ShareType != this.ProductForm.value.shareType && this.Previous_ShareType != null && this.ProductForm.value.shareType != "") {
              this.ProductForm.value.ProductsOrServices[i].productDetailsId = "";
              //if (this.Previous_ShareType == 1 && this.ProductForm.value.shareType == 2) {
              //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue('');
              //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue('');
              //} else if (this.Previous_ShareType == 2 && this.ProductForm.value.shareType == 1) {
              //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');
              //}
            }
            //this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue('');
            //this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue('');
            //this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue('');
            //this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');

          }

          // console.log(this.ProductForm.value);

          this.businessListingService.AddEditProductDetails(this.ProductForm.value).subscribe(data => {


            if (this.ProductForm.value.productId) {

              if (this.ProductForm.value.type == 'Product') {

                let a = [{ message: "Product Updated Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(a);
              }
              else {
                let a = [{ message: "Service Updated Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(a);

              }

            }
            else {

              if (this.ProductForm.value.type == 'Product') {

                let a = [{ message: "Product Added Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(a);

              }
              else {
                let a = [{ message: "Service Added Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(a);

              }

            }
            this.ResetProductForm();

            this.GetProductServiceList();

            this.GetServiceList();


            this.commonService.hideLoading();

          },
            err => {
              this.commonService.hideLoading();
            }
          );

        }
        else {
          this.DisplayError = true;
          this.commonService.hideLoading();

          const invalid = [];
          const controls = this.ProductForm.controls;
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }


          var invalidField = {
            "UserId": this.userData.UserId,
            "Url": "",
            "screen": "Product List",
            "method": "FormSubmit",
            "message": "UserData :- " + JSON.stringify(this.ProductForm.value),
            "error": "User Invalid Field(s) :- " + invalid.toString(),
            "date": new Date(),
            "source": "WebSite",
            "createdBy": this.userData.UserId,
          }
          this.loggerService.Logger(invalidField)
        }
      }
      else {
        let msg = [{ message: "Business should be added First", type: "ERROR" }]

        this.notificationservice.ChangeNotification(msg);
      }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  ResetProductForm() {
    try {

      this.ProductForm.reset();

      this.imageList = [];

      this.IsMultiple = false;

      this.IsSingle = true;

      this.IsProduct = false;

      this.IsSlab = false;

      this.createForm();

      this.ProductForm.patchValue({ 'isActive': true });

      this.ProductForm.patchValue({ 'typeOf': true });

      // this.ProductForm.patchValue({ 'type': '' });  

      this.editdata.typeOf = 1;


      this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].type.patchValue(1);

      var drpProductService = <HTMLInputElement>document.getElementById("drpProductService");
      drpProductService.disabled = false;

      this.GetDisabledata();
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ResetProductForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }


  }


  onchangeofreferaltype(Index: any) {


    try {
      this.ProductForm['controls']['ProductsOrServices']['controls'][Index]['controls'].value.patchValue("");

      this.ProductForm['controls']['ProductsOrServices']['controls'][Index]['controls'].value.setValidators([Validators.maxLength(9)]);
      //  this.checkPercentageValidation();

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onchangeofreferaltype",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }


  checkPercentageValidation(i: any) {
    try {

      if (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].type.value == 1) {

        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.setValidators([Validators.max(100)]);
      }
      else {
        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.setErrors(null);
      }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkPercentageValidation",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }


  }

  checkRupeesValidation(from: any, to: any, value: any, i: any) {

    try {
      if (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].type.value == 2) {

        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.clearValidators();

        if (Math.round(to) < Math.round(value)) {

          this.isRupeesvalueGreater = true;
        }
        else {

          this.isRupeesvalueGreater = false;
        }
      }
      else {
        this.isRupeesvalueGreater = false;
      }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkRupeesValidation",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  ConfirmmodalTypeOfChange(strchanges: string, value: string) {
    this.typeOf = value;
    this.strchanges = strchanges;
    if (this.editdata.productId != null && this.editdata.productId != "") {
      document.getElementById("confirmproductModal").click();
    }
    // else if ((this.strchanges == "shareType" && this.editdata.shareType == 1 && this.typeOf == "slab") || (this.strchanges == "shareType" && this.editdata.shareType == 2 && this.typeOf == "product")) {
    //  document.getElementById("confirmproductModal").click(); 
    //}
    else {
      this.ConfirmTypeOfChange(true);
    }
  }
  ConfirmTypeOfChange(flag: boolean) {
    try {

      if (flag) {
        this.ProductForm.value.ProductsOrServices = [];
        if (this.strchanges == "typeOf") {
          this.onTypeOfChange(this.typeOf);
        }
        else {

          this.onSharetypeChange(this.typeOf);
        }

      }
      else {
        this.ProductForm['controls']['shareType'].patchValue(this.editdata.shareType);
        this.ProductForm['controls']['typeOf'].patchValue(this.editdata.typeOf);
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "Confirmdealstatus",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ConfirmSharetypeChange(value: string) {
    if (this.editdata != null && this.editdata.shareType != null) {
      document.getElementById("confirmproductModal").click();
    }
  }


  onTypeOfChange(value: string) {

    try {


      this.value = value;

      this.sharetype = '';
      if (this.value == 'multiple') {


        this.IsMultiple = true;
        this.sharetype = 'Slab';
        this.IsSlab = true;
        this.editdata.shareType = 1;
        this.IsSingle = false;
        this.prevSingleVal = this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.value

        this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue('');
        // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue(0)
        //  console.log(this.prevProd1);
        for (var j = 0; j < this.prevProd1.length - 1; j++) {
          this.AddProductsOrServices()
        }

        if (this.Previous_ShareType == 1) {
          for (let i = 1; i < this.editdata.productsOrServices.length; i++) {
            // this.ProductsOrServices.removeAt(i);
            const ProductsOrService = this.ProductForm.get("ProductsOrServices") as FormArray;

            ProductsOrService.push(this.fb.group({
              'productDetailsId': '',
              'type': '',
              'value': '',
              'from': '',
              'to': '',
              'productName': '',
              'createdOn': '',
              'isActive': true,
              'updatedOn': ''
            })
            );
          }
          //// this.ProductForm.value.ProductsOrServices=[];

          for (var j = 0; j < this.editdata.productsOrServices.length; j++) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue(this.editdata.productsOrServices[j].value);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue(this.editdata.productsOrServices[j].from);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue(this.editdata.productsOrServices[j].to);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].type.patchValue(this.editdata.productsOrServices[j].type);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productName.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productDetailsId.patchValue(this.editdata.productsOrServices[j].productDetailsId);

          }
        }
        else {
          let cnt1 = this.ProductForm['controls']['ProductsOrServices']['controls'].length;
          for (let i = 0; i < cnt1; i++) {

            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
            // this.prevMultipleVal.push(this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value)
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');

          }
          for (let i = 0; i < cnt1; i++) {

            if (this.ProductForm.value.ProductsOrServices.length > 1) {
              this.ProductForm['controls']['ProductsOrServices']['controls'].splice(0, 1)
            }
          }
          for (var i = 0; i < 1; i++) {


            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
          }

          this.ProductForm.value.ProductsOrServices = null;
        }
      }
      else if (this.value == 'single') {
        this.prevMultipleVal = []
        this.prevProd1 = []
        this.IsSingle = true;
        this.IsMultiple = false;
        this.IsSlab = false;
        this.IsProduct = false;
        var ob = {};
        this.ProductForm['controls']['shareType'].patchValue(null);
        if (this.ProductForm.value.ProductsOrServices.length > 0) {
          for (let i = 0; i < this.ProductForm.value.ProductsOrServices.length; i++) {

            ob = {
              value: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value,
              from: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value,
              to: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value
            }
            this.prevProd1.push(ob)

            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
            // this.prevMultipleVal.push(this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value)
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');
          }
          let cnt1 = this.ProductForm.value.ProductsOrServices.length;
          for (let i = 0; i < cnt1; i++) {
            if (this.ProductForm.value.ProductsOrServices.length > 1) {
              this.ProductForm['controls']['ProductsOrServices']['controls'].splice(0, 1)
            }
          }
          if (this.Previous_typeof == 1) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue(this.prevSingleVal);
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].productDetailsId.patchValue(this.editdata.productsOrServices[0].productDetailsId);
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].productName.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'].length = 1;
          }
          else {

            this.AddProductsOrServices();
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].productDetailsId.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].productName.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'].length = 1;
          }


        }
      } else {
        this.ProductForm['controls']['ProductsOrServices']['controls'].length = 1;

      }
      // if(this.ProductForm.value.productId){
      //   this.checkvalidity();
      // }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onTypeOfChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


    }
  }


  onTypeOfChange_old(value: string) {

    try {
      this.ProductForm.value.ProductsOrServices = [];

      this.value = value;

      this.sharetype = '';
      if (this.value == 'multiple') {


        this.IsMultiple = true;
        this.sharetype = 'Slab';
        this.IsSlab = true;
        this.editdata.shareType = 1;
        this.IsSingle = false;
        this.prevSingleVal = this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.value

        this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue('');
        // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue(0)
        for (var j = 0; j < this.prevProd1.length - 1; j++) {
          this.AddProductsOrServices()
        }

        for (var i = 0; i < this.prevProd1.length; i++) {

          // for (var j = 0; j < this.prevProd.length; j++) {
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue(this.prevProd1[i].value);
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue(this.prevProd1[i].from);
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue(this.prevProd1[i].to);
          // }
          //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue(this.prevMultipleVal[i])
        }


      }
      else if (this.value == 'single') {
        this.prevMultipleVal = []
        this.prevProd1 = []
        this.IsSingle = true;
        this.IsMultiple = false;
        this.IsSlab = false;
        this.IsProduct = false;
        this.ProductForm.value.shareType = null;
        this.ProductForm.patchValue({ 'shareType': null });
        var ob = {}
        for (let i = 0; i < this.ProductForm.value.ProductsOrServices.length; i++) {

          ob = {
            value: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value,
            from: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value,
            to: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value
          }
          this.prevProd1.push(ob)

          // this.prevMultipleVal.push(this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value)
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue('');


        }
        this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue(this.prevSingleVal);
        this.ProductForm['controls']['ProductsOrServices']['controls'].length = 1

      }
      // if(this.ProductForm.value.productId){
      //   this.checkvalidity();
      // }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onTypeOfChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


    }
  }
  onSharetypeChange(value: string) {
    try {

      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue('');
      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue('');
      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue('');


      var obj = {}

      this.sharetype = value;
      if (this.sharetype == 'product') {

        this.IsProduct = true;
        this.IsSlab = false;

        //  this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue('');
        // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue('');
        if (this.Previous_ShareType == 1 || this.Previous_ShareType == null) {
          const abc = this.ProductForm['controls']['ProductsOrServices']['controls'] as FormArray;
          let cnt1 = this.ProductForm['controls']['ProductsOrServices']['controls'].length;
          for (var i = 0; i < cnt1; i++) {

            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
          }
          for (var i = 0; i < cnt1; i++) {
            if (this.ProductForm['controls']['ProductsOrServices']['controls'].length > 1) {
              this.ProductForm['controls']['ProductsOrServices']['controls'].splice(0, 1);
            }
          }
          // this.ProductForm.patchValue({ 'ProductsOrServices': [] });
          //  this.ProductForm.value.ProductsOrServices = null;
          for (var l = 0; l < 1; l++) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].productName.patchValue("")
            this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].value.patchValue("")
            this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].from.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].to.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].productDetailsId.patchValue("");

          }
        } else {
          for (let i = 1; i < this.editdata.productsOrServices.length; i++) {
            // this.ProductsOrServices.removeAt(i);
            const ProductsOrService = this.ProductForm.get("ProductsOrServices") as FormArray;

            ProductsOrService.push(this.fb.group({
              'productDetailsId': '',
              'type': '',
              'value': '',
              'from': '',
              'to': '',
              'productName': '',
              'createdOn': '',
              'isActive': true,
              'updatedOn': ''
            })
            );
          }
          //// this.ProductForm.value.ProductsOrServices=[];

          for (var j = 0; j < this.editdata.productsOrServices.length; j++) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue(this.editdata.productsOrServices[j].value);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productName.patchValue(this.editdata.productsOrServices[j].productName);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].type.patchValue(this.editdata.productsOrServices[j].type);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productDetailsId.patchValue(this.editdata.productsOrServices[j].productDetailsId);


          }
        }


      }
      else {
        var obs = {}
        this.prevSlab = [];
        this.IsProduct = false;
        this.IsSlab = true;
        if (this.Previous_ShareType == 2 || this.Previous_ShareType == null) {


          let cnt1 = this.ProductForm['controls']['ProductsOrServices']['controls'].length;
          for (var j = 0; j < cnt1; j++) {

            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productName.patchValue('');
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productDetailsId.patchValue("");
          }
          for (var j = 0; j < cnt1; j++) {
            if (this.ProductForm['controls']['ProductsOrServices']['controls'].length > 1) {
              this.ProductForm['controls']['ProductsOrServices']['controls'].splice(0, 1);
            }
          }

          this.ProductForm.value.ProductsOrServices = null;
          this.IsProduct = false;
          this.IsSlab = true;

          for (var j = 0; j < 1; j++) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productName.patchValue('');
          }
        }

        else {
          for (let i = 1; i < this.editdata.productsOrServices.length; i++) {
            // this.ProductsOrServices.removeAt(i);
            const ProductsOrService = this.ProductForm.get("ProductsOrServices") as FormArray;

            ProductsOrService.push(this.fb.group({
              'productDetailsId': '',
              'type': '',
              'value': '',
              'from': '',
              'to': '',
              'productName': '',
              'createdOn': '',
              'isActive': true,
              'updatedOn': ''
            })
            );
          }
          //// this.ProductForm.value.ProductsOrServices=[];

          for (var j = 0; j < this.editdata.productsOrServices.length; j++) {
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue(this.editdata.productsOrServices[j].value);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue(this.editdata.productsOrServices[j].from);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue(this.editdata.productsOrServices[j].to);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].type.patchValue(this.editdata.productsOrServices[j].type);
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productName.patchValue("");
            this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].productDetailsId.patchValue(this.editdata.productsOrServices[j].productDetailsId);


          }
        }
        //this.ProductForm.patchValue({ 'ProductsOrServices': this.editdata.productsOrServices });
        // if(this.ProductForm.value.productId){
        //   this.checkvalidity();
        // }
      }
    }
    catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onSharetypeChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }


  onSharetypeChange_old(value: string) {
    try {

      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].value.patchValue('');
      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue('');
      // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue('');


      var obj = {}

      this.sharetype = value;
      if (this.sharetype == 'product') {

        this.IsProduct = true;
        this.IsSlab = false;

        //  this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].from.patchValue('');
        // this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].to.patchValue('');

        for (var i = 0; i < this.ProductForm['controls']['ProductsOrServices']['controls'].length; i++) {

          obj = {
            value: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.value,
            from: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value,
            to: this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value
          }
          this.prevProd.push(obj)
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue('');
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue('');
          this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue('');
        }

        for (var l = 0; l < this.prevSlab.length; l++) {
          this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].productName.patchValue(this.prevSlab[l].productName)
          this.ProductForm['controls']['ProductsOrServices']['controls'][l]['controls'].value.patchValue(this.prevSlab[l].value)

        }


      }
      else {
        var obs = {}

        for (var k = 0; k < this.ProductForm['controls']['ProductsOrServices']['controls'].length; k++) {
          obs = {
            productName: this.ProductForm['controls']['ProductsOrServices']['controls'][k]['controls'].productName.value,
            value: this.ProductForm['controls']['ProductsOrServices']['controls'][k]['controls'].value.value
          }
          this.prevSlab.push(obs)

        }


        for (var j = 0; j < this.prevProd.length; j++) {
          this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].value.patchValue(this.prevProd[j].value);
          this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.patchValue(this.prevProd[j].from);
          this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.patchValue(this.prevProd[j].to);
        }
        this.IsProduct = false;
        this.IsSlab = true;
        //   this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].productName.patchValue('');

      }
      // if(this.ProductForm.value.productId){
      //   this.checkvalidity();
      // }

    }
    catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onSharetypeChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  GoToNext() {

    try {
      this.next_page.emit('product');

      this.UserData.Is_Product_Completed = true;
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GoToNext",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


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
        this.ProductForm.markAsDirty();
        this.imageList.splice(this.ImageIndex, 1);
        this.checkImagevalidation();
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


  //   selectFile() {

  //     let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
  //     element.click();
  //     // this.checkImagevalidation();

  // }

  GetUploadFileData(event) {
    try {

      this.ProductForm.markAsDirty();


      if (event.target.files && event.target.files.length > 0) {

        // this.File = event.target.files[0];
        // this.Filename = this.File.name;     
        // this.fileformat = this.Filename.substr(this.Filename.lastIndexOf('.')+1);


        for (var i = 0; i < event.target.files.length; i++) {
          // 
          // this.File = event.target.files[i];
          // this.Filename = this.File.name;  
          // this.fileformat = this.Filename.substr(this.Filename.lastIndexOf('.')+1);

          this.File = event.target.files[i];
          this.Filename = this.File.name;
          var fileformat = this.Filename.substr(this.Filename.lastIndexOf('.') + 1);


          this.ConvertToBase64(this.Filename, fileformat);
        }

      }
      else {
        this.File = null;
        this.FileBase64 = null;
        this.Filename = "No File chosen"
      }
      event.srcElement.value = null;
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetUploadFileData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  ConvertToBase64(Filename: any, fileformat: any) {
    try {

      let reader = new FileReader();
      reader.readAsDataURL(this.File);
      reader.onload = () => {

        this.FileBase64 = reader.result;
        // this.FileURL = reader.result;
        this.Filename = Filename;

        // this.FileBase64 = reader.result.toString().split(',')[1];

        // if(this.editdata.productImages){

        // this.imageList.push({'prodImgBase64':'','prodImgName':this.Filename,'ImageURL':this.FileURL,'isDefaultImg':""});

        // }
        // else{
        this.imageList.push({ 'prodImgBase64': this.FileBase64, 'prodImgName': this.Filename, 'ImageURL': '', 'isDefaultImg': "" });
        // }

        for (let i = 0; i < this.imageList.length; i++) {

          if (i == 0) {

            this.imageList[i].isDefaultImg = true;

          }
          else {

            this.imageList[i].isDefaultImg = false;

          }

        }
        this.checkImagevalidation();
        // this.ProductimageRequired();
      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ConvertToBase64",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
  }

  onRadioChange(imagename) {
    try {

      this.ProductForm.markAsDirty();

      for (let i = 0; i < this.imageList.length; i++) {

        if (this.imageList[i].prodImgName == imagename) {

          this.imageList[i].isDefaultImg = true;

        }
        else {

          this.imageList[i].isDefaultImg = false;

        }


      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onRadioChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }
    // console.log("list",this.imageList);

  }


  onCellClicked(e) {
    try {


      // this.ResetProductForm();
      this.ProductForm.value.productId = '';
      this.editdata = null;
      this.IsReset = true;
      this.imageList = [];

      this.ProductForm['controls']['ProductsOrServices']['controls'][0]['controls'].type.patchValue(1);

      this.ProductForm.patchValue({ 'productId': e.data.productId });

      let cnt1 = this.ProductForm['controls']['ProductsOrServices']['controls'].length;
      for (var i = 0; i < cnt1; i++) {

        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].value.patchValue('');
        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.patchValue('');
        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.patchValue('');
        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productName.patchValue('');
        this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].productDetailsId.patchValue("");
      }
      for (var i = 0; i < cnt1; i++) {
        if (this.ProductForm['controls']['ProductsOrServices']['controls'].length > 1) {
          this.ProductForm['controls']['ProductsOrServices']['controls'].splice(0, 1);
        }
      }

      this.ProductForm.patchValue({ 'ProductsOrServices': [] });

      let Id = e.data.productId;

      this.businessListingService.getProductServiceData(Id).subscribe(

        data => {

          let response = data.json();

          this.editdata = response.data;
          //  console.log('data', this.editdata);

          this.ProductForm.patchValue({ 'type': this.editdata.type });

          this.ProductForm.patchValue({ 'isActive': this.editdata.isActive });


          this.ProductForm.patchValue({ 'typeOf': this.editdata.typeOf });


          // this.imageList = this.editdata.productImages;


          this.GetProductImages(this.editdata.productImages);

          this.CheckProductEditValidity(this.editdata);
          this.loadForm(this.editdata);


        }, err => {

        }
      );

      var drpProductService = <HTMLInputElement>document.getElementById("drpProductService");
      drpProductService.disabled = true;
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onCellClicked",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }


  GetProductImages(ProductImages: any) {
    try {


      for (let i = 0; i < ProductImages.length; i++) {

        this.Filename = ProductImages[i].prodImgName;
        this.FileURL = this.ApiUrl + '/' + ProductImages[i].imageURL;
        let fileUrl = ProductImages[i].imageURL
        this.FileBase64 = '';
        this.isDefaultImg = ProductImages[i].isDefaultImg;


        this.imageList.push({ 'prodImgBase64': this.FileURL, 'prodImgName': this.Filename, 'ImageURL': fileUrl, 'isDefaultImg': this.isDefaultImg });

      }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetProductImages",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }


    // this.Filename=Details.media[0].fileName;

    // this.FileURL= this.ApiUrl +'/Content'+ Details.media[0].imageURL;      

    //  let  fileUrl=Details.media[0].imageURL 
    // this.FileUniqueName= Details.media[0].uniqueName;



    // this.media.push({'FileName':this.Filename,'FileURL': fileUrl,'Base64string':'','FileUniqueName':this.FileUniqueName});
  }

  CheckProductEditValidity(data: any) {

    try {

      if (data.updated.updated_On == null) {

        let date = moment(data.created.created_On).format('DD/MM/YYYY');
        var newdate = moment(date).add(3, 'months').calendar();

      } else {
        let date = moment(data.updated.updated_On).format('DD/MM/YYYY');
        var newdate = moment(date).add(3, 'months').calendar();
      }

      this.Dateafter3months = moment(newdate).format('DD/MM/YYYY');
      this.todaysDate = moment(new Date()).format('DD/MM/YYYY');
      // this.checkvalidity();
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "CheckProductEditValidity",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)

    }

  }

  checkvalidity() {
    try {


      var single = <HTMLInputElement>document.getElementById("single-r");
      var multiple = <HTMLInputElement>document.getElementById("multiple-r");
      if (this.editdata.typeOf == 2) {
        var slab = <HTMLInputElement>document.getElementById("slab-r");
        var prod = <HTMLInputElement>document.getElementById("prd-r");
      }
      if (this.Dateafter3months < this.todaysDate || this.Dateafter3months == this.todaysDate) {
        single.disabled = false;
        multiple.disabled = false;
        if (this.editdata.typeOf == 2) {
          slab.disabled = false;
          prod.disabled = false;
        }

      }
      else {
        document.getElementById("edit_product_Modal").click();
        single.disabled = true;
        multiple.disabled = true;
        if (this.editdata.typeOf == 2) {
          slab.disabled = true;
          prod.disabled = true;
        }


      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkvalidity",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }

  checkIsProductValue(event) {
    try {

      if (this.editdata.isAllowDelete) {


        if (event.target.checked == true) {

          this.ProductForm.patchValue({ 'isActive': true });

        }
        else {
          this.ProductForm.patchValue({ 'isActive': false });
        }
      }
      else {
        alert("This product/service can not be deleted as there is a active referral against it");
        this.ProductForm.patchValue({ 'isActive': true });
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkIsProductValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  checkProductServiceCount() {
    try {


      if (this.ProductForm.value.type == 'Service') {

        if (this.rowData1.length >= 5) {

          this.IsProductServiceActive = true;

          let a = [{ message: "You can add maximum 5 Services", type: "ERROR" }]

          this.notificationservice.ChangeNotification(a);

        }
        else {

          this.IsProductServiceActive = false;

        }

      }
      else {
        if (this.rowData.length >= 5) {

          this.IsProductServiceActive = true;

          let a = [{ message: "You can add maximum 5 Products", type: "ERROR" }]

          this.notificationservice.ChangeNotification(a);

        }
        else {

          this.IsProductServiceActive = false;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkProductServiceCount",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }

  }


  loadForm(data) {

    try {

      if (this.editdata.typeOf == 1 && this.editdata.shareType == null) {

        // this.ProductForm.patchValue({'ProductsOrServices': data.productsOrServices});

        this.IsMultiple = false;
        this.IsSlab = false;
        this.IsProduct = false;
        this.IsSingle = true;
      }
      else if (this.editdata.typeOf == null) {

        this.IsSlab = false;
        this.IsMultiple = false;
        this.IsProduct = false;
        this.IsSingle = true;
      }
      else {

        // this.onSharetypeChange('Slab')
        // this.IsMultiple= true;
        // this.IsSlab =true;
        // this.IsSingle=false;

        if (this.editdata.shareType == 1) {

          // this.onSharetypeChange('Slab')
          this.IsMultiple = true;
          this.IsSlab = true;
          this.IsProduct = false;
          this.IsSingle = false;

        }
        else if (this.editdata.shareType == 2) {
          //  this.onSharetypeChange('product')
          this.IsMultiple = true;
          this.IsSlab = false;
          this.IsProduct = true;
          this.IsSingle = false;


        }
      }

      this.Previous_typeof = this.editdata.typeOf;
      this.Previous_ShareType = this.editdata.shareType;

      // for (let i = 0; i < this.ProductForm.value.productsOrServices.length; i++){
      //   // this.ProductForm.value.productsOrServices.splice(i,1);
      //   this.ProductForm.value.productsOrServices.reset();

      //   }   


      for (let i = 1; i < data.productsOrServices.length; i++) {
        // this.ProductsOrServices.removeAt(i);
        const ProductsOrService = this.ProductForm.get("ProductsOrServices") as FormArray;

        ProductsOrService.push(this.fb.group({
          'productDetailsId': '',
          'type': '',
          'value': '',
          'from': '',
          'to': '',
          'productName': '',
          'createdOn': '',
          'isActive': '',
          'updatedOn': ''
        })
        );
      }
      // this.ProductForm.value.ProductsOrServices=[];
      this.ProductForm.patchValue({ 'ProductsOrServices': data.productsOrServices });


      // this.checkvalidity();
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "loadForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data1)


    }
  }

  checkslabsoverlapping(Index: number) {

    try {
      if (Index != 0) {
        let a = this.ProductForm['controls']['ProductsOrServices']['controls'][Index - 1]['controls'].to.value

        if (+a >= +(this.ProductForm['controls']['ProductsOrServices']['controls'][Index]['controls'].from.value)) {

          this.IsSlabOverlapped = true;

        }
        else {
          this.IsSlabOverlapped = false;
        }
      }



    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "checkslabsoverlapping",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


    // for (let i = 0; i < this.ProductForm.value.ProductsOrServices.length; i++) {

    //  if(this.ProductForm['controls']['ProductsOrServices']['controls'][i+1]['controls'].from.value <=
    //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value

    //  ){

    //   this.IsSlabOverlapped=true;
    //   break;

    //  }
    //  else{
    //   this.IsSlabOverlapped=false;
    //  }

    // }
  }


  // checkslabsoverlapping(){
  //   

  // console.log(this.ProductForm.value.ProductsOrServices);

  // for (let i = 0; i < this.ProductForm.value.ProductsOrServices.length; i++) {


  //   for (let j = 0; j < this.ProductForm.value.ProductsOrServices.length; j++) {

  //     if(i != j){
  //       if(
  //       //   (this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.value <=

  //       // this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value)

  //      //  || (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value ==

  //      //  this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value)

  //      (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value >=

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.value) &&
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value <=

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.value) ||
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value >=

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.value)  &&
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value <=

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.value) ||
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value ==

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.value) ||
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].from.value ==

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.value) ||
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value ==

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].from.value) ||
  //       (this.ProductForm['controls']['ProductsOrServices']['controls'][i]['controls'].to.value ==

  //       this.ProductForm['controls']['ProductsOrServices']['controls'][j]['controls'].to.value)
  //       ){

  //        this.IsSlabOverlapped=true;
  //        break;

  //       }
  //       else{
  //        this.IsSlabOverlapped=false;
  //       }
  //     }
  //   }


  // }

  // }


  GetProductServiceList() {

    try {

      this.businessListingService.GetProductServiceList(this.UserId, 'Product').subscribe(
        data => {
          this.commonService.showLoading();
          let res = data.json();
          this.rowData = res.data;



          this.ProductForm.patchValue({ 'createdBy': this.UserId });
          this.commonService.hideLoading();

        }, err => {

        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetProductServiceList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetServiceList() {

    try {

      this.businessListingService.GetProductServiceList(this.UserId, 'Service').subscribe(
        data => {
          this.commonService.showLoading();
          let res = data.json();
          this.rowData1 = res.data;


          this.ProductForm.patchValue({ 'createdBy': this.UserId });
          this.commonService.hideLoading();

        }, err => {

        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetServiceList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Backpage() {

    try {
      this.previous_page.emit('product');

      this.UserData.Is_Business_Completed = false;

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "Backpage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
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
      this.gridColumnApi.autoSizeColumns(allColumnIds);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "autoSizeAll",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }
    //  this.gridApi.sizeColumnsToFit();  
  }


  onGridReady(params) {
    try {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.sizeColumnsToFit();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "onGridReady",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }
  // ^[+-]?([0-9]*[.])?[0-9]+$

  //    maxPercentValidator(control: AbstractControl): { [key: string]: boolean } | null {
  //    if (control.value !== undefined && (isNaN(control.value) || control.value > 100)) {
  //        return { 'ageRange': true };
  //    }
  //    return null;
  //}

  createForm() {

    try {
      this.ProductForm = this.fb.group({
        'businessId': [''],
        'productId': [''],
        'type': ['', Validators.required],
        'name': ['', Validators.required],
        'description': [''],
        'url': ['', Validators.pattern('^(http[s]?:\\/\\/){0,1}(www\\.){0,1}[a-zA-Z0-9\\.\\-]+\\.[a-zA-Z]{2,5}[\\.]{0,1}$')],
        'productPrice': ['0', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
        'minimumDealValue': ['0', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
        'shareType': [''],
        'createdBy': [''],
        'typeOf': [true, Validators.required],
        'isActive': [true],

        'ProductsOrServices': this.fb.array([this.fb.group
          ({
            'productDetailsId': '',
            'type': [''],
            //'value': ['', Validators.compose([Validators.max(100), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
            'value': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
            'from': ['', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
            'to': ['', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
            'productName': [''],
            //'value': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
            //'from': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
            //'to': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
            //'productName': ['', Validators.required]
            'createdOn': [''],
            'isActive': [true],
            'updatedOn': ['']

          })
        ]),
        productImages: this.fb.array([this.fb.group
          ({
            'prodImgBase64': [''],
            'isDefaultImg': [''],
            'prodImgName': [''],
            'prodImgType': ['']

          })
        ])

      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



  get ProductsOrServices() {
    try {
      return this.ProductForm.get('ProductsOrServices') as FormArray;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ProductsOrServices",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AddProductsOrServices() {
    try {

      this.ProductForm.markAsDirty();
      this.ProductsOrServices.push(this.fb.group({
        'productDetailsId': '',
        'type': '1',
        'value': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'from': ['', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
        'to': ['', Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
        'productName': [''],
        //'value': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        //'from': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        //'to': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        //'productName': ['', Validators.required]
        //'createdOn':'',
        'isActive': true
        //'updatedOn':''
      }));

      if (this.ProductsOrServices.length == 10) {

        this.IsAddMore = false;
      }
      else {
        this.IsAddMore = true;
      }

      if (this.ProductsOrServices.length > 1) {

        this.IsDelete = true;
      }
      else {
        this.IsDelete = false;
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "AddProductsOrServices",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  deleteProductsOrServices(index) {
    try {

      this.prod_index = index;

      document.getElementById("delete_product_Modal").click();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "deleteProductsOrServices",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  ConfirmdeleteProduct(flag: boolean) {
    try {
      if (flag) {
        this.ProductForm.markAsDirty();
        this.ProductsOrServices.removeAt(this.prod_index);
        // this.ProductsOrServices.value[this.prod_index].isActive()
        if (this.ProductsOrServices.length == 10) {

          this.IsAddMore = false;
        }
        else {
          this.IsAddMore = true;
        }
      }
      else {

      }

      if (this.ProductsOrServices.length > 1) {

        this.IsDelete = true;
      }
      else {
        this.IsDelete = false;
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "ConfirmdeleteProduct",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetDisabledata() {

    try {
      var single = <HTMLInputElement>document.getElementById("single-r");
      var multiple = <HTMLInputElement>document.getElementById("multiple-r");
      if (this.editdata.typeOf == 2) {
        var slab = <HTMLInputElement>document.getElementById("slab-r");
        var prod = <HTMLInputElement>document.getElementById("prd-r");
      }
      single.disabled = false;
      multiple.disabled = false;
      if (this.editdata.typeOf == 2) {
        slab.disabled = false;
        prod.disabled = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Product List ",
        "method": "GetDisabledata",
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


export class Info {

  businessId?: string;
  productId?: string;
  type?: string;
  name?: string;
  description?: string;
  url?: string;
  productPrice?: string;
  minimumDealValue?: string;
  shareType?: number;
  createdBy?: string;
  typeOf?: number;
  isActive?: boolean;
  isAllowDelete: boolean;
  created: {
    created_By?: string;
    created_On?: string;
  }
  updated: {
    updated_By?: string;
    updated_On?: string;
  }
  productsOrServices: [
    {
      productDetailsId?: string;
      type?: number;
      value?: string;
      from?: string;
      to?: string;
      productName?: string;
      createdOn?: any;
      isActive?: boolean;
      updatedOn?: any

    }
  ];

  productImages: [
    {
      prodImgBase64?: string;
      isDefaultImg?: boolean;
      prodImgName?: string;
      prodImgType?: string;


    }
  ]


}
