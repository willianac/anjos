import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SenderAccountListComponent } from './pages/sender-account-list/sender-account-list.component';

import { SenderAccountService } from './services/sender-account/sender-account.service';

import { TextMaskModule } from 'angular2-text-mask';

import { PagesModule } from './pages/pages.module';
import { TransferModule } from './transfer/transfer.module';

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
    TransferModule
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
    SenderAccountListComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    SessionService,
    LanguageService,
    LoginService,
    SenderAccountService
  ],
  bootstrap: [ AppComponent ],
  exports: [
    TranslateModule,
    LoadingModule
  ]
})
export class AppModule { }
