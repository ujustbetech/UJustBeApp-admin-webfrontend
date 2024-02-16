import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registeration',
  templateUrl: './admin-registeration.component.html',
  styleUrls: ['./admin-registeration.component.css']
})
export class AdminRegisterationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
