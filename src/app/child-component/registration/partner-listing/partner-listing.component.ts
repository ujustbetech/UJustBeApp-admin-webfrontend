import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusinessListingService } from './../../../service/business-listing.service';
import { ExcelServiceService } from './../../../service/excel-service.service';
import * as moment from 'moment';
import { AllCommunityModules } from "@ag-grid-community/all-modules";
// import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
// import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import { CustomDateComponent } from "./../../../manager/custom-date-component.component";
import { LoggerService } from 'src/app/service/logger.service';
import { Token } from 'src/app/manager/token';

// import{RejectReasons} from './../../../manager/common';

@Component({
  selector: 'app-partner-listing',
  templateUrl: './partner-listing.component.html',
  styleUrls: ['./partner-listing.component.css'],
  providers: [RegistrationService]
})
export class PartnerListingComponent implements OnInit {
  Token: Token;
  userData;
  ResponseHelper: ResponseHelper;
  rowData: any = [];
  gridApi;
  gridColumnApi;
  gridOptions;
  actionType: string;
  actionType2: string;
  UserId: string;
  editpartner: any = [];
  IsPartner: boolean = false;
  editbusiness: any;
  exportToBtnDisable: boolean = false;
  DisplayError: boolean = false;
  rowClassRules;
  PartnerExcelInfo: any;
  LPartnerExcelInfo: any;

  ProductService_Excel: any;
  SubscriptionDetailsExcel: any;
  GuestExcelInfo: any;
  public modules: any[] = AllCommunityModules;
  private frameworkComponents;
  private defaultColDef;

