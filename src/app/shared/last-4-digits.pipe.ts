import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "last4digits"
})
export class Last4DigitsPipe implements PipeTransform {
	transform(value: string, ...args: any[]) {
		const digitsArray = value.split("");
		const last4Digits = digitsArray.slice(digitsArray.length - 4).join("")
		return last4Digits
	}
}