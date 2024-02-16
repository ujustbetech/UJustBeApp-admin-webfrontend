export class Notification {
    public type:string;
    public message:string;

    constructor(message:string,type:string){
        this.message = message;
        this.type = type;
    }
}