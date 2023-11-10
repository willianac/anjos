import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[appPhoneMask]"
})
export class PhoneMaskDirective {
	constructor(private ngControl: NgControl) {}

	@HostListener('input', ['$event'])
  onInput(event: any): void {
    const newVal = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (newVal.length <= 2) {
      this.updateValue(`+ ${newVal}`);
    } else if (newVal.length <= 4) {
      this.updateValue(`+ ${newVal.slice(0, 2)} (${newVal.slice(2)})`);
    } else if (newVal.length <= 12) {
      this.updateValue(`+ ${newVal.slice(0, 2)} (${newVal.slice(2, 4)}) ${newVal.slice(4, 8)}-${newVal.slice(8)}`);
    } else {
      this.updateValue(`+ ${newVal.slice(0, 2)} (${newVal.slice(2, 4)}) ${newVal.slice(4, 9)}-${newVal.slice(9)}`);
    }
  }

  private updateValue(value: string): void {
    this.ngControl.control.setValue(value);
  }
}