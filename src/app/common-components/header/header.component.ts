import { Component, OnInit } from '@angular/core';
import { Token } from '../../manager/token';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { UserManagementService } from "src/app/service/user-management.service";
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  Token:Token;
  UserId:string;  
  AdminDetails:any='';

  constructor(private localStorage: LocalStorage,private userManagementService:UserManagementService,private notificationservice: NotificationService,private router: Router) {

  this.Token = new Token(this.router);   
  var data = this.Token.GetUserData();
  this.UserId = data.UserId;
  
   }

  ngOnInit() {    

  this.GetUserData();
   
  }

GetUserData(){

    this.userManagementService.getUser(this.UserId).subscribe(

      data => {  

        let response = data.json();         

        this.AdminDetails = response.data; 

      }, err => {
        
      }
    );
  
}

Logoutconfirm(flag:boolean){
  
  if (flag) {
    this.Logout();
  }
  else {
    
  }
}

  Logout(){

          this.Token.ClearUserData();        

          this.localStorage.removeItem('Partner_User_Id').subscribe(() => {}, () => {});
          
          // setTimeout(() => {
            this.router.navigate(['/login']);
            // let msg = [{ message: "Logout Successfully", type: "SUCCESS" }]
            // this.notificationservice.ChangeNotification(msg)
            // }, 2000);


            }

            changepassword()
            {
              this.router.navigate(['/change-password']);
            }

}
