import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { NgModule } from '@angular/core';
import { InvoicesHistoryComponent } from './pages/invoices-history/invoices-history.component';
import { InvoicesResolver } from './shared/invoices.resolver';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { SenderAccountListComponent } from './pages/sender-account-list/sender-account-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'transfer',
        pathMatch: 'full',
      },
      {
        path: 'transfer',
        loadChildren: './transfer/transfer.module#TransferModule'
      },
      {
        path: 'accounts',
        component: SenderAccountListComponent,
        data: {
          title: 'SENDER_ACCOUNTS'
        }
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: {
          title: 'CHANGE_PASSWORD'
        }
      },
			{
				path: 'invoices-history',
				component: InvoicesHistoryComponent,
				resolve: {
					invoices: InvoicesResolver
				},
				data: {
					title: 'INVOICE_HISTORY'
				}
			},
			{
				path: 'invoice/:number',
				component: InvoiceComponent,
				data: {
					title: 'INVOICE_DETAILS'
				}
			}
    ]
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
		children: [
      {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
      }
    ]
	},
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
