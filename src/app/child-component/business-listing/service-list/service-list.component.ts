import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  Token: Token;
  userData;
  gridApi;
  gridColumnApi;
  // rowData :any=[];
  IsMultiple: boolean = false;
  IsProduct: boolean = false;
  IsSlab: boolean = false;


  columnDefs = [

    { headerName: 'Service Name', field: 'productName' },
    { headerName: 'Service Description', field: 'description' },
    { headerName: 'Minimum Deal Value', field: 'minDealValue' },

  ];

  rowData = [
    { productName: 'aaaa', description: 'dsgs xsdg cxbff', minDealValue: 23444 },
    { productName: 'acbcbcbaaa', description: 'ssdf fgertb xcger', minDealValue: 4545 },
    { productName: 'xcvxcv', description: 'wsdgsgxc feyrgbfxc cgrg', minDealValue: 344 },

  ];



  constructor(private router: Router, private loggerService: LoggerService) {
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()

    
    var data = {
      "UserId":this.userData .UserId,
      "Url": "",
      "screen": "Service List",
      "method": "constructor",
      "message": "Service List Screen Viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":this.userData .UserId,
    }
    this.loggerService.Logger(data)
  }

  ngOnInit() {
  }


  onAmountChange(value: string) {

    try {
      if (value == 'multiple') {

        this.IsMultiple = true;
        this.IsSlab = true;
      }
      else {
        this.IsMultiple = false;
      }

    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Service List ",
        "method": "onAmountChange",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  onMultipleChange(value: string) {

    try {
      if (value == 'product') {

        this.IsProduct = true;
        this.IsSlab = false;
      }
      else {
        this.IsProduct = false;
        this.IsSlab = true;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "Service List ",
        "method": "onMultipleChange",
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
        "screen": "Service List ",
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
        "screen": "Service List ",
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
