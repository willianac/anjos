import { Component } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { LanguageService } from '../../services/language/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purpose-list',
  templateUrl: './purpose-list.component.html',
  styleUrls: ['./purpose-list.component.scss']
})
export class PurposeListComponent {

  public purposeList;
  public currentLang;

  constructor(
    public session: SessionService,
    public router: Router,
    public language: LanguageService
  ) {
    this.getList();
    this.currentLang = this.language.get();
  }
  
  sanitizeArray(list) {
    return [].concat(list) || null
  }

  getList() {
    this.purposeList = this.sanitizeArray(this.session.get('purposeList'));
  }

  select(purpose) {
    this.session.set('currentPurpose', purpose);
    this.router.navigate(['admin', 'transfer', 'amount']);
  }

}
