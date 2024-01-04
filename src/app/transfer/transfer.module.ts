import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { ReceiverListComponent } from './receiver-list/receiver-list.component';
import { PurposeListComponent } from './purpose-list/purpose-list.component';
import { ReceiverAccountListComponent } from './receiver-account-list/receiver-account-list.component';
import { AmountComponent } from './amount/amount.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentComponent } from './payment/payment.component';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferService } from '../services/transfer/transfer.service';

import { TranslateModule } from '@ngx-translate/core';
import { LoadingModule } from 'ngx-loading';

import { ToastrModule } from 'ngx-toastr';

import { LanguageService } from '../services/language/language.service';

import { ModalModule, ModalBackdropComponent, ModalDirective } from 'ngx-bootstrap/modal';
import { Last4DigitsPipe } from 'app/shared/last-4-digits.pipe';
import { NewReceiverComponent } from './new-receiver/new-receiver.component';
import { NewReceiverAccountComponent } from './new-receiver-account/new-receiver-account.component';
import { NewReceiverService } from 'app/services/new-receiver/new-receiver.service';
import { KinshipService } from 'app/services/kinship/kinships.service';
import { BankInfoService } from 'app/services/bank-info/bank-info.service';
import { GeographyService } from 'app/services/geography/geography.service';
import { SharedModule } from 'app/shared/shared.module';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { AfricanFormComponent } from 'app/components/african-form/african-form.component';
import { GenericFormComponent } from 'app/components/generic-form/generic-form.component';


@NgModule({
  imports: [
    TransferRoutingModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    LoadingModule,
		ReactiveFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    ModalModule.forRoot(),
		SharedModule
  ],
  declarations: [
    ReceiverListComponent,
    PurposeListComponent,
    ReceiverAccountListComponent,
    AmountComponent,
    SummaryComponent,
		PaymentComponent,
		NewReceiverComponent,
		NewReceiverAccountComponent,
		CashPaymentComponent,
		Last4DigitsPipe,
		AfricanFormComponent,
		GenericFormComponent
  ],
  entryComponents: [
  ],
  providers: [
    TransferService,
    LanguageService,
		NewReceiverService,
		KinshipService,
		BankInfoService,
		GeographyService,
		GeolocationService
  ]
})
export class TransferModule { }
