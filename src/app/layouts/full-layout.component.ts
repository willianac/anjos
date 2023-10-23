import { Component } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { LanguageService, LANGUAGE_LIST, LanguageItem } from '../services/language/language.service';
import { Router } from '@angular/router';
import { AppSetup } from 'assets/setup/setup';
const setup = require("../../assets/setup/setup.json")

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent {

  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};
  public currentLanguage: LanguageItem;
  public languageList = LANGUAGE_LIST;

  public displayName
	public appSetup: AppSetup

  constructor(
    public session: SessionService,
    public language: LanguageService,
    public router: Router,
  ) {
    const sender = this.session.get('moneySender')
    this.displayName = `${sender.SenderFirstName} ${sender.SenderLastName}`;
    this.getCurrentLanguage();
		this.appSetup = setup;
  }

  public getCurrentLanguage() {
    this.currentLanguage = this.language.getCurrentLanguage();
  }

  public changeLanguage(lang: LanguageItem) {
    this.language.set(lang.code);
    this.currentLanguage = lang;
  }

  public doLogout() {
    const lastEmail = this.session.get('lastEmail');
    this.session.clear();
    this.session.set('lastEmail', lastEmail);
    this.router.navigate(['login']);
  }

}
