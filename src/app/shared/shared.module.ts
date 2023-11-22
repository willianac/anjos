import { NgModule } from "@angular/core";
import { PhoneMaskDirective } from "./phone-mask.directive";

@NgModule({
	imports: [],
	declarations: [PhoneMaskDirective],
	exports: [PhoneMaskDirective]
})
export class SharedModule {}