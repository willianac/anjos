import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../session/session.service';

export class LanguageItem {
  public code: string;
  public flag: string;
  public name: string;
  
  constructor(
    code:string,
    flag:string,
    name:string
  ) {
    this.code = code,
    this.flag = flag;
    this.name = name;
  }
}

export const LANGUAGE_LIST = [
  new LanguageItem('en', '/assets/img/flags/US.png', 'English'),
  new LanguageItem('pt', '/assets/img/flags/BR.png', 'Português'),
]

@Injectable()
export class LanguageService {

  private languageKey = 'language';

  constructor(
    public session: SessionService,
    public translate: TranslateService
  ) { }

  set(lang): void {
    this.session.set(this.languageKey, lang);
    this.translate.use(lang);
  }

  get(): string {
    return this.session.get(this.languageKey);
  }

  getLanguage(langKey: string): LanguageItem {
    let lang = null;
    LANGUAGE_LIST.forEach(element => {
      if (element.code === langKey) {
        return lang = element;
      }
    });
    return lang;
  }

  getCurrentLanguage(): LanguageItem {
    const langKey = this.get();
    return this.getLanguage(langKey);
  }
}
