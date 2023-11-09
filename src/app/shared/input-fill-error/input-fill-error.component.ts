import { Component, Input } from "@angular/core";

@Component({
	selector: "app-input-fill-error",
	templateUrl: "./input-fill-error.component.html",
	styleUrls: ["./input-fill-error.component.scss"]
})
export class InputFillErrorComponent {
	@Input() description: string
}