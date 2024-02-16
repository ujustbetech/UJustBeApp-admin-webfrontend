// import * as jwt_decode from "jwt-decode";
import { Router } from "@angular/router";

export class Token {
    constructor(private router: Router) {

    }
    GetToken() {

        var token = sessionStorage.getItem(this.LoginTokenKey);
        if (token != null) {
            return token;
        }
        else {
            this.router.navigate(['/login']);
        }
    }


    private LoginTokenKey = "access_token";   
    public UserId: string =null;   
    public Role: string = null;    
    private UserData:any;
   

    SetLoginToken(Token: string): any {
        sessionStorage.setItem(this.LoginTokenKey, Token);
    }

    GetUserData() {         
       
        let data = sessionStorage.getItem("access_token"); 
        this.UserData= JSON.parse(data);
        this.UserId = this.UserData._id;
        this.Role = this.UserData.role;
        
        return this;

    }

    ClearUserData() {
        sessionStorage.removeItem('access_token');
    }

    Exists() {

        let flag: boolean = true

        if (sessionStorage.getItem("access_token") == null) {
            flag = false
        }

        return flag;
    }
}

// export class Client {
//     Client_Id:number;
//     Client_Name:string;
// }