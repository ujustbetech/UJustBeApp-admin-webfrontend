import { NotificationService } from './../service/notification.service';

export class ResponseHelper {
    constructor(private notification: NotificationService) { }

    GetSuccessResponse(httpres): number {
        ;
        let notifydata = httpres.json().message;
        switch (httpres.status) {
            case 200:
            case 201:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ message: "Successful", type: "SUCCESS" }])
                break;
        }
        return httpres.status;
    }

    GetFaliureResponse(httpres) {
        let notifydata = [];
        if (httpres.status == 500) {
            notifydata = null;
        }
        else { notifydata = httpres.json().message; }
        switch (httpres.status) {
            case 400:
                notifydata[0].type != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ message: "Bad Request", type: "ERROR" }])
                break;
            case 401:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ message: "Unauthorized", type: "ERROR" }])
                // window.location.href = "/login"
                //sessionStorage.clear();
                break;
            case 403:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ message: "User Account is Terminated", type: "ERROR" }])
                break;
            case 404:
                this.notification.ChangeNotification([{ message: "Request not found", type: "ERROR" }]);
            case 405:
                // notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "CORS error", Type: "ERROR" }])
                break;
                case 406:
                 notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ message: "Not Acceptable", type: "ERROR" }])
                break;
            case 500:
            case 0:
                this.notification.ChangeNotification([{ message: "Internal Server Error", type: "ERROR" }])
                break;
        }
        return httpres.status;
    }
}
