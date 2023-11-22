import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"
import { XmlParserService } from "../xml-parser/xml-parser.service";

@Injectable()
export class SetupService {
	constructor(private http: Http, private xmlParser: XmlParserService) { }

  getSettings(): Observable<any> {
    return this.http.get("../../../assets/setup/setup.json")
			.map((response) => response.json())
  }

	getAPIRootSettings() {
		return this.getSettings().switchMap((res) => {
			return this.http.get(res.sampleApiCalls)
		})
		.switchMap((res) => {
			return this.xmlParser.parseXml(res, "")
		})
	}
}