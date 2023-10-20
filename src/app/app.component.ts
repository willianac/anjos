import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { SessionService } from './services/session/session.service';
import { LanguageService } from './services/language/language.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor (
    public http: Http,
    public translate: TranslateService,
    public session: SessionService,
    public language: LanguageService
  ) {
      translate.addLangs(["en", "pt"]);
      translate.setDefaultLang('en');

      let lang = this.language.get();
      if (lang) {
        translate.use(lang);
      } else {
        let browserLang = translate.getBrowserLang();
        lang = browserLang.match(/en|pt/) ? browserLang : 'en';
        this.language.set(lang);
      }
  }
}
