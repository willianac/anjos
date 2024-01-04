import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs";
import * as xml2js from 'xml2js';

@Injectable()
export class XmlParserService {
	public parseXml(response: Response, key: string): Observable<any> {	
		const body = response.text().replace(/&/g,"&amp;")
		const parser = new xml2js.Parser({explicitArray: false})

		return new Observable((observer) => {
			parser.parseString(body, (err, result) => {
				if(err) {
					observer.error(err)
				} else {
					if(result.AuthenticationResponse) {
						return observer.error(result.AuthenticationResponse.Message)
					}
					observer.next(result[key])
					observer.complete()
				}
			})
		})
	}
}