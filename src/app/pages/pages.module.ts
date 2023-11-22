import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { RegisterComponent } from './register/register.component';

import { PagesRoutingModule } from './pages-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { LoadingModule } from 'ngx-loading';

import { LoginService } from '../services/login/login.service';
import { LanguageService } from '../services/language/language.service';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LanguageListComponent } from '../shared/language-list/language-list.component';
import { SetupService } from 'app/services/setup/setup.service';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';

@NgModule({
  imports: [ 
    PagesRoutingModule, 
    TranslateModule,
    LoadingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    P404Component,
    P500Component,
    RegisterComponent,
    LoginComponent,
    RecoverPasswordComponent,
    LanguageListComponent,
		PaymentStatusComponent
  ],
  providers: [
    LoginService,
    LanguageService,
		SetupService,
		GeolocationService,
		NewSenderService
  ]
})
export class PagesModule { }
