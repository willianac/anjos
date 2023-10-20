import { Component } from '@angular/core';
import { LanguageService, LANGUAGE_LIST, LanguageItem } from '../../services/language/language.service';

@Component({
  selector: 'language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent {

  public languageList = LANGUAGE_LIST;

  constructor(
    public language: LanguageService,
  ) { }

  public changeLanguage(lang: LanguageItem) {
    this.language.set(lang.code);
  } 

}
