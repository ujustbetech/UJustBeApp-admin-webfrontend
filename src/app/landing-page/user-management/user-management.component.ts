import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { customValidation } from './../../manager/customValidators';
import { ExcelServiceService } from './../../service/excel-service.service';
import { UserManagementService } from "./../../service/user-management.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../manager/response.helper';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CommonService } from 'src/app/service/common.service';
import { Token } from 'src/app/manager/token';
import { LoggerService } from 'src/app/service/logger.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [UserManagementService, ExcelServiceService]
})
export class UserManagementComponent implements OnInit {
  Token: Token;
  userData;
  userManagementForm: FormGroup;
  DisplayError: boolean = false;
  NextPage: string = "";
  ResponseHelper: ResponseHelper;
  data: any;
  gridApi;
  gridColumnApi;
  gridOptions;
  rowData: any = [];
  editUser: UserInfo;
  UserEmailexist: boolean = false;
  UserMobileexist: boolean = false;
  CountryList: any[];
  exportToBtnDisable: boolean = false;
  params: any;
  validMobileNum: boolean = false;

 


  columnDefs = [

    { headerName: 'First Name', field: 'firstName' },
    { headerName: 'Last Name', field: 'lastName' },
    { headerName: 'Mobile Number', cellRenderer: this.MyCustomCellRendererClass, width: 200 },
    { headerName: 'Email Id', field: 'emailId', width: 200 },
    { headerName: 'Role', field: 'role', width: 200 },
    { headerName: 'Is Active', cellRenderer: this.MyCustomIsActive, width: 200 }
  ];




  constructor(private excelserviceService: ExcelServiceService, private commonService: CommonService, private router: Router, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private userManagementService: UserManagementService, private loggerService: LoggerService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Token = new Token(this.router);
    this.userData = this.Token.GetUserData()
    this.editUser = new UserInfo();
    var data = {
      "UserId": "",
      "Url": "",
      "screen": "user management",
      "method": "constructor",
      "message": "User Management Screen viewed",
      "error": '',
      "date": new Date(),
      "source": "WebSite",
      "createdBy":"",
    }
    this.loggerService.Logger(data)
  }


