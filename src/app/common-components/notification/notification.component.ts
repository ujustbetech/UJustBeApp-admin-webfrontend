import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/manager/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  Notifications: Notification[] = new Array<Notification>();
  constructor(private notificationservice: NotificationService, private route: Router) { }

  ngOnInit() {
    this.notification()
  }

  notification() {

    this.notificationservice.notify.subscribe(res => {
      if (Array.isArray(res)) {
        if (res.length != 0) {
          res.forEach(e => {
            this.Notifications.unshift(e)
          });
        }
        setTimeout(() => {
          for (let i = 0; i < res.length; i++) {
            setTimeout(() => {
              this.Notifications.pop();
            }, i * 3000);
          }
        }, 1 * 3000);
      }
      else {
        let err = [];
        err.unshift(res)
        this.Notifications = (err)
        setTimeout(() => {
          this.Notifications = [];
        }, 1 * 3000);
      }
    })
  }

  logOut() {
    // this.route.navigate(['/login']);
  }

}
