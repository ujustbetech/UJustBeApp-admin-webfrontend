import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from "./../../../service/common.service";
import { RegistrationService } from "./../../../service/registration.service";
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from './../../../manager/response.helper';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { startWith, map } from 'rxjs/operators';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
  providers: [CommonService, RegistrationService]
})
export class QuestionnaireComponent implements OnInit {

  QuestionnairreForm: FormGroup;
  NextPage: string = "";
  ResponseHelper: ResponseHelper;
  MentorList: any[];
  @Output() next_page = new EventEmitter<any>();
  @Output() previous_page = new EventEmitter<any>();
  @Output() IsDirtyform = new EventEmitter<any>();
  @Input() UserData;
  @Input() UserDetails;
  @Input() AddEdit;
  control = new FormControl();
  DOB: any;
  Selected_About_UJB: string;
  Is_Selected_About_UJB: boolean = false;
  Registered_User_Id: string;
  // public max = new Date(2001, 0, 21, 20, 30);
  public max = moment(new Date()).subtract(18, 'years');
  currentYear: any;
  ValidDate: boolean = false;
  CompanySelected: boolean = false;
  IndividualSelected: boolean = false;
  EditDate: any;
  editpartner: any;
  CountryList: any;
  SelectedCountry: string;
  StateList: string;
  DisplayError: boolean = false;
  List: any = [];
  filteredList: any = [];
  SelectedMentor: any = '';
  BDATE: any;
  isNan: boolean = false;
  isNan1: boolean = false;
  isNan2: boolean = false;
  isNan3: boolean = false;
  isNan4: boolean = false;
  // @ViewChild("auto") auto: MatAutocomplete;