  ngOnInit() {
    try {
      this.localStorage.removeItem('Partner_User_Id').subscribe(() => { }, () => { });
      this.createForm();
      this.GetAdminUserList();
      this.GetCountryCodes();
      this.userManagementForm.patchValue({ 'isActive': true })
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }
 
  
  exportAsXLSX(): void {
    try {
    
      this.exportToBtnDisable = true;
      var exportData = [];
     // this.gridApi.forEachNodeAfterFilter(this.printNode);
     var count = this.gridApi.getDisplayedRowCount();
     
     for (var i = 0; i < count; i++) {
       var node = this.gridApi.getDisplayedRowAtIndex(i);
       var obj = new Object();  
 
       obj['First Name'] = node.data.firstName;
       obj['Last Name'] = node.data.lastName;
       obj['Country Code'] = node.data.countryCode;
       obj['Mobile Number'] = node.data.mobileNumber;
       obj['Email Id'] = node.data.emailId;
       obj['Role'] = node.data.role;
       obj['Is Active'] = node.data.isActive;
     
       exportData.push(obj);
     }
     

      this.excelserviceService.exportAsExcelFile(exportData, 'User-Management-Export');
      this.exportToBtnDisable = false;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "exportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }
  }

  
  exportAsXLSX_old(): void {
    try {
    
      this.exportToBtnDisable = true;
      var exportData = [];

      this.rowData.forEach((el) => {
        var obj = new Object()

        obj['First Name'] = el.firstName;
        obj['Last Name'] = el.lastName;
        obj['Country Code'] = el.countryCode;
        obj['Mobile Number'] = el.mobileNumber;
        obj['Email Id'] = el.emailId;
        obj['Role'] = el.role;
        obj['Is Active'] = el.isActive;

        exportData.push(obj);
      })
      this.excelserviceService.exportAsExcelFile(exportData, 'User-Management-Export');
      this.exportToBtnDisable = false;
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "exportAsXLSX",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)


    }
  }

  MyCustomCellRendererClass(param) {
    try {
      return param.data.countryCode + ' ' + param.data.mobileNumber;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "MyCustomCellRendererClass",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  MyCustomIsActive(param) {
    try {
      if (param.data.isActive == true) {
        return 'Yes';
      }
      else {
        return 'No';
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "MyCustomIsActive",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
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
        "screen": "user-management",
        "method": "GetCountryCodes",
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
      this.gridColumnApi.autoSizeColumns(allColumnIds);
      this.gridApi.sizeColumnsToFit();
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "autoSizeAll",
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
  
      this.commonService.showLoading();

      this.userManagementForm.patchValue({ 'userRole': 'Admin' });

      if (this.userManagementForm.valid && this.validMobileNum == false && this.validMobileNum == false && this.UserEmailexist == false && this.UserMobileexist == false) {

        this.DisplayError = false;

        this.userManagementService.AdminAddUpdate(this.userManagementForm.value)

          .subscribe(

            data => {

              this.ResponseHelper.GetSuccessResponse(data);

              this.GetAdminUserList();

              this.ResetUserForm();

              this.userManagementForm.patchValue({ 'countryCode': '+91' });

              this.userManagementForm.patchValue({ 'isActive': true });
              this.commonService.hideLoading();


            }, err => {

            }
          );




      }
      else {
        this.DisplayError = true;
        this.commonService.hideLoading();

        
        const invalid = [];
        const controls = this.userManagementForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": "",
          "Url": "",
          "screen": "UserManagement",
          "method": "FormSubmit",
          "message": "UserData :- " + JSON.stringify(this.userManagementForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": "",
        }
        this.loggerService.Logger(invalidField)

      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
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


  GetAdminUserList() {
    try {
      this.commonService.showLoading();
      this.userManagementService.AdminUserList("")
        .subscribe(
          data => {

            let res = data.json();

            this.rowData = res.data;
           // console.log(this.rowData);
            this.commonService.hideLoading();

          }, err => {

          }
        );
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "GetAdminUserList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  checkIsuserValue(event: any) {

    try {
      if (event.target.checked == true) {

        this.userManagementForm.patchValue({ 'isActive': true });

      }
      else {
        this.userManagementForm.patchValue({ 'isActive': false });
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "checkIsuserValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }

  CheckIsMobileNumberExistUserDetails(mobile: any) {

    try {
      this.CheckMobileStartvalue(mobile)

      let mobileno = this.rowData.filter(a => a.mobileNumber === mobile);

      if (mobileno.length > 0) {

        this.UserMobileexist = true;

      }
      else {
        this.UserMobileexist = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "CheckIsMobileNumberExistUserDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }

  CheckIsEmailExistUserDetails(email: string) {

    try {


      let useremail = this.rowData.filter(a => a.emailId === email);


      if (useremail.length > 0) {

        this.UserEmailexist = true;

      }
      else {
        this.UserEmailexist = false;
      }
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "CheckIsEmailExistUserDetails",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }


  }

  GetUseremailvalue(email: any) {
    try {

      this.CheckIsEmailExistUserDetails(email);
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "GetUseremailvalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }

  }

  GetUserMobilevalue(mobile: any) {

    try {
      this.CheckIsMobileNumberExistUserDetails(mobile);
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "GetUserMobilevalue",
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

    try {
      this.userManagementForm.patchValue({ 'Id': e.data.userId });

      this.userManagementForm.patchValue({ 'userRole': 'Admin' });

      let userId = e.data.userId;

      this.userManagementService.getUser(userId).subscribe(

        data => {

          let response = data.json();

          this.editUser = response.data;

          this.userManagementForm.patchValue({ 'isActive': this.editUser.isActive });

        }, err => {

        }
      );
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "GetUserMobilevalue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }


  ResetUserForm() {

    try {
      this.userManagementForm.reset();
      this.DisplayError = false;
      this.UserMobileexist = false;
      this.UserEmailexist = false;
      this.userManagementForm.patchValue({ 'countryCode': '+91' });
      this.userManagementForm.patchValue({ 'isActive': true })
    } catch (err) {
      
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
        "method": "ResetUserForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy":this.userData.UserId,
      }
      this.loggerService.Logger(data)

    }
  }



  CheckMobileStartvalue(mobileNo: any) {
   
    try {
      let countryCode = this.userManagementForm.value.countryCode;
      if (countryCode == '+91') {
     
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
        "screen": "user-management",
        "method": "CheckMobileStartvalue",
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
      this.userManagementForm = this.fb.group({
        'Id': [''],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'email': [null, Validators.required],
        'mobileNumber': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
        'userRole': [''],
        'countryCode': ['+91', Validators.compose([Validators.required])],
        'isActive': ['']
      }, {
        validator: Validators.compose([customValidation.isEmailValid])
      });
    } catch (err) {
      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
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


  onGridReady(params) {

    try {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    } catch (err) {

      var data = {
        "UserId": this.userData.UserId,
        "Url": "",
        "screen": "user-management",
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

export class UserInfo {
  userId?: string;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  mobileNumber?: string;
  password?: string;
  role?: string;
  countryCode?: string;
  isActive?: boolean;

}
