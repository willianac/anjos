import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiverListComponent } from './receiver-list/receiver-list.component';
import { PurposeListComponent } from './purpose-list/purpose-list.component';
import { ReceiverAccountListComponent } from './receiver-account-list/receiver-account-list.component';
import { AmountComponent } from './amount/amount.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentComponent } from './payment/payment.component';
import { NewReceiverComponent } from './new-receiver/new-receiver.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'receiver',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: 'TRANSFER'
    },
    children: [
      {
        path: 'receiver',
        component: ReceiverListComponent,
        data: {
          title: 'SELECT_RECEIVER'
        },
      },
      {
        path: 'receiverAccount',
        component: ReceiverAccountListComponent,
        data: {
          title: 'SELECT_RECEIVER_BANK_ACCOUNT'
        }
      },
      {
        path: 'purposeList',
        component: PurposeListComponent,
        data: {
          title: 'SELECT_PURPOSE'
        }
      },
      {
        path: 'amount',
        component: AmountComponent,
        data: {
          title: 'TRANSFER_AMOUNT'
        }
      },
      {
        path: 'summary',
        component: SummaryComponent,
        data: {
          title: 'ORDER_SUMMARY'
        }
      },
			{
				path: 'payment',
				component: PaymentComponent,
				data: {
					title: 'PAYMENT'
				}
			},
			{
				path: 'new',
				children: [
					{
						path: 'receiver',
						component: NewReceiverComponent
					}
				]
			}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
