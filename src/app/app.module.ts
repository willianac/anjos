import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

// Translate Module
import { Http, HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

// Spinner
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

// Session
import { SessionService } from './services/session/session.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LanguageService } from './services/language/language.service';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

import { LoginService } from './services/login/login.service';

import { SenderAccountService } from './services/sender-account/sender-account.service';

import { TextMaskModule } from 'angular2-text-mask';

import { PagesModule } from './pages/pages.module';
import { TransferModule } from './transfer/transfer.module';
import { XmlParserService } from './services/xml-parser/xml-parser.service';
import { InvoicesHistoryComponent } from './pages/invoices-history/invoices-history.component';
import { InvoicesService } from './services/invoices/invoices.service';
import { InvoicesResolver } from './shared/invoices.resolver';
import { InvoiceComponent } from './pages/invoice/invoice.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.threeBounce,
        backdropBackgroundColour: 'red',
        backdropBorderRadius: '14px',
        primaryColour: '#000',
        secondaryColour: '#000',
        tertiaryColour: '#000'
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 3,
      autoDismiss: true,
      timeOut: 20 * 1000,
      closeButton: true
    }), // ToastrModule added
    TextMaskModule,
    PagesModule,
    TransferModule,
		ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    ChangePasswordComponent,
		InvoicesHistoryComponent,
		InvoiceComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    SessionService,
    LanguageService,
    LoginService,
    SenderAccountService,
		XmlParserService,
		InvoicesService,
		InvoicesResolver
  ],
  bootstrap: [ AppComponent ],
  exports: [
    TranslateModule,
    LoadingModule
  ]
})
export class AppModule { }
