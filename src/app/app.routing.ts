
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { SenderAccountListComponent } from './pages/sender-account-list/sender-account-list.component';


// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { NgModule } from '@angular/core';

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
