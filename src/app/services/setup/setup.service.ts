import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"

@Injectable()
export class SetupService {
	constructor(private http: Http) { }

  getSettings(): Observable<any> {
    return this.http.get("../../../assets/setup/setup.json")
			.map((response) => response.json())
  }
}