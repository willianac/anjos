import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiverListComponent } from './receiver-list/receiver-list.component';
import { PurposeListComponent } from './purpose-list/purpose-list.component';
import { ReceiverAccountListComponent } from './receiver-account-list/receiver-account-list.component';
import { AmountComponent } from './amount/amount.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentComponent } from './payment/payment.component';
import { NewReceiverComponent } from './new-receiver/new-receiver.component';
import { NewReceiverAccountComponent } from './new-receiver-account/new-receiver-account.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { QrBillComponent } from './qr-bill/qr-bill.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'amount',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: 'TRANSFER'
    },
    children: [
			{
				path: 'amount',
        component: AmountComponent,
        data: {
          title: 'TRANSFER_AMOUNT'
        }
			},
      {
        path: 'receiver',
        component: ReceiverListComponent,
        data: {
          title: 'SELECT_RECEIVER'
        },
      },
			{
				path: 'cash-payment',
				component: CashPaymentComponent,
				data: {
					title: 'LOCATION'
				}
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
					title: 'Make payment'
				}
			},
			{
				path: 'new',
				children: [
					{
						path: 'receiver',
						component: NewReceiverComponent,
						data: {
							title: 'NEW_RECEIVER'
						}
					},
					{
						path: 'receiver-account',
						component: NewReceiverAccountComponent,
						data: {
							title: 'NEW_RECEIVER_ACCOUNT'
						}
					}
				]
			},
			{
				path: 'qr-bill',
				component: QrBillComponent,
				data: {
					title: 'Qr Bill'
				}
			}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
