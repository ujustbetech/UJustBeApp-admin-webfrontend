import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { LeadManagementService } from "./../../../service/lead-management.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from "@angular/router";
import { BusinessListingService } from './../../../service/business-listing.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeeManagementService } from './../../../service/fee-management.service';
import { CommonService } from 'src/app/service/common.service';
import { Token } from './../../../manager/token';
import * as moment from 'moment';
import { CustomDateComponent } from "./../../../manager/custom-date-component.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { LoggerService } from 'src/app/service/logger.service';
import { Subscription, Observable, timer } from 'rxjs';


@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.css']
})
export class ReferralDetailsComponent implements OnInit {
  Token: Token;
  userData;
  @Input() PartnerId;
  LeadDetails: any = '';
  StatusHistory: any = '';
  ResponseHelper: ResponseHelper;
  gridApi;
  gridColumnApi;
  referralId;
  ProductServiceDetails: any;
  IsCashActive: boolean = false;
  IsNetBankingActive: boolean = false;
  IsChequeActive: boolean = false;
  IsClinetPartner: boolean = false;
  IsUJB: boolean = false;
  PaymentDetailsForm: FormGroup;
  DisplayError: boolean = false;
  CurrentDate: any;
  LeadId: any;
  DisplayAmount: any = 0;
  selectedproductdata: any;
  EnteredDealValue: number=0;
  IsProductDropActive: boolean = true;
  DealValueForm: FormGroup;
  productType: number;
  productValue: any;
  ProductdetailsId: string;
  IsPercentage: boolean = false;
  CountryList: any[];
  DisplayError1: boolean = false;
  // @ViewChild('paymentclosemodal') paymentclosemodal: ElementRef;
  @ViewChild('Dealvalueclosemodal') Dealvalueclosemodal: ElementRef;
  @ViewChild('paymentOpenmodal') paymentOpenmodal: ElementRef;
  // @ViewChild('dealvalue') dealvalue:ElementRef;  
  PaymentList: any;
  UserId: string;
  DealStatusForm: FormGroup;
  DealStatusList: any[];
  IsUpdateStatusActive: boolean = false;
  IsUPIActive: boolean = false;
  IsUJBflag: boolean;
  AmountDetails: any = '';
  Paymentto: string;
  Paymentfrom: string;
  clientPartnerDetails: any = '';
  referredByDetails: any = '';
  shareReceivedByPartner: any = '';
  mentorDetails: any = '';
  lpMentorDetails: any = '';
  shareReceivedByUJB: any = '';
  payType: any;
  PaymentTransactionId: any = [];
  referredToDetails: any = '';
  DealValueActive: boolean = false;
  public maxDate = new Date();
  IsPaymentBlock: boolean;
  currentStatusActive: boolean = false;
  AllowUJb: boolean = false;
  balanceRegisterationAmt: any = 0;
  balanceRegisterationAmtdetails: any = 0;
  amtRecvdFrmPramotion: any = 0.0;
  pendingAmt: any = 0;
  prdservDetails: any;
  Ismentor: any;
  Display_Amount: any = 0;
  PaymentData: any = '';
  adjustregisrattionfee: boolean = false;
  Productdropdisabled: boolean = false;
  validMobileNum: boolean = false;
  private frameworkComponents;
  public modules: any[] = AllCommunityModules;
  IsPaymentChange: boolean = false;
  FinalDealList: any = '';
  IsDealstatsShow: boolean = true;
  prmintamt: any = 0.0;
  Shared_percentage: any = 0;
  ActivePage: string = "partner_referal";
  sharedwith: Array<sharedWIth> = [];
  promotion: boolean = false;
  PaymenttoID: number = 0;
  dealvalueinvalid: boolean = false;
  checkCurrentstatus: boolean = false;
  private subscription: Subscription;
  IsvalidDealvalue:boolean=false;
  IsSelectedProduct:boolean=false;
  
  everySecond: Observable<number> = timer(0, 1000);

