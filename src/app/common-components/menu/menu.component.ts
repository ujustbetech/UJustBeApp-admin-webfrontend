import { Component, OnInit, Input } from '@angular/core';
import { CommonService} from './../../service/common.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  MenuName:string = "Partner";
  SubMenuName = '';
  @Input()  Activeurl;

  constructor(private router: Router,private localStorage:LocalStorage,private commonService:CommonService) { 

  }

  ngOnInit() {
    
  
   if(this.MenuName != 'Referral_list')
   {
    this.localStorage.removeItem('SearchParameter').subscribe(() => {
    });
   }
   if(this.Activeurl == '/referral-details'){          
      
    this.localStorage.removeItem('ActivePage').subscribe(() => {
    });
   }

  }
  UserManagement()
  {
    this.MenuName="User_Management";
    
  }
  ResetData(){
    this.localStorage.removeItem('SearchParameter').subscribe(() => {
    });
  
    this.commonService.changeData("");
    this.localStorage.setItem('AddEdit','Add').subscribe(() => {});
    this.localStorage.setItem('BecomeMember','New_User').subscribe(() => {});  
    this.localStorage.removeItem('Partner_User_Id').subscribe(() => {}, () => {});
  if(this.Activeurl == '/referral-details'){          
      
      this.localStorage.setItem('SetCurrentTab','basic').subscribe(() => {});

      this.router.navigate(['/registration']);
    }
    else{
      this.router.navigate(['/registration']);
    }

  }

  GetFeemangement(){
this.localStorage.removeItem('SearchParameter').subscribe(() => {
  });

    this.localStorage.setItem('SubscriptionFrom', 'FeeManagement').subscribe(() => { });
    this.router.navigate(['/fee-management']);
  }
  
  GetReferralListing  (){

   // this.localStorage.setItem('SubscriptionFrom', 'Referral_list').subscribe(() => { });
    this.router.navigate(['/Referral-list']);
  }
}
