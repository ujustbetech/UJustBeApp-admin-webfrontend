import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Notification } from "../manager/notification";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private Notification: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
    notify: Observable<Notification[]> = this.Notification.asObservable();

    constructor() { }

    ChangeNotification(obj) {
       
        this.Notification.next(obj);
    }
}