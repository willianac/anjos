import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as xml2js from 'xml2js';
import 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';


@Injectable()
export class ConnectionService {

  private serverUrl: string;

  constructor(public http: Http) {
		const setup = setupData as AppSetup
		this.serverUrl = setup.apiUrl
  }

  private makeUrl(url, data) {
    const str = [];
    for (const p in data) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
    }
    return url + '?' + str.join('&');
  }

  public createRequest(params) {
    const parser = new xml2js.Parser({explicitArray: false})
    const url = this.makeUrl(this.serverUrl, params);
    return Rx.Observable.create((observer: any) => {
      this.http.get(url)
        .timeout(30000)
        .subscribe({
        next: (x: any) => {
          parser.parseString(x._body, (err, result) => {
            if (err) {
              throw err;
            }
            observer.next(result.responsestring);
          });
        }
      })
    })
  }

}
