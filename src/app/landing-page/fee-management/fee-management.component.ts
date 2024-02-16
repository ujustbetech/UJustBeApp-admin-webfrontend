import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonService } from './../../service/common.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeeManagementService } from './../../service/fee-management.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../manager/response.helper';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router";
import { CustomDateComponent } from "./../../manager/custom-date-component.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-fee-management',
  templateUrl: './fee-management.component.html',
  styleUrls: ['./fee-management.component.css']
})
export class FeeManagementComponent implements OnInit {
  Token: Token;
  userData;
  @ViewChild('feetype') feetype: ElementRef;
  @ViewChild('autocomplete') autocomplete: ElementRef;
  ResponseHelper: ResponseHelper;
  CountryList: any = [];
  IsCashActive: boolean = false;
  IsNetBankingActive: boolean = false;
  IsChequeActive: boolean = false;
  IsUPIActive: boolean = false;
  gridApi;
  gridColumnApi;
  PaymentHistoryList: any = [];
  SubscriptionPaymentHistoryList: any = [];
  // rowData1:any=[];
  IsClientPartner: boolean = false;
  IsPartner: boolean = false;
  IsBasicDetails: boolean = false;
  MentorList: any = [];
  control = new FormControl();
  List: any = [];
  filteredList: Observable<any[]>;
  Selectedfeetype: string;
  PartnerList: any;
  IsMeetingFee: boolean = false;
  PartnerDetails: any = "";
  FeetypeList: any[];
  PaymentDetailsForm: FormGroup;
  DisplayError: boolean = false;
  SelectedUserId: any = '';
  FeeDetails: any = '';
  registerationDate: any = '';
  businessRegisterationDate: any = '';
  renewalDate: any = '';
  mode: any;
  IsSubscriptionFee: boolean = false;
  IsPayMentDetailsshown: boolean = false;
  Id: String = '';
  public maxDate = new Date();
  IsGreaterAmount: boolean = false;
  validMobileNum: boolean = false;
  Partner_User_Id: any;
  Page_From: string;
  isReadOnly: boolean = false;

  private frameworkComponents;
  public modules: any[] = AllCommunityModules;


