import { Component, OnInit, Input } from '@angular/core';
import { LeadManagementService } from "./../../service/lead-management.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router";
import { CommonService } from "../../service/common.service"
import { CustomDateComponent } from "./../../manager/custom-date-component.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { ExcelServiceService } from './../../service/excel-service.service';
import * as moment from 'moment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
@Component({
  selector: 'app-referral-tracking',
  templateUrl: './referral-tracking.component.html',
  styleUrls: ['./referral-tracking.component.css']
})

export class ReferralTrackingComponent implements OnInit {
  errormsg: any;
  isDateNan: any;
  Token: Token;
  userData;
  @Input() PartnerId;
  @Input() PartnerRole;
  referredByMeList: any;
  referredBusinessList: any;
  ResponseHelper: ResponseHelper;
  gridApi;
  gridColumnApi;
  referralId;
  rowData: any = [];
  rowData1: any = [];
  rowHeight;
  // private cacheBlockSize;
  private getRowHeight;
  private frameworkComponents;
  private components;
  public modules: any[] = AllCommunityModules;
  exportToBtnDisable: boolean = false;
  cacheBlockSize = 100;
  DealStatusList: any;
  SearchForm: FormGroup;
  Input: any;
  referredExcelList: any;
  columnDefs = [
    { headerName: 'Referral Id', field: 'referralCode', minWidth: 150, width: 150, },
    {
      headerName: 'Referral Given date', field: 'dateCreated', minWidth: 150, width: 150,
      filter: "agDateColumnFilter",

      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let dateAsString = cellValue;
          // let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
      headerName: 'Partner', cellClass: "cell-wrap-text",

      valueGetter: partnerValueGetter,
      filter: "agTextColumnFilter",
      autoHeight: true, cellRenderer: this.MySecondCustomCellRendererClass, field: 'referredByMeList'
    },
    {
      headerName: 'Listed Partner', cellClass: "cell-wrap-text", minWidth: 200, width: 300,
      valueGetter: ListedpartnerValueGetter,
      filter: "agTextColumnFilter",
      autoHeight: true, cellRenderer: this.LPCustomCellRendererClass, field: 'referredByMeList'
    },
    { headerName: 'Referral/Deal Status', field: 'dealStatusValue', },
    { headerName: 'Product/Service Name', field: 'productName' },
    {
      headerName: 'Referral/Deal Status Updated Date', field: 'dealStatusUpdatedOn',
      filter: "agDateColumnFilter",

      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let dateAsString = cellValue;
          // let dateAsString = moment(cellValue).format('DD/MM/YYYY');
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


    // { headerName: 'Referral Rejected Reason',cellClass: "cell-wrap-text",
    //autoHeight: true, field: 'rejectionReason' },
    {
      headerName: 'Referred for (Self/Third Party)', field: 'referredByMeList', cellRenderer: this.SelfName, cellClass: "cell-wrap-text",
      autoHeight: true,
      valueGetter: ThirdpartyValueGetter,
      filter: "agTextColumnFilter"
    },
    {
      headerName: 'Referral Description', autoHeight: true, cellRenderer: this.desciption, tooltip: this.TooltipDescription
      , valueGetter: LeadDesciptionValueGetter, field: 'referredByMeList', filter: "agTextColumnFilter"
    },


  ];



  constructor(private excelserviceService: ExcelServiceService, private notificationservice: NotificationService, private fb: FormBuilder, private leadManagementService: LeadManagementService, private localStorage: LocalStorage, private router: Router, private commonService: CommonService, private loggerService: LoggerService) {

    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.frameworkComponents = { agDateInput: CustomDateComponent, }
    this.components = {
      genderCellRenderer: GenderCellRenderer

    }
    this.cacheBlockSize = 100;
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()


    var data1 = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "referral Tracking Management ",
      "method": "constructor",
      "message": "referral Tracking Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data1)
    // this.getRowHeight = function(params) {

    //   alert("params.data.rowHeight constructor"+ params.data.rowHeight);
    //   if (params.node.level === 0) {
    //     return 40;
    //   } else {
    //     return 25;
    //   }
    // };

    // this.rowHeight = 275;
  }

  ngOnInit() {
    this.DealStatusList = [
      { "Status": "Pending" },
      { "Status": "Rejected" },
      { "Status": "Not Connected" },
      { "Status": "Called But No Response" },
      { "Status": "Deal Lost" },
      { "Status": "Discussion In Progress" },
      { "Status": "Deal Won" },
      { "Status": "Received Part Payment & Transferred to UJustBe" },
      { "Status": "Work in progress" },
      { "Status": "Work completed" },
      { "Status": "Received full and final payment" },
      { "Status": "Agreed Percentage Transferred to UJustBe" },
      { "Status": "On Hold" },
    ]

    this.createSearchForm();
    this.localStorage.getItem('SearchParameter').subscribe((SearchParameter) => {

      this.bindForm(SearchParameter);

    });
    //this.GetReferralList();


  }

  Searchsubmit() {
    this.localStorage.removeItem('SearchParameter').subscribe(() => {
    });

    this.GetReferralList();
  }
  bindForm(SearchParameter: any) {
    if (SearchParameter != null) {
      this.SearchForm.patchValue({ 'Status': SearchParameter.StatusId });
      this.SearchForm.patchValue({ 'FromDate': SearchParameter.FromDate });
      this.SearchForm.patchValue({ 'ToDate': SearchParameter.ToDate });
    }
    this.GetReferralList();
  }


  createSearchForm() {
    this.SearchForm = this.fb.group({
      'FromDate': [''],
      'ToDate': [''],
      'Status': [''],
    });
  }

  PartnerdataexportAsXLSX(): void {
    
    try {
      //this.exportToBtnDisable = true;
      var exportData = [];
      var referralIds = [];
      var count = this.gridApi.getDisplayedRowCount();
      for (var i = 0; i < count; i++) {
        var el = this.gridApi.getDisplayedRowAtIndex(i);
        referralIds.push(el.data.referralId)
      }
      if (referralIds.length > 0) {
        this.GetExcelReferralList(referralIds);
      }

      //  for (var i = 0; i <this.referredExcelList.count; i++) {
      ////    var el = this.gridApi.getDisplayedRowAtIndex(i);
      //    var el = this.referredExcelList[i];
      //    var obj = new Object()

      //    let cdate = moment(el.data.dealStatusUpdatedOn).format('DD/MM/YYYY');


      //    obj['Referral Id'] = el.data.referralCode;
      //    obj['Referral Given date'] = el.data.dateCreated;
      //    obj['Partner Name'] = el.data.referredByDetails.referredByName;
      //    obj['Partner Email'] = el.data.referredByDetails.referredByEmailId;
      //    obj['Partner Mobile number'] = el.data.referredByDetails.referredByCountryCode + " " + el.data.referredByDetails.referredByMobileNo;

      //    obj['Listed Partner Name'] = el.data.clientPartnerDetails.name;
      //    obj['Listed Partner personal  Email'] = el.data.clientPartnerDetails.emailId;
      //    obj['Listed Partner bussiness  Email'] = el.data.clientPartnerDetails.bussEmailId;
      //    obj['Listed Partner  Mobile number'] = el.data.clientPartnerDetails.countryCode + "" + el.data.clientPartnerDetails.mobileNumber;
      //    obj['Referral/Deal Status'] = el.data.dealStatusValue;

      //    obj['Status Updated Date'] = el.data.dealStatusUpdatedOn;
      //    obj['Product/Service Name'] = el.data.productName;
      //    obj['Referral Rejected Reason'] = el.data.rejectionReason;
      //    obj['Referred for (Self/Third Party) Name'] = this.ThirdpartyDetails(el.data, "Name");

      //    obj['Referred for (Self/Third Party) Email'] = this.ThirdpartyDetails(el.data, "Email");
      //    obj['Referred for (Self/Third Party) Mobile number'] = this.ThirdpartyDetails(el.data, "Mobile");
      //    obj['Referral Description'] = el.data.referralDescription;      
      //    exportData.push(obj);
      //  }

      this.referredExcelList.forEach((ele) => {
        var obj = new Object()

        let cdate = moment(ele.dealStatusUpdatedOn).format('DD/MM/YYYY');


        obj['Referral Id'] = ele.referralCode;
        obj['Referral Given date'] = ele.dateCreated;
        obj['Partner Name'] = ele.referredByDetails.referredByName;
        obj['Partner Email'] = ele.referredByDetails.referredByEmailId;
        obj['Partner Mobile number'] = ele.referredByDetails.referredByCountryCode + " " + ele.referredByDetails.referredByMobileNo;
        obj['Partner Mentor Name'] = ele.partnerMentorDetails.name;
        obj['Partner Mentor Email'] = ele.partnerMentorDetails.emailId;
        obj['Partner Mentor Mobile number'] = ele.partnerMentorDetails.countryCode + " " + ele.partnerMentorDetails.mobileNo;
        obj['LP Name'] = ele.clientPartnerDetails.name;
        obj['LP personal  Email'] = ele.clientPartnerDetails.emailId;
        obj['LP bussiness  Email'] = ele.clientPartnerDetails.bussEmailId;
        obj['LP  Mobile number'] = ele.clientPartnerDetails.countryCode + "" + ele.clientPartnerDetails.mobileNumber;
        obj['LP mentor Name '] = ele.lpMentorDetails.name;
        obj['LP mentor Email ID'] = ele.lpMentorDetails.emailId;
        obj['LP Mentor Contact No '] = ele.lpMentorDetails.countryCode + " " + ele.lpMentorDetails.mobileNo;
        obj['Referral/Deal Status'] = ele.dealStatusValue;

        obj['Status Updated Date'] = ele.dealStatusUpdatedOn;
        obj['Product/Service Name'] = ele.productName;
        obj['Referral Rejected Reason'] = ele.rejectionReason;
        obj['Referred for (Self/Third Party) Name'] = this.ThirdpartyDetails(ele, "Name");

        obj['Referred for (Self/Third Party) Email'] = this.ThirdpartyDetails(ele, "Email");
        obj['Referred for (Self/Third Party) Mobile number'] = this.ThirdpartyDetails(ele, "Mobile");
        obj['Referral Description'] = ele.referralDescription;



        obj['Deal value '] = ele.dealValue;
        if (ele.sharedwithUJB == 1) {
          obj['Agreed Percentage/ amount '] = ele.sharedValuewithUJB + " %";
        }
        else {
          obj['Agreed Percentage/ amount '] = ele.sharedValuewithUJB;
        }
        obj['Amount Recieved by lp '] = ele.amount_Recieved_by_lp;
        obj['Payment Date '] = ele.amount_Recieved_by_lp_Payment_Date != null ? moment(ele.amount_Recieved_by_lp_Payment_Date).format('DD/MM/YYYY') : "NA";
        obj['Payment Mode '] = ele.amount_Recieved_by_lp_Payment_Mode;
        obj['Amount Transfered to ujb for this deal'] = ele.amount_Transfered_to_ujb_Amount;
        obj['Amount UJb transfered to partner '] = ele.uJb_transfered_to_partner;
        obj['Partner Payment Date '] = ele.uJb_transfered_to_partner_payment_Date != null ? moment(ele.uJb_transfered_to_partner_payment_Date).format('DD/MM/YYYY') : "NA";
        obj['Partner Payment Mode '] = ele.uJb_transfered_to_partner_payment_mode;
        obj['Amount Ujb transfered to partner mentor '] = ele.amount_Ujb_transfered_to_partner_mentor;
        obj['Partner mentor Payment Date  '] = ele.amount_Ujb_transfered_to_partner_mentor_payment_Date != null ? moment(ele.amount_Ujb_transfered_to_partner_mentor_payment_Date).format('DD/MM/YYYY') : "NA";
        obj['Partner mentor Payment Mode '] = ele.amount_Ujb_transfered_to_partner_mentor_payment_mode;
        obj['Amount ujb transfered to lp mentor  '] = ele.amount_ujb_ransfered_to_lpmentor;
        obj['Lp mentor Payment Date  '] = ele.amount_ujb_ransfered_to_lpmentor_payment_Date != null ? moment(ele.amount_ujb_ransfered_to_lpmentor_payment_Date).format('DD/MM/YYYY') : "NA";
        obj['Lp mentor Payment Mode '] = ele.amount_ujb_ransfered_to_lpmentor_payment_mode;
        obj['Balance remaining with UJB '] = ele.balance_remaining_with_UJB;


        exportData.push(obj);
      })
      this.excelserviceService.exportAsExcelFile(exportData, 'ReferralTracking-Export');
      this.exportToBtnDisable = false;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "PartnerdataexportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ThirdpartyDetails(el, Type) {
    try {
      if (el.isForSelf == true) {
        if (Type == "Name") {
          return el.referredByDetails.referredByName;
        }
        if (Type == "Email") {
          return el.referredByDetails.referredByEmailId;
        }
        if (Type == "Mobile") {
          return el.referredByDetails.referredByCountryCode + " " + el.referredByDetails.referredByMobileNo;
        }
        // return eDiv;
      }
      else {
        if (Type == "Name") {
          return el.referredToDetails.name
        }
        if (Type == "Email") {
          return el.referredToDetails.emailId;
        }
        if (Type == "Mobile") {
          return el.referredToDetails.countryCode + " " + el.referredToDetails.mobileNumber;
        }
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "ThirdpartyDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  LPCustomCellRendererClass(params) {

    try {
      var eDiv = document.createElement('span');
      if (params.value !== "" || params.value !== undefined || params.value !== null) {

        var val = params.data.clientPartnerDetails.name + " <br />Bussiness Email Id : " + params.data.clientPartnerDetails.bussEmailId + " <br />Personal Email Id : " + params.data.clientPartnerDetails.emailId + " <br />" + params.data.clientPartnerDetails.countryCode + " " + params.data.clientPartnerDetails.mobileNumber;
        eDiv.innerHTML = '<div style="padding: 4px;">' + val + '</div>';
      }

      return eDiv;

    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "LPCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }


  TPCustomCellRendererClass(params) {

    try {
      var eDiv = document.createElement('span');
      if (params.value !== "" || params.value !== undefined || params.value !== null) {
        var val = params.data.referredByDetails.referredByName + " <br />";
        if (params.data.referredByDetails.referredByEmailId != null)
          val += params.data.referredByDetails.referredByEmailId + " <br />"
        if (params.data.referredByDetails.referredByMobileNo != null)
          + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo;
        eDiv.innerHTML = '<div style="padding: 4px;">' + val + '</div>';
      }

      return eDiv;

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "TPCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }

  MySecondCustomCellRendererClass(params) {

    try {
      var eDiv = document.createElement('span');
      if (params.value !== "" || params.value !== undefined || params.value !== null) {
        var val = params.data.referredByDetails.referredByName + " <br />" + params.data.referredByDetails.referredByEmailId + " <br />" + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo;
        eDiv.innerHTML = '<div style="padding: 4px;">' + val + '</div>';
      }

      return eDiv;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "MySecondCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


    // if (params.value !== "" || params.value !== undefined || params.value !== null) {
    //     var gender = '<img border="0" width="15" height="10" src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/' + params.value.toLowerCase() + '.png">';
    //     this.eGui.innerHTML = gender + ' ' + params.value;
    // }
    // if(param.data.isKycComplete == true && param.data.isApproved == true){

    //   let val = 'Approve/Reject';
    //   var eDiv = document.createElement('div');
    //   eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid" disabled="" data-toggle="modal" data-target="#myModal" data-action-type2="Approve_Reject">' + val + '</button>';
    //   let eButton = eDiv.querySelectorAll('.btn')[0];    
    //   return eDiv;
    // }
    // else if(param.data.isKycComplete == true){
    //   let val = 'Approve/Reject';
    //   var eDiv = document.createElement('div');
    //   eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid" data-toggle="modal" data-target="#myModal" data-action-type2="Approve_Reject">' + val + '</button>';
    //   let eButton = eDiv.querySelectorAll('.btn')[0];    
    //   return eDiv;

    // }
    // else if(param.data.isKycComplete == false){
    //   let val = 'Approve/Reject';
    //   var eDiv = document.createElement('div');
    //   eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid" disabled="" data-toggle="modal" data-target="#myModal" data-action-type2="Approve_Reject">' + val + '</button>';
    //   let eButton = eDiv.querySelectorAll('.btn')[0];    
    //   return eDiv;
    // }
  }

  SelfName(params) {
    
    try {
      var eDiv = document.createElement('span');
      if (params.value !== "" || params.value !== undefined || params.value !== null) {

        if (params.data.isForSelf == true) {
          var val = params.data.referredByDetails.referredByName + " <br />" + params.data.referredByDetails.referredByEmailId + " <br />" + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo;
          //return params.data.referredByDetails.referredByName
          // return eDiv;
        }
        else {
          var val = params.data.referredToDetails.name + " <br />";
          if (params.data.referredToDetails.emailId != null)
            val += params.data.referredToDetails.emailId + " <br />";
          if (params.data.referredToDetails.mobileNumber != null)
            val += params.data.referredToDetails.countryCode + " " + params.data.referredToDetails.mobileNumber;
          //return params.data.referredToDetails.name
        }

        eDiv.innerHTML = '<div style="padding: 4px;">' + val + '</div>';
      }
      return eDiv;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "SelfName",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  desciption(param) {
    
    try {
      var referralDescription = param.data.referralDescription;
      if (referralDescription.length > 50) {
        return referralDescription.slice(0, 50) + " ....";
      }
      else {
        return referralDescription;
      }

    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "desciption",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  TooltipDescription(param) {
    

    try {
      return param.data.referralDescription
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "TooltipDescription",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    // return eDiv;

  }






  SelfNamereferal(param) {
    
    try {
      if (param.data.isForSelf == true) {

        return param.data.referredByDetails.referredByName
        // return eDiv;
      }
      else {
        return param.data.referredToDetails.name
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "SelfNamereferal",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  checkDateValidation(Datetime) {
    
    if (Datetime != '' && Datetime != null) {
      // regular expression to match required date format
      var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      var regs;
      var valdatetime = moment(Datetime).format("MM/DD/YYYY");
      if (valdatetime != '' && valdatetime != "Invalid date") {

        if (valdatetime.match(re))
          regs = valdatetime.split('/');
        // day value between 1 and 31
        if (regs[1] < 1 || regs[1] > 31) {
          // alert("Invalid value for day: " + regs[1]);
          this.errormsg = "Invalid value for day: " + regs[1]
          this.isDateNan = true;
          return false;
        }
        // month value between 1 and 12
        if (regs[0] < 1 || regs[0] > 12) {
          //alert("Invalid value for month: " + regs[0]);
          this.errormsg = "Invalid value for month: " + regs[0];
          this.isDateNan = true;
          return false;
        }
        // year value between 1902 and 2020
        if (regs[3] < 1900 || regs[3] > (new Date()).getFullYear()) {
          // alert("Invalid value for year: " + regs[3] + " - must be between 1900 and " + (new Date()).getFullYear());
          this.errormsg = "Invalid value for year: " + regs[3] + " - must be between 1900 and " + (new Date()).getFullYear();
          this.isDateNan = true;
          return false;
        }
      } else {
        // alert("Invalid date format: " + valdatetime);
        this.errormsg = "Invalid date format: " + valdatetime
        this.isDateNan = true;
        return false;
      }
      this.isDateNan = false;
      return true;

    }

  }

  GetExcelReferralList(ReferralIdID: any) {
    

    try {

      this.Input = {

        "ReferralIdID": ReferralIdID

      };

      this.leadManagementService.GetReferralTrackingExcel(this.Input).subscribe(
        data => {


          this.referredExcelList = data.json().data.referredList;
        //  console.log("referal", this.referredByMeList);


        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "GetReferralList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }

  GetReferralList() {
    



    // //if (this.SearchForm.value.FirstSearchValue!="" || this.SearchMembers.value.LastSearchValue!="" || this.SearchMembers.value.DOBSearchValue!="") {

    try {
      var FromDate = "";
      var ToDate = "";
      var Status = "";
      if (this.SearchForm.value.FromDate == "" || this.SearchForm.value.FromDate == null) {

        FromDate = null;
      }
      else {
        // this.checkDateValidation(this.SearchForm.value.FromDate)
        FromDate = moment(this.SearchForm.value.FromDate).format("YYYY-MM-DD");
      }
      if (this.SearchForm.value.ToDate == "" || this.SearchForm.value.ToDate == null) {
        ToDate = null;
      }
      else {
        //this.checkDateValidation(this.SearchForm.value.ToDate)
        ToDate = moment(this.SearchForm.value.ToDate).format("YYYY-MM-DD");
      }
      if (this.SearchForm.value.Status == "Select" || this.SearchForm.value.Status == null) {
        Status = null;
      }
      else {

        Status = this.SearchForm.value.Status;
      }
      this.Input = {

        "FromDate": FromDate,//moment(dob).format('YYYY-DD-MMT00:00:00.000Z'),
        "ToDate": ToDate,
        "StatusId": Status

      };

      this.leadManagementService.GetReferralTrackingList(this.Input).subscribe(
        data => {

          // this.leadManagementService.GetReferralTrackingList().subscribe(
          // data => {


          this.referredByMeList = data.json().data.referredList;



          console.log("referal", this.referredByMeList);


        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "GetReferralList",
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
        "screen": "referral-tracking",
        "method": "autoSizeAll",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    // this.gridApi.sizeColumnsToFit();  
  }

  // onColumnResized() {
  //   this.gridApi.resetRowHeights();
  // }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }
  ClearSearchform() {

    //this.PromotionForm.reset();
    this.localStorage.removeItem('SearchParameter').subscribe(() => {
    });

    this.SearchForm.patchValue({ 'Status': "Select" })

    this.SearchForm.patchValue({ 'FromDate': "" })
    this.SearchForm.patchValue({ 'ToDate': "" })
    this.GetReferralList();

  }
  onCellClicked(e) {

    try {
      this.localStorage.removeItem('Businessdata');
      this.localStorage.removeItem('referralId');

      this.referralId = e.data.referralId;

      // this.userId =data.data.userId;
      

      this.localStorage.setItem('referralId', this.referralId).subscribe(() => { });

      this.localStorage.setItem('referralId', this.referralId).subscribe(() => { });
      this.localStorage.setItem('SearchParameter', this.Input).subscribe(() => { });
      this.localStorage.setItem('ActivePage', "ReferralTracking").subscribe(() => { });
      this.router.navigate(['/referral-details']);

      this.router.navigate(['/referral-details']);

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "referral-tracking",
        "method": "init",
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
function GenderCellRenderer() {
}

GenderCellRenderer.prototype.init = function (params) {
  // alert("abc");
  try {
    this.eGui = document.createElement('span');
    if (params.value !== "" || params.value !== undefined || params.value !== null) {

      var val = params.data.referredByDetails.referredByName + " <br />" + params.data.referredByDetails.referredByEmailId + " <br />" + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo;
      //   eDiv.innerHTML = '<div style="padding: 4px;">'  + val + '</div>';
      // var gender = 
      this.eGui.innerHTML = val; //+ ' <br />' + "female";
    }
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "referral-tracking",
      "method": "init",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)
  }
};

GenderCellRenderer.prototype.getGui = function () {
  try {
    return this.eGui;
  } catch (err) {


    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "referral-tracking",
      "method": "getGui",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }
};

function ListedpartnerValueGetter(params) {
  return params.data.clientPartnerDetails.name + " " + params.data.clientPartnerDetails.bussEmailId + " " + params.data.clientPartnerDetails.emailId + " " + params.data.clientPartnerDetails.countryCode + " " + params.data.clientPartnerDetails.mobileNumber;
  //  return params.data.referredByDetails.referredByName +" "+ params.data.referredByDetails.referredByEmailId + " " + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo
}
function partnerValueGetter(params) {
  return params.data.referredByDetails.referredByName + " " + params.data.referredByDetails.referredByEmailId + " " + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo
}
function ThirdpartyValueGetter(params) {
  // return params.data.referredByDetails.referredByName +" "+ params.data.referredByDetails.referredByEmailId + " " + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo
  var val = "";
  if (params.data.isForSelf == true) {
    val = params.data.referredByDetails.referredByName + " " + params.data.referredByDetails.referredByEmailId + " " + params.data.referredByDetails.referredByCountryCode + " " + params.data.referredByDetails.referredByMobileNo;
    //return params.data.referredByDetails.referredByName
    // return eDiv;
  }
  else {
    var val = params.data.referredToDetails.name + " ";
    if (params.data.referredToDetails.emailId != null)
      val += params.data.referredToDetails.emailId + " ";
    if (params.data.referredToDetails.mobileNumber != null)
      val += params.data.referredToDetails.countryCode + " " + params.data.referredToDetails.mobileNumber;
    //return params.data.referredToDetails.name

  }
  return val;
}



function LeadDesciptionValueGetter(params) {
  return params.data.referralDescription;
}