  constructor(private loggerService: LoggerService, private router: Router, private commonservice: CommonService, private fb: FormBuilder, private localStorage: LocalStorage, private notificationservice: NotificationService, private registrationservice: RegistrationService, private el: ElementRef) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);



  }

  ngOnInit() {
    try {
      
      this.createForm();

      this.GetCountries();

      this.DrpdownValues();

      this.GetMentorList();

      this.localStorage.getItem('Partner_User_Id').subscribe((Registered_User) => {

        this.Registered_User_Id = Registered_User;



        // alert(this.Registered_User_Id);

        if (this.AddEdit != "Add") {
          if (this.Registered_User_Id) {
            this.GetUpdatedData();

          }
        }


      });

      this.filteredList = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );


      var pageView = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "ngOnInit",
        "message": "Questuonnaire Screen viewed",
        "error": '',
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(pageView)


    } catch (err) {

      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "GetUpdatedData",
        "method": "ngOnInit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  ngDoCheck() {
    try {
      if (this.QuestionnairreForm.dirty) {
        // alert('true');
        this.IsDirtyform.emit(true)

      }
      else {
        // alert('false');
        this.IsDirtyform.emit(false)
      }
    } catch (err) {

      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "GetUpdatedData",
        "method": "ngDoCheck",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

    // this.DrpdownValues();

  }

  GetUpdatedData() {

    try {
      this.registrationservice.GetUserDetails(this.Registered_User_Id).subscribe((data) => {

        let response = data.json();

        this.editpartner = response.data;

        this.UserDetails = this.editpartner.userInfo;

        this.adddetails();
        if (this.UserDetails) {
          const index = this.List.findIndex(item => item.mentorCode === this.UserDetails.myMentorCode);
          this.List.splice(index, 1);
        }

        this.ResponseHelper.GetSuccessResponse(data)


      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      });
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "GetUpdatedData",
        "method": "_filter",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  adddetails() {
    try {
      
      this.QuestionnairreForm.patchValue({ 'userId': this.UserDetails._id })
      this.QuestionnairreForm.patchValue({ 'gender': this.UserDetails.gender })
      this.QuestionnairreForm.patchValue({ 'knowledgeSource': this.UserDetails.knowledgeSource })
      this.QuestionnairreForm.patchValue({ 'organisationType': 'Individual' })
      this.QuestionnairreForm.patchValue({ 'userType': this.UserDetails.userType })
      this.QuestionnairreForm.patchValue({ 'passiveIncome': this.UserDetails.passiveIncome })
      this.QuestionnairreForm.patchValue({ 'countryId': this.UserDetails.countryId })
      this.QuestionnairreForm.patchValue({ 'Role': this.UserDetails.role })

      this.GetStates(this.UserDetails.countryId);

      this.QuestionnairreForm.patchValue({ 'stateId': this.UserDetails.stateId })
      
      // "2001-1-16T00:00:00.000Z"

      if (this.UserDetails.birthDate) {
        let date = this.UserDetails.birthDate.split('T');

        this.BDATE = date[0];
        this.QuestionnairreForm.patchValue({ 'birthDate': new Date(this.BDATE) });

      }

      this.QuestionnairreForm.controls['addressInfo'].patchValue({
        location: this.UserDetails.address.location,
        flatWing: this.UserDetails.address.flatWing,
        locality: this.UserDetails.address.locality
      });

      this.QuestionnairreForm.patchValue({ 'Locality1': this.UserDetails.preferredLocations.location1 })
      this.QuestionnairreForm.patchValue({ 'Locality2': this.UserDetails.preferredLocations.location2 })
      this.QuestionnairreForm.patchValue({ 'Locality3': this.UserDetails.preferredLocations.location3 })


      if (this.UserDetails.mentorCode == 'UJB0000') {
        // this.QuestionnairreForm.patchValue({ 'mentorCode': this.UserDetails.mentorCode })
        this.Is_Selected_About_UJB = false;
        this.QuestionnairreForm.patchValue({ 'mentorCode': '' })
      }

      else {

        this.Is_Selected_About_UJB = true;
        this.QuestionnairreForm.patchValue({ 'mentorCode': this.UserDetails.mentorCode })
      }


      //if (this.UserDetails.organisationType == 'Company') {
      //  this.CompanySelected = true;

      //}
      //else if (this.UserDetails.organisationType == 'Individual') {
      //  this.IndividualSelected = true;
      //}
      //else if (this.UserDetails.organisationType == 'Other') {
      //  var areyou = <HTMLInputElement>document.getElementById("areyou");
      //  areyou.disabled = true;
      //}

      this.DefaultDropDown();

      if (this.UserDetails.knowledgeSource != 'UJustBe Partner') {
        // this.QuestionnairreForm.patchValue({ 'mentorCode': this.UserDetails.mentorCode })
        this.Is_Selected_About_UJB = false;
        this.QuestionnairreForm.patchValue({ 'mentorCode': '' })
      }

      else {
        
        this.Is_Selected_About_UJB = true;



        var obj = new Object();
        obj['searchTerm'] = '';
        this.commonservice.GetMentorList(obj)
          .subscribe(data => {
            
            this.MentorList = data.json().data;
            let Mentorcode = this.MentorList.filter(a => a.mentorCode === this.UserDetails.mentorCode);
            let Name = Mentorcode[0].fullName;
            this.SelectedMentor = Name;
            this.QuestionnairreForm.patchValue({ 'mentorCode': this.UserDetails.mentorCode })
          })


      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "adddetails",
        "method": "_filter",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  private _filter(value: string): string[] {
    
    //   if(this.UserDetails){
    //   const index =  this.List.findIndex(item => item.mentorCode === this.UserDetails.myMentorCode);
    //   this.List.splice(index,1); 
    //  }   
    try {
      const filterValue = this._normalizeValue(value);
      return this.List.filter(a => this._normalizeValue(a.fullName).includes(filterValue));
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "_filter",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  private _normalizeValue(value: string): string {
    try {
      return value.toLowerCase().replace(/\s/g, '');
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "_normalizeValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }





  onKey() {
    
    try {

      if (this.QuestionnairreForm.value.Locality1 == undefined || this.QuestionnairreForm.value.Locality1 == "") {

        this.isNan = false;
      } else {

        if (isNaN(Number(this.QuestionnairreForm.value.Locality1))) {
          ///
          this.isNan = false;

        } else {
          this.isNan = true;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onKey",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)


    }
  }

  onKey1() {
    
    try {

      if (this.QuestionnairreForm.value.Locality2 == undefined || this.QuestionnairreForm.value.Locality2 == "") {

        this.isNan1 = false;
      } else {

        if (isNaN(Number(this.QuestionnairreForm.value.Locality2))) {
          ///
          this.isNan1 = false;

        } else {
          this.isNan1 = true;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onKey1",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  onKey2() {
    
    try {

      if (this.QuestionnairreForm.value.Locality3 == undefined || this.QuestionnairreForm.value.Locality3 == "") {

        this.isNan2 = false;
      } else {

        if (isNaN(Number(this.QuestionnairreForm.value.Locality3))) {
          ///
          this.isNan2 = false;

        } else {
          this.isNan2 = true;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onKey2",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  onKey3() {
    
    try {

      if (this.QuestionnairreForm.value.addressInfo.locality == undefined || this.QuestionnairreForm.value.addressInfo.locality == "") {

        this.isNan3 = false;
      } else {

        if (isNaN(Number(this.QuestionnairreForm.value.addressInfo.locality))) {
          ///
          this.isNan3 = false;

        } else {
          this.isNan3 = true;

        }
      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onKey3",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  onKey4() {
    
    try {

      if (this.QuestionnairreForm.value.addressInfo.location == undefined || this.QuestionnairreForm.value.addressInfo.location == "") {

        this.isNan4 = false;
      } else {

        if (isNaN(Number(this.QuestionnairreForm.value.addressInfo.location))) {
          ///
          this.isNan4 = false;

        } else {
          this.isNan4 = true;

        }
      }
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onKey4",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  FormSubmit() {
    
    try {

      for (const key of Object.keys(this.QuestionnairreForm.controls)) {
        if (this.QuestionnairreForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      if (this.QuestionnairreForm.valid) {
        this.commonservice.showLoading();

        this.QuestionnairreForm.value.Localities = [];

        if (this.UserDetails) {

          this.QuestionnairreForm.patchValue({ 'userId': this.UserDetails._id })
        }
        else {
          this.QuestionnairreForm.patchValue({ userId: this.Registered_User_Id })
        }


        //if (this.QuestionnairreForm.value.organisationType == 'Other') {

        //  this.QuestionnairreForm.patchValue({ userType: '0' })

        //}

        this.QuestionnairreForm.value.Localities.push(this.QuestionnairreForm.controls['Locality1'].value, this.QuestionnairreForm.controls['Locality2'].value, this.QuestionnairreForm.controls['Locality3'].value);

        if (this.QuestionnairreForm.value.birthDate != 'NaN-NaN-NaN' && this.QuestionnairreForm.value.birthDate != 'NA') {

          //  this.DOB = this.ConvertDateFormat(this.QuestionnairreForm.value.birthDate)

          this.DOB = this.QuestionnairreForm.value.birthDate.toISOString();


          this.QuestionnairreForm.value.birthDate = this.DOB; //+ 'T00:00:00.000Z';

        }
        else {
          this.QuestionnairreForm.value.birthDate = '';
        }

        if (this.QuestionnairreForm.value.Role == "" || this.QuestionnairreForm.value.Role == null || this.QuestionnairreForm.value.Role == 'Guest') {

          this.QuestionnairreForm.value.Role = 'Partner';
        }

      //  console.log("data", this.QuestionnairreForm.value)

        if (this.QuestionnairreForm.valid && this.ValidDate == false && this.isNan == false && this.isNan1 == false && this.isNan2 == false
          && this.isNan3 == false && this.isNan4 == false) {

          this.DisplayError = false;
          // this.QuestionnairreForm.value.Role
          this.registrationservice.SubmitQuestionnairreDetails(this.QuestionnairreForm.value)

            .subscribe(
              data => {

                // if(this.UserDetails){

                //   this.GetupdatedData();

                //   }

                let a = [{ message: "Questionnaire Saved Successfully", type: "SUCCESS" }]

                this.notificationservice.ChangeNotification(a);

                // this.ResponseHelper.GetSuccessResponse(data);

                this.next_page.emit('questionnaire');

                this.UserData.Is_Questionnarie_completed = true;

                window.scroll(0, 0);

                this.commonservice.hideLoading();

              }, err => {

                window.scroll(0, 0);

                // this.ResponseHelper.GetFaliureResponse(err);
              }
            );

        }
        else {
          this.DisplayError = true;
          this.commonservice.hideLoading();

          const invalid = [];
          const controls = this.QuestionnairreForm.controls;
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }


          var invalidField = {
            "UserId": this.Registered_User_Id,
            "Url": "",
            "screen": "Basic Info",
            "method": "fromSubmit",
            "message": "UserData :- " + JSON.stringify(this.QuestionnairreForm.value),
            "error": "User Invalid Field(s) :- " + invalid.toString(),
            "date": new Date(),
            "source": "WebSite",
            "createdBy": this.Registered_User_Id,
          }
          this.loggerService.Logger(invalidField)
        }
      }
      else {
        this.DisplayError = true;
        this.commonservice.hideLoading();

        const invalid = [];
        const controls = this.QuestionnairreForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }


        var invalidField = {
          "UserId": this.Registered_User_Id,
          "Url": "",
          "screen": "Basic Info",
          "method": "fromSubmit",
          "message": "UserData :- " + JSON.stringify(this.QuestionnairreForm.value),
          "error": "User Invalid Field(s) :- " + invalid.toString(),
          "date": new Date(),
          "source": "WebSite",
          "createdBy": this.Registered_User_Id,
        }
        this.loggerService.Logger(invalidField)
      }







    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "FormSubmit",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }


  checkdate() {
    
    try {
      this.currentYear = (new Date()).getFullYear();

      if (this.DOB != "") {
        var a = this.DOB.split("/");

        if (parseInt(a[2]) > this.currentYear - 18) {
          this.ValidDate = true;
        }
        else {
          this.ValidDate = false;
        }
      }

      //   var today = new Date();
      //   var dd = today.getDate();
      //   var mm = today.getMonth() + 1; 

      //   var yyyy = today.getFullYear() -18;


    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "checkdate",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  createForm() {
    try {
      this.QuestionnairreForm = this.fb.group({
        userId: [''],
        gender: ['', Validators.required],
        birthDate: ['', Validators.required],
        knowledgeSource: ['', Validators.required],
        mentorCode: [''],
        organisationType: ['Individual', Validators.required],
        userType: ['', Validators.required],
        passiveIncome: ['', Validators.required],
        Locality1: ['', Validators.required],
        Locality2: [''],
        Locality3: [''],
        stateId: ['', Validators.required],
        countryId: ['', Validators.required],
        'addressInfo': this.fb.group({
          location: ['', Validators.required],
          flatWing: ['', Validators.required],
          locality: ['', Validators.required],
        }),
        Localities: [[]],
        Role: [''],

      })

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "createForm",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  GetCountries() {

    try {
      this.commonservice.GetCountryCode().subscribe(data => {

        this.CountryList = data.json().data.countries;


      });
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "GetCountries",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  GetSelectedCountry(event) {
    
    try {
      this.SelectedCountry = event.target.value;


      this.GetStates(this.SelectedCountry);

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "GetSelectedCountry",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  GetStates(country: any) {
    
    try {

      let param = null;

      this.commonservice.GetStates(country, param).subscribe(data => {

        this.StateList = data.json().data;

      });
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "GetStates",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }



  YouAreSelect(event) {
    
    var areyou = <HTMLInputElement>document.getElementById("areyou");
    if (event.target.value == 'Company') {
      this.CompanySelected = true;
      this.IndividualSelected = false;
      areyou.disabled = false;
    }
    else if (event.target.value == 'Individual') {
      this.CompanySelected = false;
      this.IndividualSelected = true;
      areyou.disabled = false;
    }
    else if (event.target.value == 'Other') {

      this.QuestionnairreForm.get('userType').clearValidators();
      // this.QuestionnairreForm.patchValue({userType:''})    
      areyou.disabled = true;
    }

    // if (event.target.value == 'Company') {

    //   this.CompanySelected = true;

    // } else {
    //   this.CompanySelected = false;
    // }

    // if (event.target.value == 'Individual') {

    //   this.IndividualSelected = true;
    // }
    // else {

    //   this.IndividualSelected = false;

    // }
  }

  GetMentorList() {

    try {
      var obj = new Object();
      obj['searchTerm'] = '';

      this.commonservice.GetMentorList(obj)
        .subscribe(data => {
          this.MentorList = data.json().data;
        //  console.log(this.MentorList);
          for (let i = 0; i < this.MentorList.length; i++) {

            this.List.push({ 'fullName': this.MentorList[i].fullName, 'mentorCode': this.MentorList[i].mentorCode, })

          }
         // console.log(this.List);
          // if(this.UserDetails._id){
          //   
          //   const index =  this.List.findIndex(item => item.mentorCode === this.UserDetails.myMentorCode);
          //   this.List.splice(index,1); 

          //   console.log("pop",this.List);
          // }

        },
        );
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "GetMentorList",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  ConvertDateFormat(date) {
    
    try {
      if (date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      }

      return "NA";
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "ConvertDateFormat",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  onSelect(event) {
    
    try {
      this.Selected_About_UJB = event.target.value;

      if (this.Selected_About_UJB == 'UJustBe Partner') {

        this.Is_Selected_About_UJB = true;

        this.QuestionnairreForm.get('mentorCode').setValidators([Validators.required]);


      }
      else {
        this.Is_Selected_About_UJB = false;

        this.QuestionnairreForm.get('mentorCode').clearValidators();

        this.QuestionnairreForm.patchValue({ mentorCode: "" });

      }

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "onSelect",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  GetMentorValue(mentor) {
    
    try {
      this.QuestionnairreForm.markAsDirty();
      this.QuestionnairreForm.patchValue({ mentorCode: mentor });

    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "GetMentorValue",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  Skippage() {

    try {
      this.next_page.emit('questionnaire');

      this.UserData.Is_Questionnarie_completed = true;
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "Skippage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }

  Backpage() {
    try {
      this.previous_page.emit('questionnaire');
      this.UserData.Is_OtherDetails_completed = false;
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "Backpage",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }
  }


  DefaultDropDown() {
    try {
      if (this.UserDetails.gender == null) {
        this.QuestionnairreForm.patchValue({ 'gender': "" })
      }
      if (this.UserDetails.knowledgeSource == null) {
        this.QuestionnairreForm.patchValue({ 'knowledgeSource': "" })
      }
      if (this.UserDetails.passiveIncome == null) {
        this.QuestionnairreForm.patchValue({ 'passiveIncome': "" })
      }
      // if (this.UserDetails.organisationType == null) {
      //   this.QuestionnairreForm.patchValue({ 'organisationType': "" })
      // }
       if (this.UserDetails.userType == '0') {
         this.QuestionnairreForm.patchValue({ 'userType': "" })
       }
      if (this.UserDetails.mentorCode == null) {
        this.QuestionnairreForm.patchValue({ 'mentorCode': "" })
      }
      if (this.UserDetails.countryId == 0) {
        this.QuestionnairreForm.patchValue({ 'countryId': "" })
      }
      if (this.UserDetails.stateId == 0) {
        this.QuestionnairreForm.patchValue({ 'stateId': "" })
      }
    } catch (err) {
      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "DefaultDropDown",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }

  DrpdownValues() {
    try {
      this.QuestionnairreForm.patchValue({ 'gender': "" })
      this.QuestionnairreForm.patchValue({ 'knowledgeSource': "" })
      this.QuestionnairreForm.patchValue({ 'passiveIncome': "" })
      // this.QuestionnairreForm.patchValue({ 'organisationType': "" }) 
      this.QuestionnairreForm.patchValue({ 'userType': "" })
      this.QuestionnairreForm.patchValue({ 'mentorCode': "" })
      this.QuestionnairreForm.patchValue({ 'countryId': "" })
      this.QuestionnairreForm.patchValue({ 'stateId': "" })
    } catch (err) {

      var data = {
        "UserId": this.Registered_User_Id,
        "Url": "",
        "screen": "Questionnaire",
        "method": "DrpdownValues",
        "message": "error occured",
        "error": err.toString(),
        "date": new Date(),
        "source": "WebSite",
        "createdBy": this.Registered_User_Id,
      }
      this.loggerService.Logger(data)

    }

  }


}