  PartnerPaymentHistory = [

    { headerName: 'Referal Id', field: 'referralNo' },
    { headerName: 'Amount Earned', field: 'earnedAmt', cellStyle: { 'text-align': 'right' } },
    { headerName: 'Amount Adjusted', field: 'adjustedAmt', cellStyle: { 'text-align': 'right' } },
    {
      headerName: 'Date of Payment', field: 'adjustedDate', suppressSizeToFit: false, minWidth: 130, width: 130, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
  SubscriptionHistory = [

    {
      headerName: 'Membership Start Date', field: 'startDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
      headerName: 'Membership End Date', field: 'endDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    { headerName: 'Mode of Payment', field: 'paymentMode', suppressSizeToFit: false, minWidth: 150, width: 150 },
    {
      headerName: 'Payment Date', field: 'paymentDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    { headerName: 'Amount', field: 'amount', suppressSizeToFit: false, minWidth: 100, width: 100, cellStyle: { 'text-align': 'right' } },
    {
      headerName: 'Transaction Date', field: 'transactionDate' , suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedtransactionDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    // // // { headerName: 'Transaction ID', field: 'transactionID', suppressSizeToFit: false, minWidth: 130, width: 130 },
    { headerName: 'Transaction ID',cellRenderer: this.MySecondCustomCellRendererClass, field: 'transactionID' , suppressSizeToFit: false, minWidth: 130, width: 130 },

  ];


  MeetingHistory = [

    {
      headerName: 'Meeting Start Date', field: 'startDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
      headerName: 'Meeting End Date', field: 'endDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    { headerName: 'Mode of Payment', field: 'paymentMode', suppressSizeToFit: false, minWidth: 150, width: 150 },
    {
      headerName: 'Payment Date', field: 'paymentDate', suppressSizeToFit: false, minWidth: 170, width: 170, cellRenderer: this.AdjustedDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    { headerName: 'Amount', field: 'amount', suppressSizeToFit: false, minWidth: 100, width: 100, cellStyle: { 'text-align': 'right' } },
    {
      headerName: 'Transaction Date', suppressSizeToFit: false, minWidth: 170, width: 170, field: 'transactionDate', cellRenderer: this.AdjustedtransactionDate,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {

          let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
    { headerName: 'Transaction ID',cellRenderer: this.MySecondCustomCellRendererClass, field: 'transactionID' , suppressSizeToFit: false, minWidth: 130, width: 130 },

    // field: 'transactionID'
  ];



  constructor(private router: Router, private localStorage: LocalStorage,
     private notificationservice: NotificationService, private fb: FormBuilder,
      private feeManagementService: FeeManagementService, private commonService: CommonService,
       private loggerService: LoggerService) {
this.isReadOnly=false;
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()

    var data1 = {
      "UserId":   this.userData.UserId,
      "Url": "",
      "screen": "Fee Management ",
      "method": "constructor",
      "message": "Fee Management Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":   this.userData.UserId,
    }
    this.loggerService.Logger(data1)

    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.frameworkComponents = { agDateInput: CustomDateComponent }

    this.ByDefaultData();
  }

  ngOnInit() {

    try {
      this.localStorage.removeItem('Partner_User_Id').subscribe(() => { }, () => { });
      this.GetFeeTypeList(this.Id);
      this.GetCountryCodes();
      this.GetPartnerList();
     
      this.createPaymentdetailsForm();
      this.isReadOnly=false;

      this.filteredList = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
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

  RenderTransactionDate(params) {

    try {
      var val="NA";
      if (params.value !== "" && params.value !== undefined && params.value !== null) {
        if(params.data.SubscriptionPaymentHistoryList.transactionDate!=null && params.data.SubscriptionPaymentHistoryList.transactionDate !="" && params.data.SubscriptionPaymentHistoryList.transactionDate !="undefined" )
         val = params.data.SubscriptionPaymentHistoryList.transactionDate ;
      }

      return val;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "fee management",
        "method": "MySecondCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }
  MySecondCustomCellRendererClass(params) {

    try {
      //alert( params.value);
      var val="NA";
      if (params.value == "" || params.value == undefined || params.value == null) {
     
     //   if(params.data.SubscriptionPaymentHistoryList.transactionID!=null && params.data.SubscriptionPaymentHistoryList.transactionID !="" && params.data.SubscriptionPaymentHistoryList.transactionID !="undefined" )
         val = "NA" ;
      }
      else{
        val = params.value ;
      }

      return val;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "fee management",
        "method": "MySecondCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


    
  }


  ByDefaultData() {
    
    try {
      this.localStorage.getItem('Partner_User_Id').subscribe((Id) => {

        this.SelectedUserId = Id;
        

      });

      this.localStorage.getItem('SubscriptionFrom').subscribe((Page) => {

        this.Page_From = Page;

        if (this.Page_From == 'BusinessDetails') {
          
          this.Selectedfeetype = '5d5a4534339dce0154441aac';
          this.isReadOnly=true;
          this.IsClientPartner = true;
          this.IsPartner = false;
          this.IsSubscriptionFee = true;
          this.IsMeetingFee = false;
          this.IsPayMentDetailsshown = true;

          this.GetPartnerList();
          this.GetUserDetails();

          this.GetFeeTypeList(this.SelectedUserId);
        }
        else {
          this.Selectedfeetype = '5d5a450d339dce0154441aab';
        }


      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "ByDefaultData",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  AdjustedDate(params) {
    
    try {


      if (params.value == null || params.value == '') {
        return '';
      }
      else {
        let adjusteddate = moment(params.value).format('DD/MM/YYYY');
        return adjusteddate;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "AdjustedDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AdjustedtransactionDate(param) {
    try {
      
      if (param.value == null || param.value == '') {
        return 'NA';
      }
      else {
        let adjusteddate = moment(param.value).format('DD/MM/YYYY');
        return adjusteddate;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "AdjustedtransactionDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  OpenBusinessDetails() {
    try {
      this.localStorage.setItem('Partner_User_Id', this.SelectedUserId).subscribe(() => { });
      this.localStorage.setItem('SetCurrentTab', 'business').subscribe(() => { });
      this.router.navigate(['/registration']);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "OpenBusinessDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

    //  this.localStorage.setItem('SubscriptionToBusiness', 'Yes').subscribe(() => { 
    // this.router.navigate(['/registration']);
    //  });


  }


  GetFeeTypeList(id: any) {
    // 
    //   if(this.SelectedUserId){
    //     this.Id = id
    //   }
    // else{
    //   this.Id=
    //   } 
    // let userid =this.SelectedUserId;

    try {
      this.feeManagementService.GetFeeTypes(id).subscribe(data => {

        this.FeetypeList = data.json().feeTypeList;


      }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetFeeTypeList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetFeeStatus() {
    
    try {

      this.feeManagementService.GetFeeStatus(this.SelectedUserId, this.Selectedfeetype).subscribe(data => {
        // this.IsPayMentDetailsshown=true;
        this.FeeDetails = data.json().data;

        this.PaymentHistoryList = this.FeeDetails.feeBreakUp;
        this.SubscriptionPaymentHistoryList = this.FeeDetails.feeBreakUp1;

       // console.log("sdata", this.SubscriptionPaymentHistoryList);


        // this.IsPayMentDetailsshown=true;

      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
        this.FeeDetails = '';
      }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetFeeStatus",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetSelectedUser(user: string) {
    try {
      this.SelectedUserId = '';
      // this.Selectedfeetype='5d5a450d339dce0154441aab';

      let SelectedUser = this.PartnerList.filter(a => a.userName === user);
      this.SelectedUserId = SelectedUser[0].userId;

      this.IsBasicDetails = true;
      this.IsClientPartner = false;
      this.IsPartner = true;
      this.IsSubscriptionFee = false;
      this.IsMeetingFee = false;
      // this.IsPayMentDetailsshown=false;

      this.IsPayMentDetailsshown = true;

      this.GetUserDetails();

      this.GetFeeTypeList(this.SelectedUserId);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetSelectedUser",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }




  }

  GetUserDetails() {
    
    try {
      let userid = this.SelectedUserId;

      this.feeManagementService.GetUserDetails(userid).subscribe(data => {

        this.PartnerDetails = data.json().data;

        this.registerationDate = moment(this.PartnerDetails.registerationDate).format('DD/MM/YYYY');
        this.businessRegisterationDate = moment(this.PartnerDetails.businessRegisterationDate).format('DD/MM/YYYY');

        if (this.PartnerDetails.renewalDate == null || this.PartnerDetails.renewalDate == '') {
          this.renewalDate = '';
        }
        else {
          this.renewalDate = moment(this.PartnerDetails.renewalDate).format('DD/MM/YYYY');
        }


        this.GetFeeStatus();


      },
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetUserDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }


  GetCountryCodes() {
    

    try {
      this.commonService.GetCountryCode().subscribe(data => {
        this.CountryList = data.json().data.countries;
      }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetCountryCodes",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetPaymentFrom(event) {

  }

  GetPartnerList() {
    try {
      

      var obj = new Object();

      obj['searchTerm'] = ' ';

      this.commonService.GetPartnerAndClientPartners(obj)
        .subscribe(data => {

          this.PartnerList = data.json().data;
          
          if (this.Page_From == 'BusinessDetails') {
            let SelectedUser = this.PartnerList.filter(a => a.userId === this.SelectedUserId);
            let user = SelectedUser[0].userName;
            this.autocomplete.nativeElement.value = user;
          }

        //  console.log('part', this.PartnerList);

          for (let i = 0; i < this.PartnerList.length; i++) {

            this.List.push(this.PartnerList[i].userName)
          }
        },

        );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetPartnerList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  SelectedFeeType(event) {

    try {
      this.DisplayError = false;

      this.Selectedfeetype = event.target.value;

      this.IsPayMentDetailsshown = true;

      if (this.Selectedfeetype == '5d5a450d339dce0154441aab') {
        this.IsClientPartner = false;
        this.IsPartner = true;
        this.IsMeetingFee = false;
        this.IsSubscriptionFee = false;
      }

      else if (this.Selectedfeetype == '5d5a4534339dce0154441aac') {
        this.IsClientPartner = true;
        this.IsPartner = false;
        this.IsSubscriptionFee = true;
        this.IsMeetingFee = false;
      }
      else if (this.Selectedfeetype == '5d5a4541339dce0154441aad') {
        this.IsClientPartner = true;
        this.IsPartner = false;
        this.IsMeetingFee = true;
        this.IsSubscriptionFee = false;
      }
      else {
        this.IsClientPartner = false;
        this.IsPartner = false;
        this.IsBasicDetails = false;
        this.IsSubscriptionFee = false;
        this.IsMeetingFee = false;
        this.IsPayMentDetailsshown = false;
      }

      this.GetFeeStatus();
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "SelectedFeeType",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }

  }


  private _filter(value: string): string[] {
    try {

      const filterValue = this._normalizeValue(value);
      return this.List.filter(userName => this._normalizeValue(userName).includes(filterValue));
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "_filter",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  private _normalizeValue(value: string): string {
    try {
      return value.toLowerCase().replace(/\s/g, '');
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "_normalizeValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetPaymentValue(event) {
    try {
      document.getElementById("amount").focus();


      this.mode = event.target.value;
      this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
      this.PaymentDetailsForm.get('referenceNo').setErrors(null);
      this.PaymentDetailsForm.get('chequeNo').setErrors(null);
      this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
      this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
      this.PaymentDetailsForm.get('CashPaidName').setErrors(null);
      this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
      this.PaymentDetailsForm.get('emailId').setErrors(null);

      if (this.mode == '2') {
        
        this.IsCashActive = true;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        // this.PaymentDetailsForm.get('CashPaidName').setValidators([Validators.required]);
        this.PaymentDetailsForm.get('mobileNumber').setValidators([ Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]);
        this.PaymentDetailsForm.get('emailId').setValidators([Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]);

        this.PaymentDetailsForm.get('IFSCCode').clearValidators();
        this.PaymentDetailsForm.get('referenceNo').clearValidators();
        this.PaymentDetailsForm.get('chequeNo').clearValidators();
        this.PaymentDetailsForm.get('accountHolderName').clearValidators();
        this.PaymentDetailsForm.get('TransactionDate').clearValidators();

      }
      else if (this.mode == '3') {
        this.IsCashActive = false;
        this.IsNetBankingActive = true;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('IFSCCode').setValidators([Validators.pattern('^[a-zA-Z]{4}[0][a-zA-Z0-9]{6}$')]);
        this.PaymentDetailsForm.get('referenceNo').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('CashPaidName').clearValidators();
        this.PaymentDetailsForm.get('mobileNumber').clearValidators();
        this.PaymentDetailsForm.get('chequeNo').clearValidators();
        this.PaymentDetailsForm.get('accountHolderName').clearValidators();
        this.PaymentDetailsForm.get('emailId').clearValidators();
        this.PaymentDetailsForm.get('TransactionDate').clearValidators();

      }
      else if (this.mode == '1') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = true;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('chequeNo').setValidators([Validators.required]);
        this.PaymentDetailsForm.get('accountHolderName').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('CashPaidName').clearValidators();
        this.PaymentDetailsForm.get('mobileNumber').clearValidators();
        this.PaymentDetailsForm.get('IFSCCode').clearValidators();
        this.PaymentDetailsForm.get('referenceNo').clearValidators();
        this.PaymentDetailsForm.get('emailId').clearValidators();
        this.PaymentDetailsForm.get('TransactionDate').clearValidators();

      }
      else if (this.mode == '4' || this.mode == '5' || this.mode == '6') {
        
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = true;

        this.PaymentDetailsForm.get('TransactionDate').setValidators([Validators.required]);
        this.PaymentDetailsForm.get('referenceNo').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('CashPaidName').clearValidators();
        this.PaymentDetailsForm.get('mobileNumber').clearValidators();
        this.PaymentDetailsForm.get('IFSCCode').clearValidators();
        this.PaymentDetailsForm.get('emailId').clearValidators();
        this.PaymentDetailsForm.get('chequeNo').clearValidators();
        this.PaymentDetailsForm.get('accountHolderName').clearValidators();


      }
      else if (this.mode == '') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
        this.PaymentDetailsForm.get('referenceNo').setErrors(null);
        this.PaymentDetailsForm.get('chequeNo').setErrors(null);
        this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
        this.PaymentDetailsForm.get('CashPaidName').setErrors(null);
        this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
        this.PaymentDetailsForm.get('emailId').setErrors(null);
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetPaymentValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }



  PaymentDetailsSubmit() {
    try {
      this.commonService.showLoading();
      
      this.DisplayError = true;

      this.PaymentDetailsForm.patchValue({ created_By: this.SelectedUserId });

      this.PaymentDetailsForm.patchValue({ userId: this.SelectedUserId });

      this.PaymentDetailsForm.patchValue({ feeType: this.Selectedfeetype });


      if (this.PaymentDetailsForm.value.TransactionDate) {

        let transactionDate = this.ConvertDateFormat(this.PaymentDetailsForm.value.TransactionDate);

        this.PaymentDetailsForm.value.TransactionDate = transactionDate;
;
      }
      else {

        this.PaymentDetailsForm.value.TransactionDate = '';
      }

      if (this.PaymentDetailsForm.value.PaymentDate) {

        let paymentDate = this.ConvertDateFormat(this.PaymentDetailsForm.value.PaymentDate);

        this.PaymentDetailsForm.value.PaymentDate = paymentDate;
      }

      // if(this.PaymentDetailsForm.value.TransactionDate){

      //   let transactiondate = this.ConvertDateFormat(this.PaymentDetailsForm.value.TransactionDate); 

      //   this.PaymentDetailsForm.value.TransactionDate= transactiondate;
      // }
      

      if (this.PaymentDetailsForm.valid && this.IsGreaterAmount == false && this.validMobileNum == false) {

        this.DisplayError = false;

        this.feeManagementService.SubmitPaymentDetails(this.PaymentDetailsForm.value).subscribe(data => {


          let msg = [{ message: "Payment Details Added Successfully", type: "SUCCESS" }]

          this.notificationservice.ChangeNotification(msg);

          this.ResetForm();

          this.createPaymentdetailsForm();

          this.GetFeeStatus();

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
        const controls = this.PaymentDetailsForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.userData.UserId,
          "Url": "",
          "screen": "Fee Management",
          "method": "PaymentDetailsSubmit",
          "message": "UserData :- " + JSON.stringify(this.PaymentDetailsForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.userData.UserId,
        }
        this.loggerService.Logger(invalidField)
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "PaymentDetailsSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  ResetForm() {

    try {
      this.PaymentDetailsForm.reset();
      this.IsCashActive = false;
      this.IsNetBankingActive = false;
      this.IsChequeActive = false;
      this.IsUPIActive = false;

      this.PaymentDetailsForm.patchValue({ countryId: '+91' });

      this.PaymentDetailsForm.patchValue({ paymentType: '' });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "ResetForm",
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
      this.gridApi.sizeColumnsToFit();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "autoSizeAll",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  GetEnteredAmount(amount: any) {
    try {

      if (amount > this.FeeDetails.balanceAmount) {
        this.IsGreaterAmount = true;
      }
      else {
        this.IsGreaterAmount = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "GetEnteredAmount",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  onGridReady(params) {
    try {
      
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit()
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
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

  CheckUserMobilevalue(mobileNo: any) {
    
    try {
      let countryCode = this.PaymentDetailsForm.value.countryId;
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
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "CheckUserMobilevalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  createPaymentdetailsForm() {
    try {
      this.PaymentDetailsForm = this.fb.group({
        'userId': [''],
        'countryId': ['+91'],
        'mobileNumber': [''],
        'emailId': [''],
        'referralId': [''],
        'paymentType': ['', Validators.required],
        'feeType': [''],
        'feeAmount': ['0'],
        'amount': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'bankName': [''],
        'branchName': [''],
        'IFSCCode': [''],
        'accountHolderName': [''],
        'chequeNo': [''],
        'referenceNo': [''],
   

        'TransactionDate': [''],
        'created_By': [''],
        'PaymentDate': ['', Validators.required],
        'Description': [''],
        'CashPaidName': [''],
        'PaymentTransactionId': [[]]

      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Fee Management ",
        "method": "createPaymentdetailsForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
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
        "screen": "Fee Management ",
        "method": "ConvertDateFormat",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  // ConvertDateFormat(date) {

  //   if (date) {     
  //     return date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate(); 
  //   }

  //   return "NA";
  // }
}
