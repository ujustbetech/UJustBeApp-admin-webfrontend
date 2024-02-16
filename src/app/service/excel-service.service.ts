import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
  
    var json_string = JSON.stringify(json)
    var converted = JSON.parse(json_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(converted);
    const workbook: XLSX.WorkBook = { Sheets: { 'sheet 1': worksheet }, SheetNames: ['sheet 1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public exportAsExcelFilewithMultiple(partnerjson: any[], Lpartnerjson: any[], Productjson: any[], Subscriptionjson: any[], Guestjson: any[] ,excelFileName: string): void {
   
    var Partnerjson_string = JSON.stringify(partnerjson)
    var Partnerjson_string_converted = JSON.parse(Partnerjson_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);
    const Partnerworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Partnerjson_string_converted);

    var LPartnerjson_string = JSON.stringify(Lpartnerjson)
    var LPartnerjson_string_converted = JSON.parse(LPartnerjson_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);
    const Lpworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(LPartnerjson_string_converted);

    var Productjson_string = JSON.stringify(Productjson)
    var Productjson_string_converted = JSON.parse(Productjson_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);
    const Prodcutworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Productjson_string_converted);

    var Subscriptionjson_string = JSON.stringify(Subscriptionjson)
    var Subscriptionjson_string_converted = JSON.parse(Subscriptionjson_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);
    const Subscriptionworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Subscriptionjson_string_converted);

    var Guestjson_string = JSON.stringify(Guestjson)
    var Guestjson_string_converted = JSON.parse(Guestjson_string, (k, v) => v === true ? "Yes" : v === false ? "No" : v);
    const Guestworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Guestjson_string_converted);

  //  const workbook: XLSX.WorkBook = { Sheets: { 'Partner Details': Prodcutworksheet, 'LP Details': Lpworksheet, 'LP Products': Partnerworksheet, 'LP membership details': Subscriptionworksheet }, SheetNames: ['Partner Details', 'LP Details', 'LP Products', 'LP membership details'] };
    const workbook: XLSX.WorkBook = { Sheets: { 'Guest Details': Guestworksheet, 'Partner Details': Partnerworksheet, 'LP Details': Lpworksheet, 'LP Product or Service details': Prodcutworksheet, 'LP membership details': Subscriptionworksheet }, SheetNames: ['Guest Details','Partner Details', 'LP Details', 'LP Product or Service details', 'LP membership details'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    let name = fileName + '_UJB_' + new Date().getTime() + EXCEL_EXTENSION;
    FileSaver.saveAs(data, name);
  }

  // public downloadExcel(res) {
  //   let url = window.URL.createObjectURL(res.data);
  //   let a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.setAttribute('style', 'display: none');
  //   a.href = url;
  //   a.download = res.filename;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();
  // }
}