  columnDefs = [
    { headerName: '', suppressSizeToFit: false, minWidth: 120, width: 120, field: 'rowData', filter: false, cellRenderer: this.MySecondCustomCellRendererClass },
    { headerName: 'UJB Code', field: 'ujbCode', filter: true, width: 200 },
    { headerName: 'First Name', field: 'firstName', filter: true },
    { headerName: 'Last Name', field: 'lastName', filter: true },
    { headerName: 'Mobile Number', field: 'mobileNumber', filter: true },
    { headerName: 'Email Id', field: 'emailId', filter: true },
    { headerName: 'Role', field: 'role', filter: true },
    { headerName: 'Gender', field: 'gender', filter: true },
    {
      headerName: 'Created Date', field: 'created', cellRenderer: this.CreatedDate, suppressSizeToFit: false, minWidth: 160, width: 160,

      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          let cdate = cellValue.created_On.split('T');
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
    // {headerName: 'Add Business', field: 'role', filter: false,cellRenderer: this.MyCustomCellRendererClass },
    {
      headerName: 'Is Active', field: 'isActive', cellRenderer: this.isActiveRenderer, filter: "agTextColumnFilter", filterParams: {
        filterOptions: ["contains", "notContains", "equals", "notEqual", "startsWith", "endsWith"],
        textCustomComparator: function (filter, value, filterText) {
          var filterTextLoweCase = filterText.toLowerCase();
          var valueLowerCase = value.toString().toLowerCase();
          var aliases = {
            yes: 'true',
            no: 'false',
            y: 'true',
            ye: 'true',
            s: 'true',
            n: 'false',
            o: 'false'
          };

          switch (filter) {
            case 'contains':
              return valueLowerCase.indexOf(aliases[filterTextLoweCase]) >= 0;
            case 'notContains':
              return valueLowerCase.indexOf(aliases[filterTextLoweCase]) === -1;
            case 'equals':
              return valueLowerCase === aliases[filterTextLoweCase];
            case 'notEqual':
              return valueLowerCase != aliases[filterTextLoweCase];
            case 'startsWith':
              return valueLowerCase.indexOf(aliases[filterTextLoweCase]) === 0;
            case 'endsWith':
              var index = valueLowerCase.lastIndexOf(aliases[filterTextLoweCase]);
              return index >= 0 && index === (valueLowerCase.length - aliases[filterTextLoweCase].length);
            default:
              return false;
          }
        },
        debounceMs: 20

      }
    }

  ];



  constructor(private loggerService: LoggerService, private excelserviceService: ExcelServiceService,
    private businessListingService: BusinessListingService, private fb: FormBuilder,
    private commonService: CommonService, private router: Router,
    private localStorage: LocalStorage, private notificationservice: NotificationService, private registrationservice: RegistrationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    

    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.frameworkComponents = { agDateInput: CustomDateComponent }

    this.rowClassRules = {

      "kyc-rejected": function (params) {

        return (params.data.isApproved == false && params.data.reasonId != '0' && params.data.role == 'Partner')
          || (params.data.isBusinessApproved == 'Rejected' && params.data.role == 'Listed Partner');
      },

      "kyc-approved": function (params) {

        return (params.data.role == 'Guest' || params.data.isApproved == true && params.data.role == 'Partner') || (params.data.role == 'Listed Partner' && params.data.isBusinessApproved == 'Accepted');
      },

      "kyc-pending": function (params) {

        return (params.data.isApproved == false && params.data.reasonId == '0' && params.data.role == 'Partner')
          || (params.data.isBusinessApproved == 'Pending' && params.data.role == 'Listed Partner');
      },

      "kyc-not-complete": function (params) {

        return (params.data.isKycComplete == false && params.data.role == 'Partner');
      },
      "bank-not-complete": function (params) {

        return (params.data.isKycComplete == true && params.data.isApproved == true && params.data.isBankComplete == false && params.data.role == 'Partner');
      }



    };

    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Listing",
      "method": "constructor",
      "message": "Partner Listing Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }


  isActiveRenderer(param) {
    if (param.value) {
      return 'Yes'
    } else {
      return 'No'
    }
  }

  customF(param) {


    
  }

  ngOnInit() {

    try {
      this.localStorage.clear();

      this.GetUserList();

      this.localStorage.removeItem('Partner_User_Id').subscribe(() => { }, () => { });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
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

  CreatedDate(params) {

    try {
      let cdate = params.value.created_On.split('T');
      let createddate = moment(cdate[0]).format('DD/MM/YYYY');
      return createddate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
        "method": "CreatedDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  dateformat(params) {
    try {
      ;
      let cdate = params.value.created_On.split('T');
      let createddate = moment(cdate[0]).format('DD/MM/YYYY');
      return createddate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
        "method": "dateformat",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  PartnerdataexportAsXLSX(): void {
    try {
      ;
      //  this.exportToBtnDisable = true;
      var GuestexportData = [];
      var partnerexportData = [];
      var LPpartnerexportData = [];
      var ProductexportData = [];
      var SubscriptionexportData = [];
      this.registrationservice.AllUserDetails("")
        .subscribe(
          data => {
            let res = data.json();
            this.GuestExcelInfo = res.data.userExcelInfo.filter(x => x.role == "Guest");
            this.PartnerExcelInfo = res.data.userExcelInfo.filter(x => x.role == "Partner");
            this.LPartnerExcelInfo = res.data.userExcelInfo.filter(x => x.role == "Listed Partner");
            this.ProductService_Excel = res.data._productService_Excel;
            this.SubscriptionDetailsExcel = res.data._subscriptionDetailsExcel;
            var count = this.gridApi.getDisplayedRowCount();

            for (var i = 0; i < count; i++) {
              var el = this.gridApi.getDisplayedRowAtIndex(i);
              var partnerinfo = [];
              var LPartnerInfo = [];
              var ProductServiceInfo = [];
              var SubscriptionInfo = [];
              var Guestinfo = this.GuestExcelInfo;
              var totalpaidAmt = 0;
              if (el.data.ujbCode != "" && el.data.ujbCode != null) {
                partnerinfo = this.PartnerExcelInfo.filter(x => x.myMentorCode == el.data.ujbCode);
                LPartnerInfo = this.LPartnerExcelInfo.filter(x => x.myMentorCode == el.data.ujbCode);
                ProductServiceInfo = this.ProductService_Excel.filter(x => x.ujbCode == el.data.ujbCode);
                SubscriptionInfo = this.SubscriptionDetailsExcel.filter(x => x.ujbCode == el.data.ujbCode);

              }

              //} else {
              //  var Guestinfo = this.GuestExcelInfo.filter(x => x.mobileNumber == el.data.mobileNumber);
              //}

              //partnerinfo.forEach(partnerinfo)
              //{
              for (var j = 0; j < partnerinfo.length; j++) {
                var Partnerobj = new Object();

                let cdate = moment(partnerinfo[j].createdOn.split("T")[0]).format('DD/MM/YYYY');
                let bdate = moment(partnerinfo[j].birthDate.split("T")[0]).format('DD/MM/YYYY');
                let Padate = moment(partnerinfo[j].partnerAgreementAcceptedDate.split("T")[0]).format('DD/MM/YYYY');
                let partnerAdate = moment(partnerinfo[j].kyvApproveOn.split("T")[0]).format('DD/MM/YYYY');
                //  let Padate = moment(partnerinfo[j].partnerAgreementAcceptedDate).format('DD/MM/YYYY');
                Partnerobj['UJB Code'] = partnerinfo[j].myMentorCode;
                Partnerobj['First Name'] = partnerinfo[j].firstName;
                Partnerobj['Last Name'] = partnerinfo[j].lastName;
                Partnerobj['Mobile Number'] = partnerinfo[j].mobileNumber;
                Partnerobj['Alternate Contact Number'] = partnerinfo[j].alternateMobileNumber != null ? partnerinfo[j].alternateMobileNumber : "";
                Partnerobj['Email Id'] = partnerinfo[j].emailId;
                Partnerobj['Role'] = partnerinfo[j].role;
                Partnerobj['Gender'] = partnerinfo[j].gender;
                Partnerobj['Birth Date'] = bdate;
                Partnerobj['IsApproved'] = partnerinfo[j].isApporved;
                Partnerobj['IsActive'] = partnerinfo[j].active;
                Partnerobj['Created Date'] = cdate;
                Partnerobj['Partner Registration Date'] = cdate;
                if (partnerAdate == '01/01/0001') {
                  Partnerobj['Partner Approval Date'] = "NA";
                }
                else {
                  Partnerobj['Partner Approval Date'] = partnerAdate;
                }
                //  Partnerobj['Partner Approval Date'] = partnerAdate;
                Partnerobj['Mentor Name'] = partnerinfo[j].mentorName;
                Partnerobj['Mentor UJB Code'] = partnerinfo[j].mentorCode;
                Partnerobj['Location'] = partnerinfo[j].address.location;
                Partnerobj['Flat Wing'] = partnerinfo[j].address.flatWing;
                Partnerobj['Locality'] = partnerinfo[j].address.locality;
                Partnerobj['State'] = partnerinfo[j].stateName;
                Partnerobj['Country'] = partnerinfo[j].countryName;
                Partnerobj['isPartnerAgreementAccepted'] = partnerinfo[j].isPartnerAgreementAccepted;

                if (Padate == '01/01/0001') {
                  Partnerobj['Partner Agreement Accepted Date '] = "NA";
                }
                else {
                  Partnerobj['Partner Agreement Accepted Date '] = Padate;
                }
                //  Partnerobj['Partner Agreement Accepted Date '] = Padate;
                Partnerobj['Hobbies'] = partnerinfo[j].hobbies;
                Partnerobj['Can impart Training'] = partnerinfo[j].can_impart_Training;
                Partnerobj['Passive Income'] = partnerinfo[j].passiveIncome;
                Partnerobj['Active/Inactive Comment'] = partnerinfo[j].isActiveComment;
                partnerexportData.push(Partnerobj);
              }

              //LPartnerInfo.forEach(partnerinfo)
              for (var j = 0; j < LPartnerInfo.length; j++) {
                var Partnerobj = new Object();
                let cdate = moment(LPartnerInfo[j].createdOn.split("T")[0]).format('DD/MM/YYYY');
                let bdate = moment(LPartnerInfo[j].birthDate.split("T")[0]).format('DD/MM/YYYY');
                let Padate = moment(LPartnerInfo[j].partnerAgreementAcceptedDate.split("T")[0]).format('DD/MM/YYYY');
                let partnerAdate = moment(LPartnerInfo[j].kyvApproveOn.split("T")[0]).format('DD/MM/YYYY');
                let BussinessRegisterdate = moment(LPartnerInfo[j].businessRegisterationDate.split("T")[0]).format('DD/MM/YYYY');
                let MembershipAcceptdate = moment(LPartnerInfo[j].membershipAgreementAcceptedDate.split("T")[0]).format('DD/MM/YYYY');
                let BussinessApproveddate = moment(LPartnerInfo[j].bsnsApproveOn.split("T")[0]).format('DD/MM/YYYY');

                Partnerobj['UJB Code'] = LPartnerInfo[j].myMentorCode;
                Partnerobj['First Name'] = LPartnerInfo[j].firstName;
                Partnerobj['Last Name'] = LPartnerInfo[j].lastName;
                Partnerobj['Mobile Number'] = LPartnerInfo[j].mobileNumber;
                Partnerobj['Alternate Contact Number'] = LPartnerInfo[j].alternateMobileNumber != null ? LPartnerInfo[j].alternateMobileNumber : "";
                Partnerobj['Email Id'] = LPartnerInfo[j].emailId;
                Partnerobj['Role'] = LPartnerInfo[j].role;
                Partnerobj['Gender'] = LPartnerInfo[j].gender;
                Partnerobj['Birth Date'] = bdate;
                Partnerobj['IsApproved'] = LPartnerInfo[j].isApporved;
                Partnerobj['IsActive'] = LPartnerInfo[j].active;
                Partnerobj['Created Date'] = cdate;
                Partnerobj['Partner Registration Date'] = cdate;
                if (partnerAdate == '01/01/0001') { Partnerobj['Partner Approval Date'] = 'NA' }
                else {
                  Partnerobj['Partner Approval Date'] = partnerAdate;
                }
                Partnerobj['Mentor Name'] = LPartnerInfo[j].mentorName;
                Partnerobj['Mentor UJB Code'] = LPartnerInfo[j].mentorCode;
                Partnerobj['Location'] = LPartnerInfo[j].address.location;
                Partnerobj['Flat Wing'] = LPartnerInfo[j].address.flatWing;
                Partnerobj['Locality'] = LPartnerInfo[j].address.locality;
                Partnerobj['State'] = LPartnerInfo[j].stateName;
                Partnerobj['Country'] = LPartnerInfo[j].countryName;
                Partnerobj['isPartnerAgreementAccepted'] = LPartnerInfo[j].isPartnerAgreementAccepted;
                if (Padate == '01/01/0001') { Partnerobj['Partner Agreement Accepted Date '] = 'NA' }
                else {
                  Partnerobj['Partner Agreement Accepted Date '] = Padate;
                }

                //  Partnerobj['Partner Agreement Accepted Date '] = Padate;
                Partnerobj['Hobbies'] = LPartnerInfo[j].hobbies;
                Partnerobj['Can impart Training'] = LPartnerInfo[j].can_impart_Training;
                Partnerobj['Passive Income'] = LPartnerInfo[j].passiveIncome;
                Partnerobj['Active/Inactive Comment'] = LPartnerInfo[j].isActiveComment;
                if (BussinessRegisterdate == '01/01/0001') { Partnerobj['Business Registration Date'] = 'NA'; }
                else {
                  Partnerobj['Business Registration Date'] = BussinessRegisterdate;
                }
                // Partnerobj['Business Registration Date'] = BussinessRegisterdate;
                Partnerobj['Business Approved'] = LPartnerInfo[j].bsnsIsApproved;

                if (BussinessApproveddate == '01/01/0001') { Partnerobj['Business Approved Date'] = 'NA'; }
                else {
                  Partnerobj['Business Approved Date'] = BussinessApproveddate;
                }
                // Partnerobj['Business Approved Date'] = BussinessApproveddate;

                Partnerobj['Category 1'] = LPartnerInfo[j].categories1;
                Partnerobj['Category 2'] = LPartnerInfo[j].categories2;
                Partnerobj['Company Name'] = LPartnerInfo[j].companyName;
                Partnerobj['Business Email ID'] = LPartnerInfo[j].businessEmail;
                Partnerobj['Business Rating'] = LPartnerInfo[j].averageRating;
                Partnerobj['Business - Location'] = LPartnerInfo[j].location;
                Partnerobj['Business - Flat Wing'] = LPartnerInfo[j].flat_Wing;
                Partnerobj['Business - Locality'] = LPartnerInfo[j].locality;
                Partnerobj['isMembershipAgreementAccepted	'] = LPartnerInfo[j].isMembershipAgreementAccepted;
                if (MembershipAcceptdate == '01/01/0001') { Partnerobj['Membership Agreement Accepted Date '] = 'NA'; }
                else {
                  Partnerobj['Membership Agreement Accepted Date '] = MembershipAcceptdate;
                }

                // Partnerobj['Membership Agreement Accepted Date '] = MembershipAcceptdate;

                Partnerobj['Business Description'] = LPartnerInfo[j].businessDescription;
                Partnerobj['Business Type'] = LPartnerInfo[j].userType;
                Partnerobj['Product / Service / Both'] = LPartnerInfo[j].prodserve;


                LPpartnerexportData.push(Partnerobj);
              }

              //ProductServiceInfo.forEach(partnerinfo)
              ;
              for (var j = 0; j < ProductServiceInfo.length; j++) {
                var Partnerobj = new Object();

                Partnerobj['UJB Code'] = ProductServiceInfo[j].ujbCode;
                Partnerobj['First Name'] = ProductServiceInfo[j].firstName;
                Partnerobj['Last Name'] = ProductServiceInfo[j].lastName;
                Partnerobj['Product / Service'] = ProductServiceInfo[j].type;
                Partnerobj['Name'] = ProductServiceInfo[j].name;
                Partnerobj['Minimum Deal Value '] = ProductServiceInfo[j].minimumDealValue;

                Partnerobj['Single/Multiple'] = ProductServiceInfo[j].singlemultiple;
                Partnerobj['Slab/Product'] = ProductServiceInfo[j].shareType;

                Partnerobj['From'] = ProductServiceInfo[j].from;
                Partnerobj['To'] = ProductServiceInfo[j].to;
                Partnerobj['Sub Product Name'] = ProductServiceInfo[j].productName;
                Partnerobj[' Referral Percent/ Amount'] = ProductServiceInfo[j].value;
                Partnerobj['Percent/ Amount'] = ProductServiceInfo[j].percAmt;



                ProductexportData.push(Partnerobj);
              }

              //  SubscriptionInfo.forEach(partnerinfo)
              for (var j = 0; j < SubscriptionInfo.length; j++) {
                var Partnerobj = new Object();

                let renewalDate = moment(SubscriptionInfo[j].renewalDate).format('DD/MM/YYYY');
                let startDate = moment(SubscriptionInfo[j].startDate).format('DD/MM/YYYY');
                let endDate = moment(SubscriptionInfo[j].endDate).format('DD/MM/YYYY');
                let paymentDate = moment(SubscriptionInfo[j].paymentDate).format('DD/MM/YYYY');
                let BussinessRegisterdate = moment(SubscriptionInfo[j].businessRegisterationDate).format('DD/MM/YYYY');
                let MembershipAcceptdate = moment(SubscriptionInfo[j].membershipAgreementAcceptedDate).format('DD/MM/YYYY');
                totalpaidAmt = totalpaidAmt + SubscriptionInfo[j].amount;
                Partnerobj['UJB Code'] = SubscriptionInfo[j].ujbCode;
                Partnerobj['First Name'] = SubscriptionInfo[j].firstName;
                Partnerobj['Last Name'] = SubscriptionInfo[j].lastName;
                if (BussinessRegisterdate == '01/01/0001' || SubscriptionInfo[j].businessRegisterationDate==null) {
                  Partnerobj['Business Registration Date'] = "NA";
                }
                else {
                  Partnerobj['Business Registration Date'] = BussinessRegisterdate;
                }

                // Partnerobj['Business Registration Date'] = BussinessRegisterdate;
                if (startDate == '01/01/0001' || SubscriptionInfo[j].startDate == null) {
                  Partnerobj['Membership Start Date'] = "NA";
                }
                else {
                  Partnerobj['Membership Start Date'] = startDate;
                }
                // Partnerobj['Membership Start Date'] = startDate;
                if (endDate == '01/01/0001' || SubscriptionInfo[j].endDate == null) {
                  Partnerobj['Membership End Date'] = "NA";
                }
                else {
                  Partnerobj['Membership End Date'] = endDate;
                }
                //Partnerobj['Membership End Date '] = endDate;
                if (renewalDate == '01/01/0001' || SubscriptionInfo[j].renewalDate == null) {
                  Partnerobj['Renewal Date'] = "NA";
                }
                else {
                  Partnerobj['Renewal Date'] = renewalDate;
                }
                // Partnerobj['Renewal Date'] = renewalDate;
                if (paymentDate == '01/01/0001' || SubscriptionInfo[j].paymentDate == null) {
                  Partnerobj['Subscription Payment Date'] = "NA";
                }
                else {
                  Partnerobj['Subscription Payment Date'] = paymentDate;
                }
                // Partnerobj['Subscription Payment Date'] = paymentDate;
                Partnerobj['Subscription Payment Mode'] = SubscriptionInfo[j].paymentMode;
                Partnerobj['paid membership amount'] = SubscriptionInfo[j].amount;
                Partnerobj['balance membership amount'] = SubscriptionInfo[j].feeAmount - totalpaidAmt;
                SubscriptionexportData.push(Partnerobj);
              }
            }


            for (var j = 0; j < Guestinfo.length; j++) {
              var Partnerobj = new Object();
              let cdate = moment(Guestinfo[j].createdOn).format('DD/MM/YYYY');

              Partnerobj['First Name'] = Guestinfo[j].firstName;
              Partnerobj['Last Name'] = Guestinfo[j].lastName;
              Partnerobj['Mobile Number'] = Guestinfo[j].mobileNumber;
              Partnerobj['Alternate Contact Number'] = Guestinfo[j].alternateMobileNumber != null ? Guestinfo[j].alternateMobileNumber : "";
              Partnerobj['Email Id'] = Guestinfo[j].emailId;
              Partnerobj['Role'] = Guestinfo[j].role;
              if (Guestinfo[j].isActive) {
                Partnerobj['IsActive'] = "Active";
              }
              else {
                Partnerobj['IsActive'] = "InActive";
              }
              Partnerobj['Created Date'] = cdate;
              Partnerobj['Active/Inactive Comment'] = Guestinfo[j].isActiveComment;

              GuestexportData.push(Partnerobj);


            }


            this.excelserviceService.exportAsExcelFilewithMultiple(partnerexportData, LPpartnerexportData, ProductexportData, SubscriptionexportData, GuestexportData, 'Enrollment-Export');
            this.exportToBtnDisable = false;
          }
        );



    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
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


  MyCustomCellRendererClass(param) {
    try {

      if (param.value == 'Partner') {

        let val = 'Add Business';
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid"   data-action-type="Add_Business">' + val + '</button>';
        let eButton = eDiv.querySelectorAll('.btn')[0];
        return eDiv;
      }
      else {
        let val = 'Add Business';
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid"  disabled=""  data-action-type="Add_Business">' + val + '</button>';
        let eButton = eDiv.querySelectorAll('.btn')[0];
        return eDiv;
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
        "method": "MyCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  MySecondCustomCellRendererClass(param) {
    try {
      if (param.data.role == 'Partner' && param.data.isApproved == true) {
        let val = 'List Business';
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid" style="width: 94px; padding-left: 15px" data-action-type2="List_Your_Business">' + val + '</button>';
        let eButton = eDiv.querySelectorAll('.btn')[0];
        return eDiv;
      }
      else if (param.data.role == 'Partner') {
        let val = 'List Business';
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid"  style="width: 94px; padding-left: 15px"  disabled="" data-action-type2="List_Your_Business">' + val + '</button>';
        let eButton = eDiv.querySelectorAll('.btn')[0];
        return eDiv;
      }
      else if (param.data.role == 'Guest') {
        let val = 'Add as Partner';
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<button class="btn btn-primary btn-xs btn-grid" data-action-type2="Become_member">' + val + '</button>';
        let eButton = eDiv.querySelectorAll('.btn')[0];
        return eDiv;
      }


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
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
        "method": "MySecondCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  onCellClicked(data) {
    try {
      ;
      this.localStorage.removeItem('Partner_User_Id');
      this.localStorage.removeItem('AddEdit');
      this.localStorage.removeItem('AddEditBusiness');
      this.localStorage.setItem('SetCurrentTab', 'basic').subscribe(() => { });
      this.localStorage.removeItem('BecomeMember').subscribe(() => { });
      this.localStorage.setItem('AddEdit', 'Edit').subscribe(() => { });
      // this.localStorage.removeItem('AddEdit');
      // this.commonService.changeData(""); 
      this.UserId = data.data._id;
      // this.commonService.currentData.subscribe((data) => {
      //   console.log(data);     

      // }, err => {
      //   this.ResponseHelper.GetFaliureResponse(err)
      // });

      this.localStorage.setItem('Partner_User_Id', this.UserId).subscribe(() => { });

      this.localStorage.setItem('NewPartner', 'false').subscribe(() => { });
      this.localStorage.removeItem('Businessdata');

      this.localStorage.setItem('AddEditBusiness', 'Edit').subscribe(() => { });
      this.localStorage.setItem('RefreshPage', 'true').subscribe(() => { });

      this.actionType = data.event.target.getAttribute("data-action-type")

      this.actionType2 = data.event.target.getAttribute("data-action-type2")

      if (data.colDef.headerName == "" && this.actionType2 == "List_Your_Business") {

        this.localStorage.setItem('AddEditBusiness', 'Add').subscribe(() => { });
        this.localStorage.setItem('SetCurrentTab', 'business').subscribe(() => { });
        this.router.navigate(['/registration']);

      }


      else if (data.colDef.headerName == "" && this.actionType2 == "Become_member") {
        this.localStorage.setItem('BecomeMember', 'BecomeMember').subscribe(() => { });
        this.localStorage.setItem('SetCurrentTab', 'questionnaire').subscribe(() => { });
        this.router.navigate(['/registration']);

      }

      else {
        let UserDetails =
        {
          _id: data.data._id,
          Role: data.data.role,
          isKYCComplete: data.data.isApproved,
        }
        this.editpartner = UserDetails;
        console.log("userdeatils", this.editpartner);
        this.commonService.changeData(this.editpartner);
        this.localStorage.removeItem('BecomeMember').subscribe(() => { });
        this.router.navigate(['/registration']);

        // this.registrationservice.GetUserDetails(this.UserId).subscribe((data) => {

        //   let response = data.json();

        //   this.editpartner=response.data;
        //   console.log("userdeatils",this.editpartner);
        //   this.commonService.changeData(this.editpartner);  
        //   this.ResponseHelper.GetSuccessResponse(data)
        //   this.router.navigate(['/registration']);


        // }, err => {
        //   this.ResponseHelper.GetFaliureResponse(err)
        // });
      }

    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
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




  GetUserList() {
    try {
      ;
      this.commonService.hideLoading();
      this.registrationservice.UserList("")
        .subscribe(
          data => {
            let res = data.json();
            this.rowData = res.data.partnersList;
            console.log("a", this.rowData);
            this.commonService.hideLoading();
          }, err => {

          }
        );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
        "method": "GetUserList",
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
        "screen": "Partner Listing",
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


  onGridReady(params) {
    try {
      
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.sizeColumnsToFit();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Listing",
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


}
