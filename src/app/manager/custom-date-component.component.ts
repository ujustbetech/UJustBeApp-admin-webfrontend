import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-loading-overlay',
    template: `
  
   

    <div #flatpickrEl  class="ag-input-wrapper custom-date-filter" role="presentation" style="width:100%">
  
    <input  [owlDateTime]="dt1" [(ngModel)]="date" (ngModelChange)="getdate($event);" [owlDateTimeTrigger]="dt1" style="width:100%">
    <a class='input-button' title='clear' data-clear (click)="onResetDate();">
    <i class='fa fa-times'></i>
</a>
    <owl-date-time [pickerType]="'calendar'" #dt1></owl-date-time>
</div>


 
    `,
    styles: [
        `
  .custom-date-filter a {
    position: absolute;
    right: 20px;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
  }

  .custom-date-filter:after {
    position: absolute;
    content: '\f073';
    display: block;
    font-weight: 400;
    font-family: 'Font Awesome 5 Free';
    right: 5px;
    pointer-events: none;
    color: rgba(0, 0, 0, 0.54);
  }
    `
    ]
})


export class CustomDateComponent {
   
    private date: Date;
    private params: any;
    private picker: any;
    selecteddate:any;
   
    agInit(params: any): void {
        this.params = params;
      }

      getdate(e){
   
        this.selecteddate =e._d;
        this.onDateChanged();
      }

      onResetDate() {
        this.setDate(null);
        this.params.onDateChanged();
      }

      onDateChanged() {
        this.date = this.selecteddate;
        this.params.onDateChanged();
      }

      getDate(): Date {
        return this.date;
      }

      setDate(date: Date): void {
        this.date = date;
      }


}