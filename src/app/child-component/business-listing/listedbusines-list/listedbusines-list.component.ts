import { Component, OnInit } from '@angular/core';
import { BusinessListingService } from './../../../service/business-listing.service';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router"
import { CommonService } from './../../../service/common.service';
import { ExcelServiceService } from './../../../service/excel-service.service';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-listedbusines-list',
  templateUrl: './listedbusines-list.component.html',
  styleUrls: ['./listedbusines-list.component.css']
})
export class ListedbusinesListComponent implements OnInit {
  Token: Token;
  userData;
  gridApi;
  gridColumnApi;
  BussinessList: any[];
  ResponseHelper: ResponseHelper;
  selectedvalue: string;
  BusinessId: string;
  actionType: string;
  // BusinessId:String;
  editbusiness: any;
  userId: string;
  exportToBtnDisable: boolean = false;


  columnDefs = [

    { headerName: 'Business Title/Tagline ', field: 'tagLine', filter: true, },
    { headerName: 'Email Id', field: 'businessEmail', filter: true },
    { headerName: 'Location', field: 'address.location', filter: true },
    { headerName: 'Description', field: 'businessDescription', filter: true },
    { headerName: 'Website Url', field: 'websiteUrl', filter: true },
    { headerName: 'GST Number', field: 'gstNumber', filter: true },
    { headerName: 'Add Product/Service', filter: false, cellRenderer: this.MyCustomCellRendererClass },

  ];
  rowData: any[];

  constructor(private excelserviceService: ExcelServiceService, private commonService: CommonService, private router: Router, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private businessListingService: BusinessListingService, private loggerService: LoggerService) {
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    var data = {
      "UserId":this.userData .UserId,
      "Url": "",
      "screen": "Listed Business List",
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

    this.GetBusinessList();
    //this.createForm();

  }

  BusinessDataxportAsXLSX(): void {
  
    try {
      this.exportToBtnDisable = true;
      var exportData = [];

      this.rowData.forEach((el) => {
        var obj = new Object()

        obj['Business Title/Tagline '] = el.tagLine;
        obj['Email Id'] = el.businessEmail;
        obj['Location'] = el.address.location;
        obj['Description'] = el.businessDescription;
        obj['Website Url'] = el.websiteUrl;
        obj['GST Number'] = el.gstNumber;


        exportData.push(obj);
      })
      this.excelserviceService.exportAsExcelFile(exportData, 'Business-Export');
      this.exportToBtnDisable = false;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
        "method": "BusinessDataxportAsXLSX",
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
  
      this.localStorage.removeItem('Businessdata');

      this.BusinessId = data.data.businessId;

      this.userId = data.data.userId;
     
      this.localStorage.setItem('Businessdata', data.data).subscribe(() => { });

      this.actionType = data.event.target.getAttribute("data-action-type")

      if (data.colDef.headerName == "Add Product/Service" && this.actionType == "Add_Product") {

        this.router.navigate(['/product-listing']);

      }
      else {
      
        this.businessListingService.GetBusinessDetails(this.userId).subscribe((data) => {

          let response = data.json();

          this.editbusiness = response.data;

          this.commonService.changeData(this.editbusiness)

          this.localStorage.removeItem('edit_business_id');

          this.router.navigate(['/add-business']);

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
        });

      }
    } catch (err) {
      var data1 = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
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






  GetBusinessList() {
    try {
     
      this.businessListingService.GetBusinessList()

        .subscribe(data => {

          let obj = data.json().data;

          this.rowData = obj;

         // console.log("list", this.rowData);

        },
        );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
        "method": "GetBusinessList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }
  }



  getvalue(value) {
    try {
      this.selectedvalue = value;

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
        "method": "getvalue",
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
        "screen": "Listed Busines ",
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
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
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

  MyCustomCellRendererClass() {

    try {
      let val = 'Add Product/Service';

      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<button class="btn btn-primary btn-xs" data-action-type="Add_Product">' + val + '</button>';
      let eButton = eDiv.querySelectorAll('.btn')[0];
      return eDiv;

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Listed Busines ",
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





}

