import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ShowElement: boolean = false;
  MenuName: string;
  DisplayMenu;
  activeurl;

  constructor(private router: Router) { }


  ngOnInit() {

  }

  
  ChangeRouteName(event) {
    this.activeurl=event.router.url;
    this.ShowElement = true;
    if (event.router != undefined) {

      switch (event.router.url) {
        case '/login':
          this.ShowElement = false;
          break;
        case '/forgot-password':
          this.ShowElement = false;
          break;
        case '/change-password':
          this.ShowElement = false;
          break;
        case '/admin-registeration':
          this.ShowElement = false;
          break;
      }

    }
    else {
      this.ShowElement = true;
    }




  }





}