  columnDefs = [

    {
      headerName: 'Status changed Date', field: 'date', cellRenderer: this.StatusHistoryDate,

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
    { headerName: 'status', field: 'status' },


  ];


  paymentColumnDefs = [
    { headerName: 'Transaction ID', field: 'paymentTransactionId' },
    { headerName: 'payment From', field: 'paymentFromValue' },
    { headerName: 'payment To', field: 'paymentToValue' },
    {
      headerName: 'Payment Date', field: 'paymentDate', cellRenderer: this.PaymentDate,

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
    { headerName: 'Mode of Payment', field: 'paymentTypeValue' },
    {
      headerName: 'Actual Amount as per agreed share', valueGetter: function (params) {
        return params.data.amount + params.data.registerationAmt;
      }, width: 250
    },
    { headerName: 'Paid Amount as per agreed share', field: 'amount', width: 250 },
    { headerName: 'Adjusted Registration Fee', field: 'registerationAmt' },

    { headerName: 'Incentive Amount', field: 'amtRecvdFrmPramotion' },
    {
      headerName: 'Total Paid', valueGetter: function (params) {
        return params.data.amount + params.data.amtRecvdFrmPramotion;
      }
    },


  ];

  constructor(private _location: Location, private feeManagementService: FeeManagementService, private commonService: CommonService, private fb: FormBuilder, private notificationservice: NotificationService, private leadManagementService: LeadManagementService, private localStorage: LocalStorage, private router: Router, private r: ActivatedRoute, private businessListingService: BusinessListingService, private loggerService: LoggerService) {
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.frameworkComponents = { agDateInput: CustomDateComponent }

    this.Token = new Token(this.router);
    var data = this.Token.GetUserData();
    this.UserId = data.UserId;

    var data1 = {
      "UserId": this.UserId,
      "Url": "",
      "screen": "Referral Details",
      "method": "constructor",
      "message": "Referral Details Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.UserId,
    }
    this.loggerService.Logger(data1)


  }
  ngOnInit() {
    
    try {
      this.localStorage.getItem('ActivePage').subscribe((activePage) => {
        this.ActivePage = activePage;
      });


      this.createPaymentdetailsForm();

      this.createDealValueForm();

      this.createDealStatusForm();

      this.GetCountryCodes();

      this.localStorage.getItem('referralId').subscribe((referralId) => {

        this.LeadId = referralId;

       // console.log('id', this.LeadId);

        this.GetReferralDetails();
        this.PaymentDetailsList();

      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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

  PaymentDate(params) {
    try {

      let sdate = moment(params.value).format('DD/MM/YYYY');
      return sdate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "PaymentDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  StatusHistoryDate(params) {
    
    try {

      let d = moment.utc(params.value).format("DD/MM/YYYY HH:mm")


      let sdate = d;
      return sdate;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "StatusHistoryDate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetReferralDetails() {
    
    try {

      this.leadManagementService.GetReferralDetails(this.LeadId).subscribe(
        data => {

          this.LeadDetails = data.json().data;
          this.clientPartnerDetails = this.LeadDetails.clientPartnerDetails;
          this.referredByDetails = this.LeadDetails.referredByDetails;
          this.shareReceivedByPartner = this.LeadDetails.shareReceivedByPartner;
          this.lpMentorDetails = this.LeadDetails.lpMentorDetails;
          // console.log('ref', this.referredByDetails);
          // console.log('sha', this.shareReceivedByPartner);

          this.mentorDetails = this.LeadDetails.mentorDetails;
        //  console.log('md', this.mentorDetails);
          this.shareReceivedByUJB = this.LeadDetails.shareReceivedByUJB;
          if (this.shareReceivedByUJB.percOrAmount == 1) {
            this.IsPercentage = true;
            this.productValue = this.shareReceivedByUJB.value;
            this.DisplayAmount = this.LeadDetails.dealValue * (this.productValue / 100)

          }
          else {
            this.IsPercentage = false;
            this.DisplayAmount = this.shareReceivedByUJB.value;
          }
          this.productValue = this.shareReceivedByUJB.value;


          //this.subscription = this.everySecond.subscribe((seconds) => {


          //})

          setTimeout(() => {
            this.DealValueForm.patchValue({ "ProductId": this.LeadDetails.refMultisSlabProdId });
            this.ProductdetailsId = this.LeadDetails.refMultisSlabProdId;
            this.GetSelected_Product(this.LeadDetails.refMultisSlabProdId);
          }, 500);

          this.referredToDetails = this.LeadDetails.referredToDetails;
          this.DealValueForm.patchValue({ dealValue: this.LeadDetails.dealValue });


          if (this.LeadDetails.dealValue > 0) {
            this.IsPaymentBlock = true;
          }
          else {
            this.IsPaymentBlock = false;
          }

          this.GetDealStatusList();

         // console.log("lead", this.LeadDetails)


          if (this.LeadDetails.referralStatusValue == 'Accepted') {
            this.DealValueActive = true;
            this.IsUpdateStatusActive = true;
            this.currentStatusActive = false;
          }
          else if (this.LeadDetails.referralStatusValue == 'Pending') {
            this.IsUpdateStatusActive = false;
            this.DealValueActive = false;
            this.currentStatusActive = false;
          }
          else {
            this.DealValueActive = false;
            this.IsUpdateStatusActive = false;
            this.currentStatusActive = false;
          }
          // if(this.LeadDetails.dealStatus>4)
          // {
          //   this.DealValueActive=true;
          // }

          if (this.LeadDetails.dealStatus < 5) {
            this.DealValueActive = false;
          }
          else {
            this.DealValueActive = true;
          }
 if (this.LeadDetails.dealValue > 0 && this.LeadDetails.dealValue!=null)
 {
          if (this.LeadDetails.dealStatus == 6 || this.LeadDetails.dealStatus == 9 || this.LeadDetails.dealStatus == 10 || this.LeadDetails.dealStatus == 11) {
            this.currentStatusActive = true;
          }
          else {
            this.currentStatusActive = false;
          }
        }
        else{
          this.currentStatusActive = false;
        }
          if (this.LeadDetails.dealStatus == 11) {
            this.DealValueForm.disable();
            this.PaymentDetailsForm.disable();
            this.checkCurrentstatus = true;
          }
          else {
            this.DealValueForm.enable();
            this.PaymentDetailsForm.enable();
            this.checkCurrentstatus = false;
          }

          this.StatusHistory = this.LeadDetails.statusHistories;

        //  console.log("list", this.StatusHistory);
          this.EnteredDealValue = this.LeadDetails.dealValue;
          let Balanacedata = {
            leadId: this.LeadId,
            paymentFrom: this.clientPartnerDetails.userId,
            PaymentTo: "UJB",
            IsUJB: true

          };
          
          this.AmountDetails = null;
          this.leadManagementService.GetBalanace(Balanacedata).subscribe(data => {

            this.AmountDetails = data.json().data;
            if (this.AmountDetails.paidAmt == 0) { this.AllowUJb = false; }
            else {
              this.AllowUJb = true;
            }



          });

          if (this.LeadDetails.productId) {
            this.leadManagementService.getProductServiceData(this.LeadId).subscribe(

              ProductService => {
                
                this.prdservDetails = ProductService.json().data;
                this.ProductServiceDetails = this.prdservDetails.productsOrServices;
                // console.log("prod", this.ProductServiceDetails)
                
                if (this.prdservDetails.typeOf == 1) {

                  this.IsProductDropActive = false;
                  if (this.ProductServiceDetails[0].type == 2) {

                    this.DisplayAmount = this.ProductServiceDetails[0].value;
                    this.productValue = this.ProductServiceDetails[0].value;
                    this.IsPercentage = false;
                  }
                  else {
                    this.IsPercentage = true;
                    this.DisplayAmount = this.LeadDetails.dealValue * this.ProductServiceDetails[0].value / 100
                    this.productValue = this.ProductServiceDetails[0].value;
                  }

                  //   this.GetSharedValue(this.LeadDetails.dealValue);
                }
                else {
                  
                  if (this.prdservDetails.shareType == 2) {
                    this.IsProductDropActive = true;

                    if (this.LeadDetails.refMultisSlabProdId != "") {
                      this.DealValueForm.patchValue({ "ProductId": this.LeadDetails.refMultisSlabProdId });
                    }
                    else {
                      this.DealValueForm.value.ProductId = "";
                      this.DealValueForm.get('ProductId').setValidators([Validators.required]);
                    }
                  }
                  else {

                    
                    this.IsProductDropActive = true;

                    var dealproddrop = <HTMLInputElement>document.getElementById("dealproddrop");
                    dealproddrop.disabled = true;

                  }
                }

              }, err => {
                this.ResponseHelper.GetFaliureResponse(err);
              }
            );
          }



        }, err => {

        }

      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetReferralDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    //console.log()

  }

  autoSizeAll() {
    try {
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
    } catch (err) {

    }
    // this.gridColumnApi.autoSizeColumns(allColumnIds);

  }


  onGridReady(params) {
    try {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "onGridReady",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
    // params.api.sizeColumnsToFit();
  }

  GetSharedValue(amount:number) {
    
    try {
      this.IsvalidDealvalue=false;
      this.EnteredDealValue =Number(amount); 
      // this.ProductdetailsId = "";
      this.dealvalueinvalid = false;
    //  console.log("prod", this.ProductServiceDetails);
      if (this.prdservDetails.typeOf == 2) {
        if (this.prdservDetails.shareType == 1) {
          var csnt = 0;

          for (let i = 0; i < this.ProductServiceDetails.length; i++) {

            var from = this.ProductServiceDetails[i].from;

            var to = this.ProductServiceDetails[i].to;
            if (to < this.EnteredDealValue) {
              csnt++;
            }
            if (from <= this.EnteredDealValue && to >= this.EnteredDealValue) {
              //  csnt++;
              this.productType = this.ProductServiceDetails[i].type;

              this.ProductdetailsId = this.ProductServiceDetails[i].prodservdetailId;

              if (this.ProductServiceDetails[i].type == 2) {

                this.DisplayAmount = this.ProductServiceDetails[i].value;
                this.productValue = this.ProductServiceDetails[i].value;
                this.IsPercentage = false;
              }
              else {
                this.IsPercentage = true;
                this.DisplayAmount = this.EnteredDealValue * this.ProductServiceDetails[i].value / 100
                this.productValue = this.ProductServiceDetails[i].value;
              }
              this.DealValueForm.patchValue({ ProductId: this.ProductdetailsId });
              // ProductId
              break;
            }

          }
          if (csnt >= this.ProductServiceDetails.length) {
            this.dealvalueinvalid = true;
          }


          if (this.ProductdetailsId == "" || this.ProductdetailsId == null) {
            var cnt = this.ProductServiceDetails.length - 1;
            if (this.ProductServiceDetails[0].from > this.EnteredDealValue) {
              this.productType = this.ProductServiceDetails[0].type;

              this.ProductdetailsId = this.ProductServiceDetails[0].prodservdetailId;

              if (this.ProductServiceDetails[0].type == 2) {

                this.DisplayAmount = this.ProductServiceDetails[0].value;
                this.productValue = this.ProductServiceDetails[0].value;
                this.IsPercentage = false;
              }
              else {
                this.IsPercentage = true;
                this.DisplayAmount = this.EnteredDealValue * this.ProductServiceDetails[0].value / 100
                this.productValue = this.ProductServiceDetails[0].value;
              }
              this.DealValueForm.patchValue({ ProductId: this.ProductdetailsId });
            }
            else if (this.ProductServiceDetails[cnt].to < this.EnteredDealValue) {
              this.productType = this.ProductServiceDetails[cnt].type;

              this.ProductdetailsId = this.ProductServiceDetails[cnt].prodservdetailId;

              if (this.ProductServiceDetails[cnt].type == 2) {

                this.DisplayAmount = this.ProductServiceDetails[cnt].value;
                this.productValue = this.ProductServiceDetails[cnt].value;
                this.IsPercentage = false;
              }
              else {
                this.IsPercentage = true;
                this.DisplayAmount = this.EnteredDealValue * this.ProductServiceDetails[cnt].value / 100
                this.productValue = this.ProductServiceDetails[cnt].value;
              }
              this.DealValueForm.patchValue({ ProductId: this.ProductdetailsId });
            }
          }

        }
        else {
          if(this.selectedproductdata.length>0)
          {
          if (this.selectedproductdata[0].type == 2) {

            this.IsPercentage = false;
            this.DisplayAmount = this.selectedproductdata[0].value;
          }
          else {
            this.IsPercentage = true;
            this.DisplayAmount = this.EnteredDealValue * this.selectedproductdata[0].value / 100;

          }
        }
        
        }
      }
      else {
        if (this.ProductServiceDetails[0].type == 2) {

          this.DisplayAmount = this.ProductServiceDetails[0].value;
          this.productValue = this.ProductServiceDetails[0].value;
          this.IsPercentage = false;
        }
        else {
          this.IsPercentage = true;
          this.DisplayAmount = this.EnteredDealValue * this.ProductServiceDetails[0].value / 100
          this.productValue = this.ProductServiceDetails[0].value;
          this.DealValueForm.patchValue({ ProductId: this.ProductServiceDetails[0].prodservdetailId});
        }
      }
      this.PaymentDetailsForm.patchValue({ amount: this.Display_Amount });

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetSharedValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetSharedValueUJB(amount) {
    
    try {
      this.EnteredDealValue = amount;
     // console.log("prod", this.ProductServiceDetails);
      if (this.prdservDetails.typeOf == 2) {
        if (this.prdservDetails.shareType == 2) {
          if (this.shareReceivedByUJB.percOrAmount == 2) {

            this.IsPercentage = false;
            this.Display_Amount = this.shareReceivedByUJB.value;
          }
          else {
            this.IsPercentage = true;
            this.Display_Amount = this.EnteredDealValue * this.shareReceivedByUJB.value / 100;
            this.PaymentDetailsForm.patchValue({ amount: this.Display_Amount });
          }
        }
      }
      else {
        if (this.shareReceivedByUJB.percOrAmount == 2) {

          this.Display_Amount = this.shareReceivedByUJB.value;
          this.productValue = this.shareReceivedByUJB.value;
          this.IsPercentage = false;
        }
        else {
          this.IsPercentage = true;
          this.Display_Amount = this.EnteredDealValue * this.shareReceivedByUJB.value / 100
          this.productValue = this.shareReceivedByUJB.value;
          this.PaymentDetailsForm.patchValue({ amount: this.Display_Amount });

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetSharedValueUJB",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetSharedValue_old(amount) {
    
    try {
      this.EnteredDealValue = amount;
    //  console.log("prod", this.ProductServiceDetails);
      if (this.prdservDetails.typrOf == 2) {

        for (let i = 0; i < this.ProductServiceDetails.length; i++) {

          var from = this.ProductServiceDetails[i].from;

          var to = this.ProductServiceDetails[i].to;

          if (from <= this.EnteredDealValue && to >= this.EnteredDealValue) {

            this.productType = this.ProductServiceDetails[i].type;

            this.ProductdetailsId = this.ProductServiceDetails[i].prodservdetailId;

            if (this.ProductServiceDetails[i].type == 2) {

              this.DisplayAmount = this.ProductServiceDetails[i].value;
              this.productValue = this.ProductServiceDetails[i].value;
              this.IsPercentage = false;
            }
            else {
              this.IsPercentage = true;
              this.DisplayAmount = this.EnteredDealValue * this.ProductServiceDetails[i].value / 100
              this.productValue = this.ProductServiceDetails[i].value;
            }

            break;
          }

        }
      }
      else {
        if (this.selectedproductdata[0].type == 2) {

          this.IsPercentage = false;
          this.DisplayAmount = this.selectedproductdata[0].value;
        }
        else {
          this.IsPercentage = true;
          this.DisplayAmount = this.EnteredDealValue * this.selectedproductdata[0].value / 100;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetSharedValue_old",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
  GetSelectedProduct(event) {
    
    try {
      this.IsSelectedProduct=false;
      let selectedproduct = event.target.value;
      if(selectedproduct!="undefined")
      {this.GetSelected_Product(selectedproduct);}
      // else{
      //   this.IsSelectedProduct=true;
      // }

      

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetSelectedProduct",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetSelected_Product(selectedproduct) {
    
    try {
      //  let selectedproduct = event.target.value;

      this.selectedproductdata = this.ProductServiceDetails.filter(a => a.prodservdetailId === selectedproduct);

      if (this.selectedproductdata[0].type == 2) {

        this.IsPercentage = false;
        this.DisplayAmount = this.selectedproductdata[0].value;
      }
      else {
        this.IsPercentage = true;
        this.DisplayAmount = this.EnteredDealValue * this.selectedproductdata[0].value / 100;
      }

      this.productType = this.selectedproductdata[0].type;

      this.productValue = this.selectedproductdata[0].value;

      this.ProductdetailsId = this.selectedproductdata[0].prodservdetailId;

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetSelectedProduct",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ResetdealvalueForm() {
    try {

      this.DealValueForm.reset();
      this.DisplayError = false;
      this.DisplayAmount = "";
      this.productValue = "";
      this.DealValueForm.patchValue({ ProductId: '' });
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "ResetdealvalueForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)
    }
  }


  DealValueSubmit() {
    try {
      this.commonService.showLoading();
      
      this.DisplayError = true;

      if (this.IsProductDropActive == false) {
        this.DealValueForm.patchValue({ leadId: this.LeadId });
        if (this.ProductServiceDetails.length > 0) {
          this.DealValueForm.patchValue({ PercentOrAmt: this.ProductServiceDetails[0].type });
          this.DealValueForm.patchValue({ Value: this.ProductServiceDetails[0].value });
          this.DealValueForm.patchValue({ ProductId: this.ProductServiceDetails[0].prodservdetailId });
        }
        else {
          this.DealValueForm.patchValue({ PercentOrAmt: 0 });
          this.DealValueForm.patchValue({ Value: "0" });
          this.DealValueForm.patchValue({ ProductId: null });
        }
        this.DealValueForm.patchValue({ dealValue: this.EnteredDealValue });
      }
      else {
        this.DealValueForm.patchValue({ leadId: this.LeadId });
        this.DealValueForm.patchValue({ PercentOrAmt: this.productType });
        this.DealValueForm.patchValue({ Value: this.productValue });
        this.DealValueForm.patchValue({ ProductId: this.ProductdetailsId });
        this.DealValueForm.patchValue({ dealValue: this.EnteredDealValue });

      }

      if (this.DealValueForm.valid && !this.dealvalueinvalid) {

        this.DisplayError = false;

        this.leadManagementService.UpdateDealValue(this.DealValueForm.value).subscribe(data => {

          let msg = [{ message: "Deal Value Updated Successfully", type: "SUCCESS" }]

          this.notificationservice.ChangeNotification(msg);
          this.GetReferralDetails();
          // this.Dealvalueclosemodal.nativeElement.click();

          this.ResetdealStatusvalueForm();


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
        const controls = this.DealValueForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.userData.UserId,
          "Url": "",
          "screen": "referral Detail",
          "method": "DealValueSubmit",
          "message": "UserData :- " + JSON.stringify(this.DealValueForm.value),
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
        "screen": "Referral Detail",
        "method": "DealValueSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  ResetdealStatusvalueForm() {
    try {
      this.DealStatusForm.reset();
      this.DealStatusForm.patchValue({ statusId: "" });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "ResetdealStatusvalueForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  DealStatusSubmit() {
    try {
      this.commonService.showLoading();
      
      this.DisplayError1 = true;
      this.DealStatusForm.patchValue({ leadId: this.LeadId });
      this.DealStatusForm.patchValue({ updatedBy: "Admin" });

      if (this.DealStatusForm.valid) {

        this.DisplayError1 = false;

        this.leadManagementService.UpdateDealStatus(this.DealStatusForm.value).subscribe(data => {

          let msg = [{ message: "Deal status Updated  Successfully", type: "SUCCESS" }]

          this.notificationservice.ChangeNotification(msg);


          this.ResetdealStatusvalueForm();

          this.GetReferralDetails();
          this.commonService.hideLoading();

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
        );
      }
      else {
        this.DisplayError1 = true;
        this.commonService.hideLoading();

        const invalid = [];
        const controls = this.DealStatusForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.userData.UserId,
          "Url": "",
          "screen": "referral Detail",
          "method": "DealStatusSubmit",
          "message": "UserData :- " + JSON.stringify(this.DealStatusForm.value),
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
        "screen": "Referral Detail",
        "method": "DealStatusSubmit",
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
      
      // document.getElementById("amount").focus();
      let mode = event.target.value;
      this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
      this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);
      this.PaymentDetailsForm.get('chequeNo').setErrors(null);
      this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
      this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
      this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
      this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
      this.PaymentDetailsForm.get('emailId').setErrors(null);

      if (mode == '2') {
        this.IsCashActive = true;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;
        this.PaymentDetailsForm.get('cashPaidName').setValidators([null]);
        this.PaymentDetailsForm.get('mobileNumber').setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]);
        // this.PaymentDetailsForm.get('cashPaidName').setValidators([Validators.required]);
        // this.PaymentDetailsForm.get('mobileNumber').setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]);
        this.PaymentDetailsForm.get('emailId').setValidators([Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]);
        this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
        this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);
        this.PaymentDetailsForm.get('chequeNo').setErrors(null);
        this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);

      }
      else if (mode == '3') {
        this.IsCashActive = false;
        this.IsNetBankingActive = true;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('IFSCCode').setValidators([Validators.pattern('^[a-zA-Z]{4}[0][0-9]{6}$')]);
        this.PaymentDetailsForm.get('ReferrenceNo').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
        this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
        this.PaymentDetailsForm.get('chequeNo').setErrors(null);
        this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
        this.PaymentDetailsForm.get('emailId').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
      }
      else if (mode == '1') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = true;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('chequeNo').setValidators([Validators.required]);
        this.PaymentDetailsForm.get('accountHolderName').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
        this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
        this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
        this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);
        this.PaymentDetailsForm.get('emailId').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);

      }
      else if (mode == '4' || mode == '5' || mode == '6') {
        
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = true;

        this.PaymentDetailsForm.get('TransactionDate').setValidators([Validators.required]);
        this.PaymentDetailsForm.get('ReferrenceNo').setValidators([Validators.required]);

        this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
        this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
        this.PaymentDetailsForm.get('chequeNo').setErrors(null);
        this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
        this.PaymentDetailsForm.get('emailId').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
      }
      // else if (mode == '1') {
      //   this.IsCashActive = false;
      //   this.IsNetBankingActive = false;
      //   this.IsChequeActive = true;
      //   this.IsUPIActive = false;

      //   this.PaymentDetailsForm.get('chequeNo').setValidators([Validators.required]);
      //   this.PaymentDetailsForm.get('accountHolderName').setValidators([Validators.required]);

      //   this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
      //   this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
      //   this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
      //   this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);
      //   this.PaymentDetailsForm.get('emailId').setErrors(null);
      //   this.PaymentDetailsForm.get('TransactionDate').setErrors(null);

      // }
      // else if (mode == '4' || mode == '5' || mode == '6') {
      //   
      //   this.IsCashActive = false;
      //   this.IsNetBankingActive = false;
      //   this.IsChequeActive = false;
      //   this.IsUPIActive = true;


      //   this.PaymentDetailsForm.get('TransactionDate').setValidators([Validators.required]);
      //   this.PaymentDetailsForm.get('ReferrenceNo').setValidators([Validators.required]);

      //   this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
      //   this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
      //   this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
      //   this.PaymentDetailsForm.get('emailId').setErrors(null);
      //   this.PaymentDetailsForm.get('chequeNo').setErrors(null);
      //   this.PaymentDetailsForm.get('accountHolderName').setErrors(null);


      // }
      else if (mode == '') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
        this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
        this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
        this.PaymentDetailsForm.get('emailId').setErrors(null);
        this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
        this.PaymentDetailsForm.get('chequeNo').setErrors(null);
        this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
        this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);

      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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

  GetPaymentFrom(event) {
    try {

      this.Paymentfrom = event.target.value;
      this.sharedwith = [];
      if (this.Paymentfrom == 'UJB') {
        this.promotion = false;
        this.IsClinetPartner = false;
        this.IsUJB = true;
        this.IsPaymentChange = true;
        this.LeadDetails.sharedPercentageDetails.forEach(element => {
          if (element.sharedId != 1) {
            let customObj = new sharedWIth();
            customObj.name = element.name;
            customObj.id = element.id + "-" + element.sharedId;
            customObj.percentage = element.percentage;
            customObj.shareid = element.sharedId;

            this.sharedwith.push(customObj);
          }

        });

      }
      else {
        this.promotion = false;
        this.IsUJB = false;
        this.IsClinetPartner = true;
        this.IsPaymentChange = false;
        this.LeadDetails.sharedPercentageDetails.forEach(element => {

          if (element.sharedId == 1) {
            let customObj = new sharedWIth();
            customObj.name = element.name;
            customObj.id = element.id;
            customObj.percentage = element.percentage;
            customObj.shareid = element.sharedId;
            this.sharedwith.push(customObj);
          }
        });
      }

      this.GetBalancedAmount();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetPaymentFrom",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetPaymentTo(event) {
    try {
      
      this.Paymentto = event.target.value;

      if (this.Paymentto == 'UJB') {

        this.IsUJBflag = true;
        this.promotion = false;

        this.payType = 1;
      }
      else {

        this.IsUJBflag = false;

        this.payType = 2;
        var mentor = this.Paymentto.split('-')
        this.Paymentto = mentor[0];
        this.PaymenttoID = parseInt(mentor[1]);
        if ((this.PaymenttoID == 3 || this.PaymenttoID == 4)) { this.Ismentor = "Mentor"; this.promotion = true; }

        else if (this.PaymenttoID == 2) {
          this.Ismentor = "Partner";
          this.promotion = false;
        }
        else {
          this.Ismentor = "Mentor"; this.promotion = true;
        }

      }
      this.GetBalancedAmount();
      this.GetShared_percentage(mentor[1]);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetPaymentTo",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetShared_percentage(sharedId: any) {
    try {
      // 
      var sharedwithdetails = this.LeadDetails.sharedPercentageDetails.filter(x => x.id === this.Paymentto && x.sharedId == parseInt(sharedId));
      this.Shared_percentage = sharedwithdetails[0].percentage;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetShared_percentage",
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
        "screen": "Referral Detail",
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
  //     return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  //   }

  //   return "NA";
  // }

  GetBalancedAmount() {
    try {
      this.AmountDetails = null;
      let Balanacedata = {
        leadId: this.LeadId,
        paymentFrom: this.Paymentfrom,
        PaymentTo: this.PaymentDetailsForm.controls['paymentTo'].value,
        IsUJB: this.IsUJBflag

      };
      
      this.leadManagementService.GetBalanace(Balanacedata).subscribe(data => {
        this.AmountDetails = data.json().data;
        this.balanceRegisterationAmt = this.AmountDetails.balanceRegisterationAmt.toFixed(2) ;

        this.balanceRegisterationAmtdetails = this.AmountDetails.balanceRegisterationAmt.toFixed(2)  + "Rs."
        this.pendingAmt = this.AmountDetails.pendingAmt.toFixed(2) ;
        if (!this.IsUJBflag) {
          this.PaymentDetailsForm.patchValue({ amount: this.pendingAmt});
        }

        if (this.IsUJBflag == false && this.pendingAmt <= 0) {
          this.adjustregisrattionfee = false;
          this.PaymentDetailsForm.get('cashPaidName').setErrors(null);
          this.PaymentDetailsForm.get('mobileNumber').setErrors(null);
          this.PaymentDetailsForm.get('IFSCCode').setErrors(null);
          this.PaymentDetailsForm.get('emailId').setErrors(null);
          this.PaymentDetailsForm.get('TransactionDate').setErrors(null);
          this.PaymentDetailsForm.get('chequeNo').setErrors(null);
          this.PaymentDetailsForm.get('accountHolderName').setErrors(null);
          this.PaymentDetailsForm.get('ReferrenceNo').setErrors(null);
          this.PaymentDetailsForm.get('amount').setErrors(null);
          this.PaymentDetailsForm.get('paymentDate').setErrors(null);
          const format = 'YYYY-DD-MM';
          const myDate = new Date();
          // const locale = 'en-US';
          // const formattedDate = formatDate(myDate, format, locale);
          this.PaymentDetailsForm.patchValue({ paymentDate: myDate });
          this.PaymentDetailsForm.patchValue({ paymentType: "0" });
        }
        else {

          this.adjustregisrattionfee = true;
        }
      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetBalancedAmount",
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

      
      this.AmountDetails = null;
      this.commonService.showLoading();

      this.DisplayError = true;

      let Balanacedata = {
        leadId: this.LeadId,
        paymentFrom: this.Paymentfrom,
        PaymentTo: this.PaymentDetailsForm.controls['paymentTo'].value,
        IsUJB: this.IsUJBflag

      };
      
      this.leadManagementService.GetBalanace(Balanacedata).subscribe(data => {

        this.AmountDetails = data.json().data;
        
        if (this.AmountDetails.transactionIds) {

          this.PaymentTransactionId = this.AmountDetails.transactionIds;

        }

        this.AddReferalPayment();


        this.commonService.hideLoading();

      },
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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



  GetCountryCodes() {
    
    try {

      this.commonService.GetCountryCode().subscribe(data => {
        this.CountryList = data.json().data.countries;
      },
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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

  AddSubscriptionPayment(transationId: string) {
    try {
      
      this.commonService.showLoading();
      if (this.PaymentDetailsForm.value.TransactionDate != '') {

        let transactionDate = this.ConvertDateFormat(this.PaymentDetailsForm.value.TransactionDate);

        this.PaymentDetailsForm.value.TransactionDate = transactionDate;
      }
      else {
        this.PaymentDetailsForm.patchValue({ TransactionDate: '' });
      }
      

      this.PaymentDetailsForm.patchValue({ paymentDate: this.PaymentDetailsForm.value.paymentDate });

      let subscritiondata = {

        userId: this.Paymentto,//this.shareReceivedByPartner.partnerID,
        countryId: this.PaymentDetailsForm.value.countryCode,
        mobileNumber: this.PaymentDetailsForm.value.mobileNumber,
        emailId: this.PaymentDetailsForm.value.emailId,
        referralId: this.LeadId,
        paymentType: this.PaymentDetailsForm.value.paymentType,
        feeType: '5d5a450d339dce0154441aab',
        feeAmount: 0,
        amount: this.balanceRegisterationAmt + this.PaymentDetailsForm.value.adjustedRegiFeefrmPromotion,
        bankName: this.PaymentDetailsForm.value.bankName,
        branchName: this.PaymentDetailsForm.value.branchName,
        IFSCCode: this.PaymentDetailsForm.value.IFSCCode,
        accountHolderName: this.PaymentDetailsForm.value.accountHolderName,
        chequeNo: this.PaymentDetailsForm.value.chequeNo,
        ReferrenceNo: this.PaymentDetailsForm.value.ReferrenceNo,
        TransactionDate: this.PaymentDetailsForm.value.TransactionDate,
        created_By: this.UserId,
        PaymentDate: this.PaymentDetailsForm.value.paymentDate,
        Description: this.PaymentDetailsForm.value.Description,
        CashPaidName: this.PaymentDetailsForm.value.cashPaidName,
        PaymentTransactionId: this.PaymentTransactionId,
        PaidTransactionId: transationId,
      }

      

     // console.log("subscritiondata", subscritiondata);
      this.feeManagementService.SubmitPaymentDetails(subscritiondata).subscribe(

        data => {

          let msg = [{ message: "Payment Details Added Successfully", type: "SUCCESS" }]

          this.notificationservice.ChangeNotification(msg);

          // this.paymentclosemodal.nativeElement.click();

          this.ResetPaymentDetails();
          this.createPaymentdetailsForm();
          this.PaymentDetailsList();
          this.GetReferralDetails();
          this.commonService.hideLoading();

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);

        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "AddSubscriptionPayment",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  AddReferalPayment() {
    try {
      

      if (this.AmountDetails.balanceRegisterationAmt > 0) {
        this.PaymentDetailsForm.get('paymentType').setErrors(null);
        this.PaymentDetailsForm.get('amount').setErrors(null);
        this.PaymentDetailsForm.get('paymentDate').setErrors(null);
        this.PaymentDetailsForm.get('CPReceivedAmt').setErrors(null);

      }


      if (this.PaymentDetailsForm.value.TransactionDate) {

        let transactionDate = this.ConvertDateFormat(this.PaymentDetailsForm.value.TransactionDate);

        this.PaymentDetailsForm.value.TransactionDate = transactionDate;
        // this.PaymentDetailsForm.patchValue({ TransactionDate: transactionDate });
      }

      if (this.PaymentDetailsForm.value.paymentDate) {

        let PDate = this.ConvertDateFormat(this.PaymentDetailsForm.value.paymentDate);

        this.PaymentDetailsForm.value.paymentDate = PDate;

        this.PaymentDetailsForm.get('paymentDate').setErrors(null);
        // this.PaymentDetailsForm.patchValue({ paymentDate: PDate });
      }

      this.PaymentDetailsForm.patchValue({ created_By: this.UserId });

      this.PaymentDetailsForm.patchValue({ leadId: this.LeadId });

      this.PaymentDetailsForm.patchValue({ payType: this.payType });
      this.PaymentDetailsForm.patchValue({ paymentFor: "1" });
      if (this.AmountDetails.transactionIds != null) {
        this.PaymentDetailsForm.patchValue({ AdjustedTransactionIds: this.AmountDetails.transactionIds });
      }
      else {
        this.PaymentDetailsForm.patchValue({ AdjustedTransactionIds: [] });
      }
      if (this.PaymentDetailsForm.controls['CPReceivedAmt'].value != null) {
        this.PaymentDetailsForm.patchValue({ CPReceivedAmt: this.PaymentDetailsForm.controls['CPReceivedAmt'].value });
      }
      else {
        this.PaymentDetailsForm.patchValue({ CPReceivedAmt: 0 });
      }
      

      this.PaymentDetailsForm.patchValue({ 'amtRecvdFrmPramotion': this.amtRecvdFrmPramotion });

      this.PaymentDetailsForm.patchValue({ 'sharedId': this.PaymenttoID });


      let paymento = [];
      // paymento.push(this.Paymentto);
      //this.PaymentDetailsForm.value.paymentTo[0] = this.Paymentto.replace("\"[", "[").replace("]\"", "]").replace("\\", "");;
      if (this.PaymentDetailsForm.controls['adjustedRegiFeefrmPromotion'].value != null) {
        this.PaymentDetailsForm.patchValue({ adjustedRegiFeefrmPromotion: this.PaymentDetailsForm.controls['adjustedRegiFeefrmPromotion'].value });
      }
      else {
        this.PaymentDetailsForm.patchValue({ adjustedRegiFeefrmPromotion: 0 });
      }


      
      if (this.PaymentDetailsForm.valid && this.validMobileNum == false) {

        this.DisplayError = false;
        this.PaymentDetailsForm.patchValue({ paymentTo: this.Paymentto });
        //   this.PaymentDetailsForm.value.paymentTo.push(this.Paymentto);

        this.leadManagementService.SubmitPaymentDetails(this.PaymentDetailsForm.value)

          .subscribe(

            data => {
              let transationId = data.json().data;
              if (this.AmountDetails.balanceRegisterationAmt > 0) {
                //  alert(   this.AmountDetails.balanceRegisterationAmt             )
                //  alert(   this.AmountDetails.balRegisterationAmt      )
                this.AddSubscriptionPayment(transationId);
                window.scroll(0, 0);
              }
              else {

                let msg = [{ message: "Payment Details Added Successfully", type: "SUCCESS" }]
                this.ResetPaymentDetails();
                this.createPaymentdetailsForm();

                this.GetReferralDetails();
                this.PaymentDetailsList();
                this.notificationservice.ChangeNotification(msg);
                this.commonService.hideLoading();

              }


            }, err => {
              this.ResponseHelper.GetFaliureResponse(err);

            }
          );
      }
      else {
        this.DisplayError = true;
        this.commonService.hideLoading();
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "AddReferalPayment",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  onCellClicked(event) {
    // window.scroll(0, 0);
    try {

      this.PaymentDetailsForm.patchValue({ 'PaymentId': event.data._id });

      let allowedit = event.data.allowEdit;

      if (allowedit == true) {
        var savebtn = <HTMLInputElement>document.getElementById("savepayment");
        savebtn.disabled = false;
      }
      else {
        var savebtn = <HTMLInputElement>document.getElementById("savepayment");
        savebtn.disabled = true;
      }

      this.leadManagementService.GetPaymentDetailsDetails(this.PaymentDetailsForm.value.PaymentId).subscribe(

        data => {

          let response = data.json();

          this.PaymentData = response.data.paymentDetails;

         // console.log('PaymentData', this.PaymentData);

          this.BindPaymnetDetails(this.PaymentData);

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "onCellClicked",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetPayment_From(Paymentfrom, paymentTo) {
    try {

      this.Paymentfrom = Paymentfrom;
      this.sharedwith = [];
      if (this.Paymentfrom == 'UJB') {
        this.promotion = false;
        this.IsClinetPartner = false;
        this.IsUJB = true;
        this.IsPaymentChange = true;
        this.LeadDetails.sharedPercentageDetails.forEach(element => {
          if (element.sharedId != 1) {
            let customObj = new sharedWIth();
            customObj.name = element.name;
            customObj.id = element.id + "-" + element.sharedId;
            customObj.percentage = element.percentage;
            customObj.shareid = element.sharedId;

            this.sharedwith.push(customObj);
          }

        });
        this.PaymentDetailsForm.patchValue({ 'paymentTo': paymentTo });
      }
      else {
        this.promotion = false;
        this.IsUJB = false;
        this.IsClinetPartner = true;
        this.IsPaymentChange = false;
        this.LeadDetails.sharedPercentageDetails.forEach(element => {

          if (element.sharedId == 1) {
            let customObj = new sharedWIth();
            customObj.name = element.name;
            customObj.id = element.id;
            customObj.percentage = element.percentage;
            customObj.shareid = element.sharedId;
            this.sharedwith.push(customObj);
          }
        });
      }

      // this.GetBalancedAmount();

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetPaymentFrom",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  GetPayment_To(Paymentto) {
    try {
      
      this.Paymentto = Paymentto;

      if (this.Paymentto == 'UJB') {

        this.IsUJBflag = true;
        this.promotion = false;

        this.payType = 1;
      }
      else {

        this.IsUJBflag = false;

        this.payType = 2;
        var mentor = this.Paymentto.split('-')
        this.Paymentto = mentor[0];
        this.PaymenttoID = parseInt(mentor[1]);
        // alert(this.PaymenttoID)
        // alert(this.Ismentor)
        if (this.PaymenttoID == 3 || this.PaymenttoID == 4) { this.Ismentor = "Mentor"; this.promotion = true; }

        else if (this.PaymenttoID == 2) {
          this.Ismentor = "Partner";
          this.promotion = false;
        }
        else {
          this.Ismentor = "Mentor"; this.promotion = true;
        }

      }
      //  this.GetBalancedAmount();
      this.GetShared_percentage(mentor[1]);
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetPaymentTo",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  BindPaymnetDetails(PaymentData: any) {
    // this.paymentOpenmodal.nativeElement.click();
    
    try {

      this.PaymentDetailsForm.patchValue({ 'PaymentId': PaymentData._id });
      this.PaymentDetailsForm.patchValue({ 'paymentFrom': PaymentData.paymentFrom });
      if (PaymentData.paymentTo[0] != "UJB") {
        this.GetPayment_From(PaymentData.paymentFrom, PaymentData.paymentTo[0] + "-" + PaymentData.sharedId);
      }
      else {
        this.GetPayment_From(PaymentData.paymentFrom, PaymentData.paymentTo[0]);
      }
      this.PaymentDetailsForm.patchValue({ 'CPReceivedAmt': PaymentData.cpReceivedAmt });
      // alert(PaymentData.paymentTo[0]);
      if (PaymentData.paymentTo[0] != "UJB") {
        this.GetPayment_To(PaymentData.paymentTo[0] + "-" + PaymentData.sharedId);
      }
      else {
        this.PaymentDetailsForm.patchValue({ 'paymentTo': "UJB" });
      }
      this.PaymentDetailsForm.patchValue({ 'paymentType': PaymentData.paymentType });
      let pdate = PaymentData.paymentDate;
      this.PaymentDetailsForm.patchValue({ 'paymentDate': new Date(pdate) });
      this.PaymentDetailsForm.patchValue({ 'Description': PaymentData.description });
      this.PaymentDetailsForm.patchValue({ 'amount': PaymentData.amount });

      this.PaymentDetailsForm.patchValue({ 'percSharedRecvdFrmPramotion': PaymentData.percSharedRecvdFrmPramotion });
      this.PaymentDetailsForm.patchValue({ 'amtRecvdFrmPramotion': PaymentData.amtRecvdFrmPramotion + PaymentData.adjustedRegiFeefrmPromotion });
      if (this.IsUJBflag == false && PaymentData.amount <= 0 && !this.promotion) {
        this.adjustregisrattionfee = false;
      }
      else {
        this.adjustregisrattionfee = true;
      }

      if (PaymentData.paymentFrom == 'UJB') {
        this.IsClinetPartner = false;
        this.IsUJB = true;
      }
      else {
        this.IsUJB = false;
        this.IsClinetPartner = true;
      }

      if (PaymentData.paymentTo[0] == 'UJB') {

        this.IsUJBflag = true;

        this.payType = 1;
      }
      else {

        this.IsUJBflag = false;

        this.payType = 2;
      }

      this.Paymentfrom = this.PaymentDetailsForm.value.paymentFrom;
      this.Paymentto = this.PaymentDetailsForm.value.paymentTo.split('-')[0];

      this.BindValueByMode(PaymentData);
      // this.adjustregisrattionfee = true;


    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "BindPaymnetDetails",
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
      
      let countryCode = this.PaymentDetailsForm.value.countryCode;
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
        "screen": "Referral Detail",
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

  BindValueByMode(PaymentData: any) {
    try {
      
      let mode = PaymentData.paymentType;

      if (mode == '2') {
        this.IsCashActive = true;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.patchValue({ 'cashPaidName': PaymentData.cashPaidName });
        this.PaymentDetailsForm.patchValue({ 'mobileNumber': PaymentData.mobileNumber });
        this.PaymentDetailsForm.patchValue({ 'countryCode': PaymentData.countryCode });
        this.PaymentDetailsForm.patchValue({ 'emailId': PaymentData.emailId });



      }
      else if (mode == '3') {
        this.IsCashActive = false;
        this.IsNetBankingActive = true;
        this.IsChequeActive = false;
        this.IsUPIActive = false;
        this.PaymentDetailsForm.patchValue({ 'IFSCCode': PaymentData.ifscCode });
        this.PaymentDetailsForm.patchValue({ 'ReferrenceNo': PaymentData.neftDetails.referrenceNo });


      }
      else if (mode == '1') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = true;
        this.IsUPIActive = false;

        this.PaymentDetailsForm.patchValue({ 'chequeNo': PaymentData.chequeDetails.chequeNo });
        this.PaymentDetailsForm.patchValue({ 'accountHolderName': PaymentData.accountHolderName });
        this.PaymentDetailsForm.patchValue({ 'bankName': PaymentData.bankName });
        this.PaymentDetailsForm.patchValue({ 'branchName': PaymentData.branchName });

      }
      else if (mode == '4' || mode == '5' || mode == '6') {
        
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = true;

        // let tdate = moment(PaymentData.neftDetails.transactionDate).format('DD/MM/YYYY');
        let tdate = PaymentData.neftDetails.transactionDate;

        this.PaymentDetailsForm.patchValue({ 'TransactionDate': new Date(tdate) });

        this.PaymentDetailsForm.patchValue({ 'ReferrenceNo': PaymentData.neftDetails.referrenceNo });
      }

      else if (mode == '') {
        this.IsCashActive = false;
        this.IsNetBankingActive = false;
        this.IsChequeActive = false;
        this.IsUPIActive = false;


      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "BindValueByMode",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ResetPaymentDetails() {
    try {

      this.PaymentDetailsForm.reset();
      this.IsCashActive = false;
      this.IsNetBankingActive = false;
      this.IsChequeActive = false;
      this.DisplayError = false;
      this.IsUPIActive = false;
      this.PaymentDetailsForm.patchValue({ countryCode: '+91' });
      this.PaymentDetailsForm.patchValue({ paymentType: '' });
      this.PaymentDetailsForm.patchValue({ paymentFrom: '' });
      this.PaymentDetailsForm.patchValue({ paymentTo: '' });
      this.PaymentDetailsForm.patchValue({ percSharedRecvdFrmPramotion: '0' });
      this.PaymentDetailsForm.patchValue({ amtRecvdFrmPramotion: '0' });
      this.PaymenttoID = 0;
      this.balanceRegisterationAmtdetails = 0;
      this.promotion = false;
      this.balanceRegisterationAmt = 0;
      this.IsClinetPartner = true;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "ResetPaymentDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  Confirmdealstatus(flag: boolean) {
    try {
      
      if (flag) {

        this.DealStatusSubmit();

      }
      else {
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

  ConfirmDealstatussubmit() {
    
    try {
      document.getElementById("openstatusModalButton").click();
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "ConfirmDealstatussubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



  savedealvalue(flag: boolean) {
    
    try {
      if (flag) {

        this.DealValueSubmit();

      }
      else {
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "savedealvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  ConfirmDealvaluesubmit() {
    
    try {
      this.IsvalidDealvalue=false;
      this.IsSelectedProduct=false;
      if (!this.dealvalueinvalid && this.DealValueForm.value.dealValue!=0 && this.DealValueForm.value.ProductId!=null && this.DealValueForm.value.ProductId!="") {
        document.getElementById("openModalButton").click();
      }
      else
      {
        if(this.DealValueForm.value.dealValue==0 || this.DealValueForm.value.dealValue==""|| this.DealValueForm.value.dealValue==null)
        {
          this.IsvalidDealvalue=true;
        }
         if(this.DealValueForm.value.ProductId==null || this.DealValueForm.value.ProductId=="" || this.DealValueForm.value.ProductId=="undefined"){
          this.IsSelectedProduct=true;
        }
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "ConfirmDealvaluesubmit",
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
        'PaymentId': [''],
        'leadId': [''],
        'paymentType': ['', Validators.required],
        'paymentFor': ['1'],
        "payType": [''],
        'paymentFrom': ['', Validators.required],
        'paymentTo': ['', Validators.required],
        'amount': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'CPReceivedAmt': [0, Validators.compose([Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'bankName': [''],
        'branchName': [''],
        'IFSCCode': [''],
        'accountHolderName': [''],
        'chequeNo': [''],
        'ReferrenceNo': [''],
        'TransactionDate': [''],
        'paymentDate': ['', Validators.required],
        'created_By': [''],
        'cashPaidName': [''],
        'countryCode': ['+91'],
        'mobileNumber': [''],
        'emailId': [''],
        'Description': [''],
        'AdjustedTransactionIds': [[]],
        'amtRecvdFrmPramotion': [0, Validators.compose([Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'percSharedRecvdFrmPramotion': [0, Validators.compose([Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'adjustedRegiFeefrmPromotion': [0],
        'sharedId': [0]
      });

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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

  createDealValueForm() {
    try {
      this.DealValueForm = this.fb.group({
        'leadId': [''],
        'dealValue': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])],
        'PercentOrAmt': [''],
        'Value': [''],
        'ProductId': [''],
      });


    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "createDealValueForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }


  createDealStatusForm() {
    try {
      this.DealStatusForm = this.fb.group({
        'leadId': [''],
        'statusId': ['', Validators.required],
        'updatedBy': ['Admin'],
      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "createDealStatusForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  GetDealStatusList() {
    try {

      let a = this.LeadDetails.dealStatus;
      this.leadManagementService.GetDealStatus(this.LeadDetails.dealStatus).subscribe(
        data => {

          this.DealStatusList = data.json().data.statusList;

        }, err => {

          this.IsDealstatsShow = false;

        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetDealStatusList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  PaymentDetailsList() {
    
    try {
      this.leadManagementService.PaymentDetailsList(this.LeadId).subscribe(
        data => {

          this.PaymentList = data.json().data.paymentList;
         // console.log(this.PaymentList)


        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);

        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "PaymentDetailsList",
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
      if (this.ActivePage == "partner_referal") {

        this.localStorage.setItem('SetCurrentTab', "partner_referal").subscribe(() => {

        });
        this.router.navigate(["../registration"], { relativeTo: this.r.parent });
      }
      else {
        this.router.navigate(["../Referral-list"], { relativeTo: this.r.parent });
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
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

  GetPramotionalAmount(percentage) {
    try {

      var prmintamt = (this.AmountDetails.totalShareAmt * percentage) / 100;
      this.PaymentDetailsForm.patchValue({ 'amtRecvdFrmPramotion': prmintamt });

      if (this.AmountDetails.balRegisterationAmt != 0.0) {
        if ((this.AmountDetails.balRegisterationAmt > this.AmountDetails.actualAmt) && (this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value != 0.0 && this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value != null && this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value != 0)) {
          if ((this.AmountDetails.balRegisterationAmt - this.AmountDetails.actualAmt) >= this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value) {
            // this.PaymentDetailsForm.value.adjustedRegiFeefrmPromotion.push(this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value);
            this.PaymentDetailsForm.patchValue({ 'adjustedRegiFeefrmPromotion': this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value });
            //this.PaymentDetailsForm.value.amtRecvdFrmPramotion.push(0);
            this.amtRecvdFrmPramotion = 0;

          }
          else {
            this.PaymentDetailsForm.patchValue({ 'adjustedRegiFeefrmPromotion': this.AmountDetails.balRegisterationAmt - this.AmountDetails.actualAmt });
            //this.PaymentDetailsForm.value.amtRecvdFrmPramotion.push(0);
            this.amtRecvdFrmPramotion = this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value - (this.AmountDetails.balRegisterationAmt - this.AmountDetails.actualAmt);
            //  this.PaymentDetailsForm.patchValue({ 'amtRecvdFrmPramotion': this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value-(this.AmountDetails.balRegisterationAmt-this.AmountDetails.actualAmt ) });
            // this.PaymentDetailsForm.value.amtRecvdFrmPramotion.push(this.PaymentDetailsForm.controls['amtRecvdFrmPramotion'].value-(this.AmountDetails.balRegisterationAmt-this.AmountDetails.actualAmt ));
            // this.PaymentDetailsForm.value.adjustedRegiFeefrmPromotion.push(this.AmountDetails.balRegisterationAmt-this.AmountDetails.actualAmt );
          }
        }

      }
      else {
        this.amtRecvdFrmPramotion = prmintamt;

      }
      this.balanceRegisterationAmtdetails = this.PaymentDetailsForm.value.adjustedRegiFeefrmPromotion + this.balanceRegisterationAmt + "Rs. (" + this.balanceRegisterationAmt + " Rs. +" + this.PaymentDetailsForm.value.adjustedRegiFeefrmPromotion + " Rs.)";

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Referral Detail",
        "method": "GetPramotionalAmount",
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


export class sharedWIth {
  id: string;
  name: string;
  percentage: number;
  shareid: number
}
