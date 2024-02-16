import { BrowserModule } from '@angular/platform-browser';
import { NgModule,APP_INITIALIZER} from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE,DateTimeAdapter} from 'ng-pick-datetime';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LightboxModule } from 'ngx-lightbox';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS,MomentDateTimeAdapter  } from 'ng-pick-datetime-moment';
import { HttpClientModule } from "@angular/common/http";
import { AgGridModule } from '@ag-grid-community/angular';



import { AppComponent } from './app.component';
import { NotificationService } from './service/notification.service';
import { NotificationComponent } from './common-components/notification/notification.component';
import { HeaderComponent } from './common-components/header/header.component';
import { FooterComponent } from './common-components/footer/footer.component';
import { MenuComponent } from './common-components/menu/menu.component';
import { LoginComponent } from './landing-page/login/login.component';
import { RegistrationComponent } from './landing-page/registration/registration.component';
import { ForgotPasswordComponent } from './landing-page/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './landing-page/change-password/change-password.component';
import { UserManagementComponent } from './landing-page/user-management/user-management.component';
import { DashboardComponent } from './landing-page/dashboard/dashboard.component';
import { BasicInfoComponent } from './child-component/registration/basic-info/basic-info.component';
import { QuestionnaireComponent } from './child-component/registration/questionnaire/questionnaire.component';
import { KycDetailsComponent } from './child-component/registration/kyc-details/kyc-details.component';
import { PartnerListingComponent } from './child-component/registration/partner-listing/partner-listing.component';
import { BusinessListingComponent } from './landing-page/business-listing/business-listing.component';
import { BusinessListComponent } from './child-component/business-listing/business-list/business-list.component';
import { ProductListComponent } from './child-component/business-listing/product-list/product-list.component';
import { ServiceListComponent } from './child-component/business-listing/service-list/service-list.component';
import { ListedbusinesListComponent } from './child-component/business-listing/listedbusines-list/listedbusines-list.component';
import { AuthGuard } from './auth.guard';
import { AdminRegisterationComponent } from './landing-page/admin-registeration/admin-registeration.component';
import { PromotionComponent } from './landing-page/promotion/promotion.component';
import { PartnerConnectionComponent } from './child-component/registration/partner-connection/partner-connection.component';
import { PartneReferrralListComponent } from './child-component/Lead-Managment/partne-referrral-list/partne-referrral-list.component';
import { ReferralDetailsComponent } from './child-component/Lead-Managment/referral-details/referral-details.component';
import { OtherDetailsComponent } from './child-component/registration/other-details/other-details.component';
import { FeeManagementComponent } from './landing-page/fee-management/fee-management.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NumericDirective } from './Common/numeric.directive';
import {CustomDateComponent} from "./manager/custom-date-component.component";
import {AppConfigService} from './service/app-config.service';
import { ReferralTrackingComponent } from './landing-page/referral-tracking/referral-tracking.component';



export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY',
  fullPickerInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm:ss',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
      return appConfig.loadAppConfig();
  }
};


const appRoutes: Routes = [
 
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard], data: { route: ['registeration'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-registeration', component: AdminRegisterationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard], data: { route: ['change-password'] } },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { route: ['user-management'] } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { route: ['dashboard'] } },
  { path: 'partner-list', component: PartnerListingComponent, canActivate: [AuthGuard], data: { route: ['partner-list'] } },
  { path: 'add-business', component: BusinessListingComponent, canActivate: [AuthGuard], data: { route: ['add-business'] } },
  { path: 'product-listing', component: ProductListComponent, canActivate: [AuthGuard], data: { route: ['product-listing'] } },
  { path: 'service-listing', component: ServiceListComponent, canActivate: [AuthGuard], data: { route: ['service-listing'] } },
  { path: 'Business-list', component: ListedbusinesListComponent, canActivate: [AuthGuard], data: { route: ['Business-list'] } },
  { path: 'promotion', component: PromotionComponent,canActivate: [AuthGuard], data: { route: ['promotion'] }},
  { path: 'referral-details', component: ReferralDetailsComponent,canActivate: [AuthGuard], data: { route: ['referral-details'] }},
  { path: 'referral-list', component: PartneReferrralListComponent,canActivate: [AuthGuard], data: { route: ['referral-list'] }},
  { path: 'fee-management', component: FeeManagementComponent,canActivate: [AuthGuard], data: { route: ['fee-management'] }},
  { path: 'Referral-list', component: ReferralTrackingComponent, canActivate: [AuthGuard], data: { route: ['ReferralTracking-list'] } },
 
];
@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    UserManagementComponent,
    DashboardComponent,
    BasicInfoComponent,
    QuestionnaireComponent,
    KycDetailsComponent,
    PartnerListingComponent,
    BusinessListingComponent,
    BusinessListComponent,
    ProductListComponent, 
    ServiceListComponent, 
    ListedbusinesListComponent, 
    PromotionComponent,  
    AdminRegisterationComponent,
     PartnerConnectionComponent,
     PartneReferrralListComponent,
     ReferralDetailsComponent,
     OtherDetailsComponent,
     FeeManagementComponent,
     NumericDirective,
     CustomDateComponent,
     ReferralTrackingComponent,
    

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AgGridModule.withComponents([CustomDateComponent]),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    LightboxModule,
    MatAutocompleteModule,
    Ng4LoadingSpinnerModule.forRoot(),
    OwlMomentDateTimeModule,
    HttpClientModule,
   
    // StorageModule.forRoot({
    //   IDBNoWrap: true,
    // }),
    

    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' })


  ],
  providers: [NotificationService,
     { provide: LocationStrategy, useClass: HashLocationStrategy },
  
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    AppConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: appInitializerFn,
        multi: true,
        deps: [AppConfigService]
    }
  ],
 
  bootstrap: [AppComponent],
  

})
export class AppModule { }
