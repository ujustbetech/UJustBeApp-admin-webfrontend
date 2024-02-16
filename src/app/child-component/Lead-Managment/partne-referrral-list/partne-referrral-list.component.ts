import { Component, OnInit, Input } from '@angular/core';
import { LeadManagementService } from "./../../../service/lead-management.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router";
import { CommonService } from "../../../service/common.service"
import { CustomDateComponent } from "./../../../manager/custom-date-component.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';


@Component({
  selector: 'app-partne-referrral-list',
  templateUrl: './partne-referrral-list.component.html',
  styleUrls: ['./partne-referrral-list.component.css']
})
export class PartneReferrralListComponent implements OnInit {
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
  private frameworkComponents;
  public modules: any[] = AllCommunityModules;


  columnDefs = [

    { headerName: 'Product Name', field: 'productName' },
    // { headerName: 'Referrals Given By Partner', field: 'referredByDetails.referredByName'},
    { headerName: 'Listed Partner Name', field: 'clientPartnerDetails.name' },
    { headerName: 'Referral Id', field: 'referralCode' },
    { headerName: 'Deal Status', field: 'dealStatusValue', },
    { headerName: 'Referral Status', field: 'referralStatusValue' },
    { headerName: 'Self/Third Party Name', field: 'referredByMeList', cellRenderer: this.SelfName },
    { headerName: 'Referral Description', field: 'referralDescription', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, autoHeight: true },
    {
      headerName: 'Referral Given date', field: 'dateCreated',
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

  ];

  // 
  //,filter:StatusFilter, floatingFilterComponent:FloatingStatusFilter
  columnDefsreferredBusinessList = [

    { headerName: 'Product Name', field: 'productName' },
    { headerName: 'Partner Name', field: 'referredByDetails.referredByName' },
    { headerName: 'Referral Id', field: 'referralCode' },
    { headerName: 'Deal Status', field: 'dealStatusValue' },
    { headerName: 'Referral Status', field: 'referralStatusValue' },
    { headerName: 'Self/Third Party Name', field: 'referredBusinessList', cellRenderer: this.SelfNamereferal },
    { headerName: 'Referral Description', field: 'referralDescription', cellStyle: { 'white-space': 'normal', 'line-height': 1.5 }, autoHeight: true },
    {
      headerName: 'Referral Received  Date', field: 'dateCreated',
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

  ];



  constructor(private notificationservice: NotificationService, private leadManagementService: LeadManagementService, private localStorage: LocalStorage, private router: Router, private commonService: CommonService, private loggerService: LoggerService) {
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.frameworkComponents = { agDateInput: CustomDateComponent, }

    var data1 = {
      "UserId":   this.userData.UserId,
      "Url": "",
      "screen": "Partner Referral List",
      "method": "constructor",
      "message": "Partner Referral List Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":   this.userData.UserId,
    }
    this.loggerService.Logger(data1)
    // this.rowHeight = 275;
  }

  ngOnInit() {
    this.GetReferralList();
    // alert(this.PartnerId)
  }

  SelfName(param) {
    
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
        "screen": "Partner Referrral List",
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
        "screen": "Partner Referrral List",
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

  GetReferralList() {
    try {
      
      this.leadManagementService.GetReferralList(this.PartnerId).subscribe(
        data => {


          this.referredByMeList = data.json().data.referredByMeList;

          this.referredBusinessList = data.json().data.referredBusinessList;

         // console.log("referal", this.referredByMeList);

         // console.log("referal", this.referredBusinessList);
        }, err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
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
      // this.gridApi.sizeColumnsToFit();  
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
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

  // onColumnResized() {
  //   this.gridApi.resetRowHeights();
  // }

  onGridReady(params) {
    try {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
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

  onCellClicked(e) {
    try {

      this.localStorage.removeItem('Businessdata');
      this.localStorage.removeItem('referralId');

      this.referralId = e.data.referralId;

      // this.userId =data.data.userId;
      

      this.localStorage.setItem('referralId', this.referralId).subscribe(() => { });

      this.localStorage.setItem('ActivePage', "partner_referal").subscribe(() => { });
      this.router.navigate(['/referral-details']);

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
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

}


function StatusFilter() {
}

StatusFilter.prototype.init = function (params) {
  try {
    
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.setupGui(params);
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
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

// not called by ag-Grid, just for us to help setup
StatusFilter.prototype.setupGui = function (params) {
  try {
    
    this.gui = document.createElement('div');
    this.gui.innerHTML =
      '<div style="padding: 4px; width: 200px;">' +
      // '<div style="font-weight: bold;">Custom Athlete Filter</div>' +
      '<div><select id="filterText" class="form-control"></div>' +
      '<div> <option>-Select-</option></div>' +
      '<div> <option>Not Connected</option></div>' +
      '<div> <option>Called But No Response</option></div>' +
      '<div> <option>Deal Not Closed</option></div>' +
      '<div> <option>Discussion in progress</option></div>' +
      '<div> <option>Deal Closed</option></div>' +
      '<div> <option>Received part payment</option></div>' +
      '<div> <option>Work in progress</option></div>' +
      '<div> <option>Work completed</option></div>' +
      '<div> <option>Received full and final payment</option></div>' +
      '<div> <option>Agreed Percentage Transferred to UJustBe</option></div>' +

      '<div> </select></div>' +
      '</div>';

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener("changed", listener);
    this.eFilterText.addEventListener("paste", listener);
    this.eFilterText.addEventListener("input", listener);
    this.eFilterText.addEventListener("keydown", listener);
    this.eFilterText.addEventListener("keyup", listener);

  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "setupGui",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }

  var that = this;
  function listener(event) {
    try {
      that.filterText = event.target.value;
      params.filterChangedCallback();
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
        "method": "listener1",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }
};

StatusFilter.prototype.getGui = function () {
  
  try {
    return this.gui;
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
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

StatusFilter.prototype.doesFilterPass = function (params) {
  try {
    
    // make sure each word passes separately, ie search for firstname, lastname
    var passed = true;
    var valueGetter = this.valueGetter;
    this.filterText.toLowerCase().split(" ").forEach(function (filterWord) {
      var value = valueGetter(params);
      if (value != null) {
        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
          passed = false;
        }
      }
      else {

        passed = false;
      }

    });

    return passed;
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "doesFilterPass",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }
};

StatusFilter.prototype.isFilterActive = function () {
  try {
    if (this.filterText == '-Select-') {
      return this.filterText == '';
    }
    else {
      return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
    }
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "isFilterActive",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }

};

StatusFilter.prototype.getModel = function () {
  try {
    
    var model = { value: this.filterText.value };
    return model;
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "getModel",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }
};



StatusFilter.prototype.setModel = function (model) {
  try {

    this.eFilterText.value = model.value;
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "setModel",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }
};







function FloatingStatusFilter() {

}



FloatingStatusFilter.prototype.init = function (params) {
  try {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '<div style="padding: 4px; width: 200px;">' +
      // '<div style="font-weight: bold;">Custom Athlete Filter</div>' +
      '<div><select id="floatfilterText" class="form-control"></div>' +
      '<div> <option>-Select-</option></div>' +
      '<div> <option>Not Connected</option></div>' +
      '<div> <option>Called But No Response</option></div>' +
      '<div> <option>Deal Not Closed</option></div>' +
      '<div> <option>Discussion in progress</option></div>' +
      '<div> <option>Deal Closed</option></div>' +
      '<div> <option>Received part payment</option></div>' +
      '<div> <option>Work in progress</option></div>' +
      '<div> <option>Work completed</option></div>' +
      '<div> <option>Received full and final payment</option></div>' +
      '<div> <option>Agreed Percentage Transferred to UJustBe</option></div>' +

      '<div> </select></div>' +
      '</div>';
    this.currentValue = null;
    this.eFilterInput = this.eGui.querySelector('#floatfilterText');

  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "init",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)


  }
  var that = this;
  function listener() {
    try {
      if (that.eFilterInput.value == '-Select-') {
        // Remove the filter
        params.parentFilterInstance(function (instance) {
          instance.onFloatingFilterChanged(null);
        });

        return;
      }

      that.currentValue = that.eFilterInput.value;
     // console.log(that.currentValue);

      params.parentFilterInstance(function (instance) {
        instance.onFloatingFilterChanged(that.currentValue);
      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Partner Referrral List",
        "method": "listener",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)
  

    }
  }
  this.eFilterInput.addEventListener('select', listener);
  this.eFilterInput.addEventListener('changed', listener);
};

FloatingStatusFilter.prototype.onParentModelChanged = function (parentModel) {
  try {

    if (!parentModel) {
      this.eFilterInput.value = '';
      this.currentValue = null;
    } else {
      this.eFilterInput.value = parentModel.filter + '';
      this.currentValue = parentModel.filter;
    }
  } catch (err) {
    var data = {
      "UserId": this.userData.UserId,
      "Url": "",
      "screen": "Partner Referrral List",
      "method": "onParentModelChanged",
      "message": "error occured",
      "error": err.toString(),
      "date": new Date(),
      "source": "WebSite",
      "createdBy": this.userData.UserId,
    }
    this.loggerService.Logger(data)

  }
};

FloatingStatusFilter.prototype.getGui = function () {
 try {
    return this.eGui;
 } catch (err) {

  var data = {
    "UserId": this.userData.UserId,
    "Url": "",
    "screen": "Partner Referrral List",
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






